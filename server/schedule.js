"use strict"
const Schedule = require('node-schedule');
const schedule = Schedule.RecurrenceRule();
const db = require("./db").connect();
const fetch = require('node-fetch');
const {generatePdf} = require("./puppeteer");
const {sendMail} = require("./mailer");
const Promise = require('bluebird');
const {config} = require('./config.js')

let insertScheduleDetails =  function(date, email, rid){
    console.log(date, email, rid)
    return db.query('create vertex MailScheduleDetails set date=:date, email=:email',
        {params:{date:date, email:email}})
        .then(scheduleDetails => {
           //db.query('CREATE EDGE hasScheduleDetails FROM '+ this.scheduleId + ' TO '+scheduleDetails[0]['@rid'].toString());
        db.create('EDGE', 'hasMailScheduleDetails').from(rid).to(scheduleDetails[0]['@rid']).one();
        return Promise.resolve(scheduleDetails[0])
  }).catch(err => Promise.reject(err))
} 

const generateAndSendMail = async (rid, schedule) => {
    const {email,globalScript,cfmaxValue,cfminValue,formfilters} = schedule
    const cfValue = {'minValue':cfminValue,'maxValue':cfmaxValue}
    return db.query(`select expand(in('mailScheduleHasAlias')) from ${rid}`).all().then(ms => {
        const [aliasRec] = ms;
        const {username, cuid, alias} = aliasRec;
        return fetch(`${config.WCS_URL}/luna/reports/embed/${cuid}/${username}`,
            { method: 'GET',  headers: {'Content-Type':'application/json'} }).then(res => {
                return res.json()
        }).then(json => {
            //const tempURL = 'http://labs.visualbi.com:8084/BOE/OpenDocument/opendoc/openDocument.jsp?iDocID=AUTsgHGpANhKkQ__5grPNmU&sIDType=CUID&token=VM-BILS21.VISUALBI.COM%3A6400%40%7B3%262%3D426577%2CU3%262v%3DVM-BILS21.VISUALBI.COM%3A6400%2CUP%2666%3D40%2CU3%2668%3DsecLDAP%3Acn%253Dmurali+gali+srinivasan%252C+ou%253Demployees%252C+ou%253Dvbi_chn%252C+ou%253Dvbi_in%252C+ou%253Dvbi_apac%252C+ou%253Dvbi_users%252C+ou%253Dvbi%252C+dc%253Dvisualbi%252C+dc%253Dcom%2CUP%26S9%3D6873%2CU3%26qe%3D100%2CU3%26vz%3Dt36D7fZSoaWaTFih2ZFbx6f1.gRmzB8TzPtep_h6jvd.D4icVgLUUN5PlO_ICKc9%2CUP%7D'
            const {url, token} = json;
            const encodedURL = `${url}${encodeURIComponent(token)}&globalScript='${globalScript}'&dsFilter=${JSON.stringify(formfilters)}&cfValue=${JSON.stringify(cfValue)}`;
            console.log(encodedURL)
            return generatePdf(encodedURL, cuid, 'documents');
        }).then(pdf => {
            return sendMail(alias, cuid, email, 'documents');
        })
    }).catch(err => {
        console.log(err)
        return Promise.reject(err)
    })
    
}

exports.runOnce = async function(inp){
    const startTime = new Date(inp.startDate+' '+inp.executionTime)
    var rule = new Schedule.RecurrenceRule()
    rule.date = startTime.getDate(); rule.month = startTime.getMonth()
    rule.year = startTime.getFullYear(); rule.hour = startTime.getHours()
    rule.minute = startTime.getMinutes()
    const rid = inp['@rid'].toString()
    if (Schedule.scheduledJobs[rid]) {
        return Schedule.scheduledJobs[rid].reschedule({rule}, function () {    
            return Promise.map([rid], sid =>{
                const date = new Date().toLocaleString();
                return insertScheduleDetails(date,inp.email,sid)
            }).then(sd => {
                return generateAndSendMail(rid,inp);
            })
        });
    }
    else {
        return Schedule.scheduleJob(rid, {rule}, function () {       
            return Promise.map([rid], sid =>{
                const date = new Date().toLocaleString();
                return insertScheduleDetails(date,inp.email,sid)
            }).then(sd => {
               return generateAndSendMail(rid, inp);
            })
        });
    }
    return true;
}

