const base_url = require('./base-url');
const axios = require('axios');
const FormData = require('form-data');
const form = new FormData();
form.append("email", "");
form.append("password", "")
const header = form.getHeaders();

module.exports = {
    authenticate: (email, password) => axios({
        method: "POST",
        url: base_url.BASE_URL + `/auth/login`,
        header: { "content-type": "application/x-www-form-urlencoded" },
        param: { "email": "", "password": "" }
        // form
        // {
        //     // "content-type": "application/x-www-form-urlencoded",
        //     "content-type": "application/json",
        //     "type": "text"
        //         // "accept": "*/*"
        // }
    })
}