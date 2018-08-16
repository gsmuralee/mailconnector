const MailListener = require("mail-listener2");
const db = require("./db").connect();
const fetch = require('node-fetch');
const {generatePdf} = require("./puppeteer");
const {sendMail} = require("./mailer");

const mailListener = new MailListener({
    username:	"dmsbot@visualbi.com", 
    password:"Visualbi@123", 
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
  console.log(mail, value)
  if(text === "alias"){
    const [from] = mail.from
    generateAndSendMail(value, from.address)
  }
  // mail processing code goes here
});


const generateAndSendMail = async (val, semail) => {
  const [aliasRec] = await db.query(`select * from Alias where alias = '${val}'`).all();
  const {username, cuid, alias, email} = aliasRec;
  console.log(semail.toLowerCase(),  email.toLowerCase())
  if(semail.toLowerCase() != email.toLowerCase()) return false;
  const res = await fetch(`http://labs.visualbi.com:2439/luna/reports/embed/${cuid}/${username}`,
          { method: 'GET',  headers: {'Content-Type':'application/json'} })
  const {url} = await res.json();
  //const tempURL = 'http://labs.visualbi.com:8084/BOE/OpenDocument/opendoc/openDocument.jsp?iDocID=AUTsgHGpANhKkQ__5grPNmU&sIDType=CUID&token=VM-BILS21.VISUALBI.COM%3A6400%40%7B3%262%3D426577%2CU3%262v%3DVM-BILS21.VISUALBI.COM%3A6400%2CUP%2666%3D40%2CU3%2668%3DsecLDAP%3Acn%253Dmurali+gali+srinivasan%252C+ou%253Demployees%252C+ou%253Dvbi_chn%252C+ou%253Dvbi_in%252C+ou%253Dvbi_apac%252C+ou%253Dvbi_users%252C+ou%253Dvbi%252C+dc%253Dvisualbi%252C+dc%253Dcom%2CUP%26S9%3D6873%2CU3%26qe%3D100%2CU3%26vz%3Dt36D7fZSoaWaTFih2ZFbx6f1.gRmzB8TzPtep_h6jvd.D4icVgLUUN5PlO_ICKc9%2CUP%7D'
  const pdf = await generatePdf(url, cuid, 'documents');
  sendMail(alias, cuid, semail, 'documents')
  return aliasRec;
}