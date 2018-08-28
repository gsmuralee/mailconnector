const fetch = require("node-fetch");
const db = require("../db").connect();
const scheduleHelper = require('../schedule')
const {config} = require('../config.js')

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
    console.log(`${config.WCS_URL}/luna/reports/${username}&false`)
    return fetch(`${config.WCS_URL}/v1/login`,
    { method: 'POST', body: JSON.stringify(body), headers: {'Content-Type':'application/json'} })
    .then(res => res.json())
    .then(json => {
            return response.send(json)
    });
}

exports.reports = async (request, response) => {
    const {username} = request.params;
    console.log(`${config.WCS_URL}/luna/reports/${username}&false`)
    const res = await fetch(`${config.WCS_URL}/luna/reports/${username}&false`,
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
        const {type, startDate, endDate, executionTime, cuid, userEmail, formfilters, cfminValue, cfmaxValue, globalScript} = request.body;
        const [alias] =  await db.query(`select * from Alias where cuid = '${cuid}'`).all()
        const [schedule] = await db.query(`create Vertex MailSchedule set type= :type, startDate= :startDate, endDate= :endDate,
         executionTime= :executionTime, email= :userEmail,formfilters=:formfilters, cfminValue=:cfminValue, cfmaxValue=:cfmaxValue, globalScript=:globalScript`,
        {params:{ type, startDate, endDate, executionTime, userEmail, formfilters, cfminValue,cfmaxValue, globalScript}})
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
        const {type, startDate, endDate, executionTime, userEmail, scheduleId, formfilters,  cfminValue, cfmaxValue, globalScript} = request.body;
        const resp = await db.query(`update MailSchedule set email= :userEmail, type= :type, startDate= :startDate, endDate= :endDate,
         executionTime= :executionTime,formfilters=:formfilters, cfminValue=:cfminValue, cfmaxValue=:cfmaxValue, globalScript=:globalScript where @rid= ${scheduleId}`,
        {params:{ type, startDate, endDate, executionTime, userEmail, formfilters, cfminValue,cfmaxValue, globalScript}});
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

