const fetch = require("node-fetch");
const db = require("../db").connect();

const getRecords = async function(username){
    return await db.query(`select cuid, alias from Alias where username = '${username}'`).all();
}

const mergeRecords = function(reports, records){
    return reports.map(p => {
        let [v] = records.filter(r => r.cuid == p.cUID);
        return v ? (p.alias = v.alias, p) : (p.alias='', p)
    })
}


exports.login = (request, response) => {
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

exports.reports = async (request, response) => {
    const {username} = request.params
    const res = await fetch(`http://labs.visualbi.com:2439/luna/reports/${username}&true`,
            { method: 'GET',  headers: {'Content-Type':'application/json'} })
    const objs = await res.json()
    const records = await getRecords(username);
    return response.send(mergeRecords(objs, records))
}

exports.alias = (request, response) => {
    const {username, cUID, alias} = request.body
    return db.query(`update Alias set username='${username}',cuid='${cUID}',alias='${alias}' upsert where cuid='${cUID}'`)
    .then(res =>  res ).catch(err => err)
}

exports.createSchedule = async (request, response) => {
    try{
        const {type, startDate, endDate, executeOn, scheduleId} = request.body;
        const schedule = await db.query(`update MailSchedule set type= :type, startDate= :startDate, endDate= :endDate, executeOn= :executeOn upsert where @rid= ${scheduleId}`,
        {params:{ type: type, startDate: startDate, endDate: endDate, executeOn: executeOn}}).one()
        if(scheduleId != schedule['@rid']){
            await db.create('EDGE', 'mailScheduleHasAlias').from(schedule['@rid']).to(alias.id).one();
        }
        return response.send(schedule)
    } catch(e){
        const error = new Error(e)
        return response.send(error)
    }
}

exports.deleteSchedule = (request, response) => {
    const {type, startDate, endDate, executeOn} = request.body;
    return db.query('update MailSchedule set type= :type, startDate= :startDate, endDate= :endDate, executeOn= :executeOn',
    {params:{ type: type, startDate: startDate, endDate: endDate, executeOn: executeOn}}).one().then(res =>  res ).catch(err => err)
}

