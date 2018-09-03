const fetch = require("node-fetch");
const db = require("../db").connect();
const scheduleHelper = require('../schedule')
const {config} = require('../config.js')

const formUrl = (server) => {
    const protocol = server.sslConnection ? 'https' : 'http';
    return `${protocol}://${server.agentAddress}:${server.agentPort}`
}

const getRecords = async function(username){
    return await db.query(`select cuid, alias from Alias where username = '${username}'`).all();
}

const mergeRecords = function(reports, records){
    return reports.map(p => {
        let [v] = records.filter(r => r.cuid == p.cUID);
        return v ? (p.alias = v.alias, p) : (p.alias='', p)
    })
}

exports.login = async (request, response) => {
    try{
        const {username, password, serverAlias} = request.body;
        const [server] = await db.query(`select * from server where serverAlias='${serverAlias}'`).all();
        if(!server) throw new Error('No server found');
        const body = {username, password, authtype: server.authType};
        console.log(`${formUrl(server)}/v1/login`)
        const res =  await fetch(`${formUrl(server)}/v1/login`,
        { method: 'POST', body: JSON.stringify(body), headers: {'Content-Type':'application/json'} })
        const json =  await res.json()
        return response.send(json)
    } catch(e){
        return response.send(e);
    }   
}

exports.reports = async (request, response) => {
    try{
        const {username} = request.params;
        const {serveralias} = request.query;
        const [server] = await db.query(`select * from server where serverAlias='${serveralias}'`).all();
        if(!server) throw new Error('No server found');
        const res = await fetch(`${formUrl(server)}/luna/reports/${username}&false`,
                { method: 'GET',  headers: {'Content-Type':'application/json'} })
        const objs = await res.json()
        const records = await getRecords(username);
        return response.send(mergeRecords(objs, records))
    } catch(e){
        return response.send(e)
    }
}

exports.alias = async (request, response) => {
    try{
        const {username, cUID, alias, email, serverAlias} = request.body;
        console.log(username, cUID, alias, serverAlias)
        await db.query(`update Alias set username='${username}',cuid='${cUID}',alias='${alias}', email='${email}' upsert where cuid='${cUID}'`)
        const [record] = await db.query(`select @rid,out('mailAliasHasServer') from Alias where cuid='${cUID}'`);
        if(!record) throw new Error('Error inserting record')
        if(!record.out.length){
            const [server] = await db.query(`select @rid from Server where serverAlias='${serverAlias}'`).all();
            await db.create('EDGE', 'mailAliasHasServer').from(record['rid']).to(server['rid']).one();
        }
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

exports.getServers = async function(request, response){
    try{
        const servers = await db.query(`select * from server`).all();
        const status = servers.length ? 200 : 404;
        return response.send({status: status, servers: servers})
    } catch(e){
        console.log(e)
    }
}
