
const puppeteer = require('puppeteer');

const username = process.env.USERNAME || 'ebidel';


const generatePdf = async(url, cuid) => {

const browser = await puppeteer.launch();

const page = await browser.newPage();
await page.setViewport({width: 1200, height: 800, deviceScaleFactor: 2});
await page.goto(`http://labs.visualbi.com:8082/BOE/OpenDocument/opendoc/openDocument.jsp?iDocID=AUK5iCgupTxIhD.SPax31Fg&sIDType=CUID&token=VM-BILS20.VISUALBI.COM%3A6400%40%7B3%262%3D265786%2CU3%262v%3DVM-BILS20.VISUALBI.COM%3A6400%2CUP%2666%3D40%2CU3%2668%3DsecLDAP%3Acn%253Dmurali+gali+srinivasan%252C+ou%253Demployees%252C+ou%253Dvbi_chn%252C+ou%253Dvbi_in%252C+ou%253Dvbi_apac%252C+ou%253Dvbi_users%252C+ou%253Dvbi%252C+dc%253Dvisualbi%252C+dc%253Dcom%2CUP%26S9%3D6512%2CU3%26qe%3D100%2CU3%26vz%3Dah1PcWBsQgMgDyLNYMy8y.DYNlAq9dVM0Sn_Mzaf2Zc%2CUP%7D`);

//wait 2 minutes, before genearting pdf

await page.waitFor(1000*60*2);

await page.pdf({path: `documents/${cuid}.pdf`, format: 'A4'});

await browser.close();

};
exports.generatePdf = generatePdf;