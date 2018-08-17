const fetch = require("node-fetch");
const db = require("../db").connect();
const scheduleHelper = require('../schedule')

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
    const body = {username, password, authtype}
    const origin = request.get('origin');
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    return fetch("http://labs.visualbi.com:2439/v1/login",
    { method: 'POST', body: JSON.stringify(body), headers: {'Content-Type':'application/json'} })
    .then(res => res.json())
    .then(json => {
        return response.send(json)
    });
}

exports.reports = async (request, response) => {
    const {username} = request.params
    const res = await fetch(`http://labs.visualbi.com:2439/luna/reports/${username}&false`,
            { method: 'GET',  headers: {'Content-Type':'application/json'} })
    const objs = await res.json()
    const records = await getRecords(username);
    return response.send(mergeRecords(objs, records))
    //return response.send(objs)
}

exports.alias = async (request, response) => {
    try{
        const {username, cUID, alias, email} = request.body
        await db.query(`update Alias set username='${username}',cuid='${cUID}',alias='${alias}', email='${email}' upsert where cuid='${cUID}'`)
        const [record] = await db.query(`select @rid from Alias where cuid='${cUID}'`);
        if(!record) throw new Error('Error inserting record')
        return response.send(record);
    } catch(e){
        return response.send(e);
    }
}

exports.createSchedule = async (request, response) => {
    try{
        const {type, startDate, endDate, executionTime, cuid, userEmail} = request.body;
        const [alias] =  await db.query(`select * from Alias where cuid = '${cuid}'`).all()
        const [schedule] = await db.query(`create Vertex MailSchedule set type= :type, startDate= :startDate, endDate= :endDate, executionTime= :executionTime, email= :userEmail`,
        {params:{ type: type, startDate: startDate, endDate: endDate, executionTime: executionTime, userEmail}})
        await db.create('EDGE', 'mailScheduleHasAlias').from(alias['@rid']).to(schedule['@rid']).one();
        scheduleHelper.runSchedules(schedule);
        return response.send(schedule)
    } catch(e){
        const error = new Error(e)
        return response.send(error)
    }
}

exports.updateSchedule = async (request, response) => {
    try{
        const {type, startDate, endDate, executionTime, userEmail, scheduleId} = request.body;
        const resp = await db.query(`update MailSchedule set email= :email, type= :type, startDate= :startDate, endDate= :endDate, executionTime= :executionTime where @rid= ${scheduleId}`,
        {params:{ type: type, startDate: startDate, endDate: endDate, executionTime: executionTime, email: userEmail}});
        const [schedule] = await db.query(`select * from MailSchedule where @rid= ${scheduleId}`)
        scheduleHelper.runSchedules(schedule);
        return response.send(schedule)
    } catch(e){
        const error = new Error(e)
        return response.send(error)
    }
}

exports.deleteSchedule = async (request, response) => {
    const scheduleId = '#'+request.params.id;
    await db.query("delete edge mailScheduleHasAlias where out="+scheduleId);
    await db.query("delete Vertex MailSchedule where @rid="+scheduleId);
    return response.send({message: 'success'})
};

exports.getSchedule = async function(request, response){
    try{
        const {cuid} = request.params;
        const [schedule] = await db.query(`select expand(out('mailScheduleHasAlias')) from Alias where cuid= '${cuid}'`).all();
        const status = schedule ? 200 : 404;
        return response.send({status: status, schedule: schedule})
    } catch(e){
        console.log(e)
    }
}

