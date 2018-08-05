const fetch = require("node-fetch");

exports.login = (request, response) => {
    console.log(request.body)
    const {username, password, authtype} = request.body
    const body = {username, password, authtype:"secLDAP"}

    return fetch("http://labs.visualbi.com:2438/v1/login",
    { method: 'POST', body: JSON.stringify(body), headers: {'Content-Type':'application/json'} })
    .then(res => res.json())
    .then(json => {
        console.log(json)
        return response.send(json)
    });
}

exports.results = (request, response) => {
    const {username} = request.params

    return fetch(`http://labs.visualbi.com:2438/luna/reports/${username}&false`,
    { method: 'GET',  headers: {'Content-Type':'application/json'} })
    .then(res => res.json())
    .then(json => {
        console.log(json)
        return response.send(json)
    });
}

