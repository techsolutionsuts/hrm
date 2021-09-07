const nodemailer = require('nodemailer');
const chalk = require('chalk');
const Company = require('../models/company-model');
const EmailMessage = require('../models/email_megs-model');
const color = chalk.bgBlue.black.underline;

let transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.USER_HOST,
        pass: process.env.PASS_HOST
    },
    tls:{
      rejectUnauthorized:false
    }
});
  
exports.sendMail = async (header, content) => {
  const company = await Company.findOne({ where: { deleted: 0 } });
  const from = `"${(company)?company.name:'Staidorf HRMS'}" <${process.env.USER_HOST}>`;
  let mailOptions = {
      from: from,
      to: header[0],
      subject: header[1],
      text: 'Mailer',
      html: content
    };
  
  const outBox = await new EmailMessage({
    from: from,
    to: header[0],
    subject: header[1],
    content: content,
    attempts: 1,
    userId: header[2]
  });
  const saveMeg = await outBox.save();
  // console.log('Out box', saveMeg);
  await transporter.sendMail(mailOptions, async(error, info) => {
    if (error) {
      // The mail has been que and will be try later
      await EmailMessage.update({ status: 0 }, { where: { id: saveMeg.id } });
      console.log(error);
      return 0;
      }
      // console.log(color('Message sent: %s', info.messageId));
      // console.log(color('Preview URL: %s', nodemailer.getTestMessageUrl(info)));
    return 1;

  });
}

exports.resendEmails = async () => {
  const mails = await EmailMessage.findAll({ where: { status: 0 } });
  for (let i = 0; i < mails.length; i++) {
    const attemp = mails[i].attempts + 1;
    const from = `${mails[i].from}`;
    const to = mails[i].to;
    const content = `${mails[i].content}`;
    let mailOptions = {
      from: from,
      to: to,
      subject: `${mails[i].subject}`,
      text: 'Mailer',
      html: content
    };
  
        // console.log('Out box', saveMeg);
    await transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        // The mail has been que and will be try later
        await EmailMessage.update({ attempts: attemp, status:0 }, { where: { id: mails[i].id } });
        return console.log(error);
      }
      // console.log(color('Message sent: %s', info.messageId));
      // console.log(color('Preview URL: %s', nodemailer.getTestMessageUrl(info)));
        await EmailMessage.update({status:1, attempts: attemp }, { where: { id: mails[i].id } });

    });
  }
}