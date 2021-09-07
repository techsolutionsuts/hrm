exports.newTask = async (data) => {
  return await `
    <h3 style="color: #00008B;">Hi ${data[0]},</h3>
    <h3 style="text-decoration: underline;">${data[6]}</h3>
    
    <h4 style="text-decoration: underline;">Task Info</h4>
    <ul>
      <li>Task Name: ${data[1]}</li>
      <li>${data[2]}</li>
      <li>Due Date: ${data[3]}</li>
      <li>Assigned by: ${data[4]}</li>
    </ul>
    <h5 style="text-decoration: underline;">Task Description</h5>
    ${data[5]}
    <br>
    <br>
    <hr>
    Login with your credentials to get more details
    <br>
    <span style="color:red">Please do not reply this email !!!</span>
    <br>
    
<div style="display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #e9ecef;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);">
  <span>Copyright &copy; Powered by <a href="https://www.staidorfconsult.com/">Staidorf Consult</a></span>
</div>
    `;
}

exports.taskCompleted = async (data) => {
  return await `
    <h3 style="color: #00008B;">Hi ${data[0]},</h3>
    <h3 style="text-decoration: underline;">${data[6]}</h3>
    
    <h4 style="text-decoration: underline;">Task Info</h4>
    <ul>
      <li>Task Name: ${data[1]}</li>
      <li>Created Date:${data[2]}</li>
      <li>Due Date: ${data[3]}</li>
      <li>Date Completed: ${data[7]}</li>
      <li>Over due: ${data[8]}</li>
      <li>Assigned to: ${data[4]}</li>
    </ul>
    <h5 style="text-decoration: underline;">Task Description</h5>
    ${data[5]}
    <br>
    <br>
    <hr>
    Login with your credentials to get more details
    <br>
    <span style="color:red">Please do not reply this email !!!</span>
    <br>
    
<div style="display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #e9ecef;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);">
  <span>Copyright &copy; Powered by <a href="https://www.staidorfconsult.com/">Staidorf Consult</a></span>
</div>
    `;
}