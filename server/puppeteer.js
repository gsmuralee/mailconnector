
const puppeteer = require('puppeteer');

const username = process.env.USERNAME || 'ebidel';


const generatePdf = async(url, cuid, path) => {

const browser = await puppeteer.launch();

const page = await browser.newPage();
await page.setViewport({width: 1200, height: 800, deviceScaleFactor: 2});
await page.goto(url);

//wait 2 minutes, before genearting pdf

await page.waitFor(1000*60*2);

await page.pdf({path: `${path}/${cuid}.pdf`, format: 'A4'});

await browser.close();

};
exports.generatePdf = generatePdf;