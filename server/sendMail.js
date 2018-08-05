var email 	= require("../node_modules/emailjs/email");
var server 	= email.server.connect({
   user:	"muraligs@visualbi.com", 
   password:"Dec-2017", 
   host: "smtp.office365.com",
   port : 587,
   tls: {ciphers: "SSLv3"},
   timeout:30000,
   authentication: 'plain'
});

var message	= {
   text:	"i hope this works", 
   from:	"you <muraligs@visualbi.com>", 
   to:		"someone <muraligs@visualbi.com>",
   subject:	"testing emailjs",
   attachment: 
   [
      {data:"<html>i <i>hope</i> this works!</html>", alternative:true},
      {path:"tweet.pdf", type:"application/pdf", name:"tweet.pdf"}
   ]
};

// send the message and get a callback with an error or details of the message that was sent
server.send(message, function(err, message) { console.log(err || message); });