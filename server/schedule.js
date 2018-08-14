"use strict"
const Schedule = require('node-schedule');
const moment = require('moment');
const schedule = Schedule.RecurrenceRule();
const db = require("./db").connect();
const fetch = require('node-fetch');
const {generatePdf} = require("./puppeteer");
const {sendMail} = require("./mailer");

let insertScheduleDetails =  async function(date, email, rid){
    const [details] = await db.query('create vertex MailScheduleDetails set date=:date, email=:email',
       {params:{date:date, email:email}})
    await db.create('EDGE', 'hasMailScheduleDetails').from(rid).to(details['@rid']);
    return details
}

const generateAndSendMail = async (rid, email) => {
    const [aliasRec] = await db.query(`select expand(in('mailScheduleHasAlias')) from ${rid}`).all();
    const {username, cuid, alias} = aliasRec;
    const res = await fetch(`http://labs.visualbi.com:2439/luna/reports/embed/${cuid}/${username}`,
            { method: 'GET',  headers: {'Content-Type':'application/json'} })
    const {url} = await res.json();
    const pdf = await generatePdf(url);
    sendMail(alias, cuid, email)
    return aliasRec;

}

exports.runOnce = function(inp){
    const startTime = new Date(inp.startDate+' '+inp.executionTime)
    var rule = new Schedule.RecurrenceRule()
    rule.date = startTime.getDate(); rule.month = startTime.getMonth()
    rule.year = startTime.getFullYear(); rule.hour = startTime.getHours()
    rule.minute = startTime.getMinutes()
    if (Schedule.scheduledJobs[inp.rid]) {
        return Schedule.scheduledJobs[inp.rid].reschedule({rule}, function () {    
                const date = moment().format('MMMM Do YYYY, h:mm:ss a'); 
                insertScheduleDetails.call(date,inp.email,inp.rid)
                return generateAndSendMail(inp['@rid']);;
        });
    }
    else {
        return Schedule.scheduleJob(inp.rid, {rule}, function () {         
            const date = moment().format('MMMM Do YYYY, h:mm:ss a'); 
            insertScheduleDetails.call(date,inp.email,inp.rid)
            return generateAndSendMail(inp['@rid']);;
        });
    }
    return true;
}

exports.runNow = (inp) => {
    const date = moment().format('MMMM Do YYYY, h:mm:ss a'); 
    insertScheduleDetails.call(date,inp.email,inp.rid)
    return generateAndSendMail(inp['@rid']);;
}

exports.runDaily = (inp) => {
    const startTime = new Date(inp.startDate+' '+inp.executionTime)
    const startDate = new Date(inp.startDate)
    const endDate = new Date(inp.endDate)
    var rule = new Schedule.RecurrenceRule()
    rule.hour = startTime.getHours()
    rule.minute = startTime.getMinutes()
    if (Schedule.scheduledJobs[inp.rid]) {
        return Schedule.scheduledJobs[inp.rid].reschedule({start: startDate,end: endDate,rule: rule}, function () {
            const date = moment().format('MMMM Do YYYY, h:mm:ss a'); 
            insertScheduleDetails.call(date,inp.email,inp.rid)
            return generateAndSendMail(inp['@rid']);;
        });
    }
    else {
        return Schedule.scheduleJob(inp.rid,{start: startDate,end: endDate,rule: rule}, function () {
            const date = moment().format('MMMM Do YYYY, h:mm:ss a'); 
            insertScheduleDetails.call(date,inp.email,inp.rid)
            return generateAndSendMail(inp['@rid']);;
        });
    }
    return true
}

exports.runHourly = (inp) => {
    let excMin = parseInt(inp.executeInterval)%60;
    let excHour = parseInt(inp.executeInterval) - excMin;
    return createCustomSchedule(inp.rid,inp.startDate,inp.endDate,excHour,excMin,inp.email,new Date())
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
            console.log(currentTime)
            var newCurrentTime = new Date(currentTime.setMinutes(currentTime.getMinutes()+fireHour*60+fireMinute));
            const date = moment().format('MMMM Do YYYY, h:mm:ss a'); 
            insertScheduleDetails.call(date,inp.email,inp.rid)
            createCustomSchedule(rid,newfireDate,endDate,fireHour,fireMinute,email,newCurrentTime);
            return generateAndSendMail(rid);
        });
    }
    else {
        return Schedule.scheduleJob(rid,{start: newfireDate,end: endDate,rule: rule}, function () {
            var newCurrentTime = new Date(currentTime.setMinutes(currentTime.getMinutes()+fireHour*60+fireMinute));
            const date = moment().format('MMMM Do YYYY, h:mm:ss a'); 
            insertScheduleDetails.call(date,inp.email,inp.rid)
            createCustomSchedule(rid,newfireDate,endDate,fireHour,fireMinute,email,newCurrentTime);
            return generateAndSendMail(rid);
        });
    }
}

exports.runWeekly = (inp) => {
    const startTime = new Date(inp.startDate+' '+inp.executionTime)
    const startDate = new Date(inp.startDate)
    const endDate = new Date(inp.endDate)
    var rule = new Schedule.RecurrenceRule()
    rule.hour = startTime.getHours()
    rule.minute = startTime.getMinutes()
    rule.dayOfWeek = inp.weekDays;
    if (Schedule.scheduledJobs[inp.rid]) {
        return Schedule.scheduledJobs[inp.rid].reschedule({start: startDate,end: endDate,rule: rule}, function () {
            const date = moment().format('MMMM Do YYYY, h:mm:ss a'); 
            insertScheduleDetails.call(date,inp.email,inp.rid)
            return generateAndSendMail(inp['@rid']);;
        });
    }
    else {
        return Schedule.scheduleJob(inp.rid,{start: startDate,end: endDate,rule: rule}, function () {
            const date = moment().format('MMMM Do YYYY, h:mm:ss a'); 
            insertScheduleDetails.call(date,inp.email,inp.rid)
            return generateAndSendMail(inp['@rid']);;
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
    if (Schedule.scheduledJobs[inp.rid]) {
        return Schedule.scheduleJob[inp.rid].reschedule({start: startDate,end: endDate,rule: rule}, function () {
            const date = moment().format('MMMM Do YYYY, h:mm:ss a'); 
            insertScheduleDetails.call(date,inp.email,inp.rid)
            return generateAndSendMail(inp['@rid']);;
        });
    }
    else {
        return Schedule.scheduleJob(inp.rid,{start: startDate,end: endDate,rule: rule}, function () {
            const date = moment().format('MMMM Do YYYY, h:mm:ss a'); 
            insertScheduleDetails.call(date,inp.email,inp.rid)
            return generateAndSendMail(inp['@rid']);;
        });
    }
    return true;
}

exports.runSchedules = (obj) => {
    const _this = this;
    if (!_this.isDeleted) {
        switch (_this.type) {
            case 'ScheduleNow':
                return exports.runNow(_this);
                break;
            case 'OneTime':
                return exports.runOnce(obj);
                break;
            case 'Hourly':
                return exports.runHourly(_this);
                break;
            case 'Daily':
                return exports.runDaily(_this);
                break;
            case 'Weekly':
                return exports.runWeekly(_this);
                break;
            case 'Monthly':
                return exports.runMonthly(_this);
                break;
            default:
                break;
        }
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

exports.DeleteSchedule = (inp) => {
    Schedule.scheduleJob[inp.rid].cancel()
}