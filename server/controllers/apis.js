const fetch = require("node-fetch");

exports.login = (request, response) => {
    const body = {
        "username": "muraligs",
        "password": "May-018",
        "authtype": "secLDAP"
    }
    return fetch("http://labs.visualbi.com:2438/v1/login",
    { method: 'POST', body: JSON.stringify(body), headers: {'Content-Type':'application/json'} })
    .then(res => res.json())
    .then(json => {
        console.log(json)
        return response.send(json)
    });
}