exports.runNow = (inp) => {
    const rid = inp['@rid'].toString()
    return Schedule.scheduledJobs[rid].reschedule({rule}, function () {    
        return Promise.map([rid], sid =>{
            const date = new Date().toLocaleString();
            return insertScheduleDetails(date,inp.email,sid)
        }).then(sd => {
            return generateAndSendMail(rid, inp);
        })
    });
}

exports.runDaily = (inp) => {
    const startTime = new Date(inp.startDate+' '+inp.executionTime)
    const startDate = new Date(inp.startDate)
    const endDate = new Date(inp.endDate)
    var rule = new Schedule.RecurrenceRule()
    rule.hour = startTime.getHours()
    rule.minute = startTime.getMinutes()
    const rid = inp['@rid'].toString()
    if (Schedule.scheduledJobs[rid]) {
        return Schedule.scheduledJobs[rid].reschedule({start: startDate,end: endDate,rule: rule}, function () {
            return Promise.map([rid], sid =>{
                const date = new Date().toLocaleString();
                return insertScheduleDetails(date,inp.email,sid)
            }).then(sd => {
                return generateAndSendMail(rid, inp);
            })
        });
    }
    else {
        return Schedule.scheduleJob(rid, {start: startDate,end: endDate,rule: rule}, function () {       
            return Promise.map([rid], sid =>{
                const date = new Date().toLocaleString();
                return insertScheduleDetails(date,inp.email,sid)
            }).then(sd => {
               return generateAndSendMail(rid, inp);
            })
        });
    }
    return true
}

exports.runHourly = (inp) => {
    let excMin = parseInt(inp.executeInterval)%60;
    let excHour = parseInt(inp.executeInterval) - excMin;
    const rid = inp['@rid'].toString()
    return createCustomSchedule(rid,inp.startDate,inp.endDate,excHour,excMin,inp.email,new Date())
}

let createCustomSchedule = (rid,fireDate,endDate,fireHour,fireMinute,email,currentTime) => {
	let tempcreationTime = new Date(currentTime);
	let creationTime = new Date(tempcreationTime.setMinutes(tempcreationTime.getMinutes()+fireHour*60+fireMinute));
	let dd = creationTime.getDate();
	let mm = creationTime.getMonth()+1; //January is 0!
	let yyyy = creationTime.getFullYear();
	if(dd<10) {
		dd = '0'+dd
	} 
	if(mm<10) {
		mm = '0'+mm
	}
	let newfireDate = mm + '/' + dd + '/' + yyyy;
	var rule = new Schedule.RecurrenceRule()
    rule.hour = creationTime.getHours()
    rule.minute = creationTime.getMinutes()
    if (Schedule.scheduledJobs[rid]) {
        return Schedule.scheduledJobs[rid].reschedule({start: newfireDate,end: endDate,rule: rule}, function () {    
            return Promise.map([rid], sid =>{
                const date = new Date().toLocaleString();
                let newCurrentTime = new Date(currentTime.setMinutes(currentTime.getMinutes()+fireHour*60+fireMinute));
                createCustomSchedule(rid,newfireDate,endDate,fireHour,fireMinute,email,newCurrentTime);
                return insertScheduleDetails(date,inp.email,sid)
            }).then(sd => {
                return generateAndSendMail(rid, inp);
            })
        });
    }
    else {
        return Schedule.scheduleJob(rid, {start: newfireDate,end: endDate,rule: rule}, function () {       
            return Promise.map([rid], sid =>{
                const date = new Date().toLocaleString();
                let newCurrentTime = new Date(currentTime.setMinutes(currentTime.getMinutes()+fireHour*60+fireMinute));
                createCustomSchedule(rid,newfireDate,endDate,fireHour,fireMinute,email,newCurrentTime);
                return insertScheduleDetails(date,inp.email,sid)
            }).then(sd => {
               return generateAndSendMail(rid, inp);
            })
        });
    }
}

