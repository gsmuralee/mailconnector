const fetch = require("node-fetch");
const db = require("../db").connect();

const mergeRecords = async function(username, reports){
    const records = await db.query(`select cuid, alias from Alias where username in (${username})`).all();
}

exports.login = (request, response) => {
    console.log(request.body)
    const {username, password, authtype} = request.body
    const body = {username, password, authtype:"secLDAP"}

    return fetch("http://labs.visualbi.com:2439/v1/login",
    { method: 'POST', body: JSON.stringify(body), headers: {'Content-Type':'application/json'} })
    .then(res => res.json())
    .then(json => {
        console.log(json)
        return response.send(json)
    });
}

exports.reports = (request, response) => {
    const {username} = request.params

    return fetch(`http://labs.visualbi.com:2439/luna/reports/${username}&true`,
    { method: 'GET',  headers: {'Content-Type':'application/json'} })
    .then(res => res.json())
    .then(json => {

        return response.send(json)
    });
}

exports.alias = (request, response) => {
    const {username, cUID, alias} = request.body
    return db.query(`update Alias set username='${username}',cuid='${cUID}',alias='${alias}' upsert where cuid='${cUID}'`)
    .then(res =>  res ).catch(err => err)
}

