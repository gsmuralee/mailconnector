const email 	= require("./node_modules/emailjs/email");
const mailServer 	= email.server.connect({
   user:	"muraligs@visualbi.com", 
   password:"Jul-2018", 
   host: "smtp.office365.com",
   port : 587,
   tls: {ciphers: "SSLv3"},
   timeout:30000,
   authentication: 'plain'
});

const sendMail = function(alias, cuid, semail, path){
    var message	= {
        text:	"FYI", 
        from:	"dmsbot <muraligs@visualbi.com>", 
        to:		`hello <${semail}>`,
        subject:	`report - ${alias}`,
        attachment: 
        [
           {data:`${alias}`, alternative:true},
           {path:`${path}/${cuid}.pdf`, type:"application/pdf", name:`${cuid}.pdf`}
        ]
     };
     
     // send the message and get a callback with an error or details of the message that was sent
     return mailServer.send(message, function(err, message) { 
         return message;
      });
     
}

exports.sendMail = sendMail 