exports.runWeekly = (inp) => {
    const startTime = new Date(inp.startDate+' '+inp.executionTime)
    var rule = new Schedule.RecurrenceRule()
    rule.hour = startTime.getHours()
    rule.minute = startTime.getMinutes()
    rule.dayOfWeek = inp.weekDays;
    const rid = inp['@rid'].toString()
    if (Schedule.scheduledJobs[rid]) {
        return Schedule.scheduledJobs[rid].reschedule({start: startDate,end: endDate,rule: rule}, function () {    
            return Promise.map([rid], sid =>{
                const date = new Date().toLocaleString();
                return insertScheduleDetails(date,inp.email,sid)
            }).then(sd => {
                return generateAndSendMail(rid, inp);
            })
        });
    }
    else {
        return Schedule.scheduleJob(rid, {start: startDate,end: endDate,rule: rule}, function () {       
            return Promise.map([rid], sid =>{
                const date = new Date().toLocaleString();
                return insertScheduleDetails(date,inp.email,sid)
            }).then(sd => {
               return generateAndSendMail(rid, inp);
            })
        });
    }
    return true;
}

exports.runMonthly = (inp) => {
    const startTime = new Date(inp.startDate+' '+inp.executionTime)
    const startDate = new Date(inp.startDate)
    const endDate = new Date(inp.endDate)
    var rule = new Schedule.RecurrenceRule()
    rule.hour = startTime.getHours();
    rule.minute = startTime.getMinutes()
    rule.month = inp.dates
    const rid = inp['@rid'].toString()
    if (Schedule.scheduledJobs[rid]) {
        return Schedule.scheduledJobs[rid].reschedule({start: startDate,end: endDate,rule: rule}, function () {    
            return Promise.map([rid], sid =>{
                const date = new Date().toLocaleString();
                return insertScheduleDetails(date,inp.email,sid)
            }).then(sd => {
                return generateAndSendMail(rid, inp);
            })
        });
    }
    else {
        return Schedule.scheduleJob(rid, {start: startDate,end: endDate,rule: rule}, function () {       
            return Promise.map([rid], sid =>{
                const date = new Date().toLocaleString();
                return insertScheduleDetails(date,inp.email,sid)
            }).then(sd => {
               return generateAndSendMail(rid, inp);
            })
        });
    }
    return true;
}

exports.runSchedules = (obj) => {
    console.log(obj)
        switch (obj.type) {
            case 'ScheduleNow':
                return exports.runNow(obj);
                break;
            case 'OneTime':
                return exports.runOnce(obj);
                break;
            case 'Hourly':
                return exports.runHourly(obj);
                break;
            case 'Daily':
                return exports.runDaily(obj);
                break;
            case 'Weekly':
                return exports.runWeekly(obj);
                break;
            case 'Monthly':
                return exports.runMonthly(obj);
                break;
            default:
                break;
        }
}

exports.CreateSchedule = (rid) => {
    return db.query("select @rid as scheduleId,email,type,startDate,excecutionTime,endDate from " + rid)
        .all().then(function (Schedules) {
            const scheduleName = Schedules[0].email.replace(' ', '') + Schedules[0].scheduleId.toString().replace('#', '_').replace(':', '_')
            exports.schedulesObject[scheduleName] = exports.runSchedules(Schedules[0]);
        })
        .catch(function (err) {
            return console.log(err);
        });

    console.log(JSON.stringify(exports.schedulesObject));
}

exports.DeleteSchedule = (rid) => {
    Schedule.scheduleJob[rid].cancel()
}