var MailListener = require("mail-listener2");
const childProcess = require('child_process');

var mailListener = new MailListener({
    username:	"muraligs@visualbi.com", 
    password:"Dec-2017", 
    host: 'outlook.office365.com',
    port: 993, // imap port
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 10000, // Default by node-imap,
    debug: console.log, // Or your custom function with only one incoming argument. Default: null
    mailbox: "INBOX", // mailbox to monitor
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
});

mailListener.start(); // start listening
 
// stop listening
//mailListener.stop();
 
mailListener.on("server:connected", function(){
  console.log("imapConnected");
});
 
mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});
 
mailListener.on("error", function(err){
  console.log(err);
});
 
mailListener.on("mail", function(mail, seqno, attributes){
  // do something with mail object including attachments
  const [text, value] = mail.subject.split(" ")
  console.log(text)
  if(text === "alias"){
    childProcess.execSync("node server/sendMail.js tweet.pdf");
  }
  // mail processing code goes here
});
