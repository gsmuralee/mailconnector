
const puppeteer = require('puppeteer');
const path = require('path')

const generatePdf = async(url, cuid) => {
    const browser = await puppeteer.launch();
    try{
        const page = await browser.newPage();
        await page.setViewport({width: 1200, height: 800, deviceScaleFactor: 2});
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log(url)
        //http://labs.visualbi.com:8084/BOE/OpenDocument/opendoc/openDocument.jsp?iDocID=AS_8lXsg6pZOobA4YEdcZkw&sIDType=CUID&token=VM-BILS21.VISUALBI.COM%3A6400%40%7B3%262%3D448313%2CU3%262v%3DVM-BILS21.VISUALBI.COM%3A6400%2CUP%2666%3D40%2CU3%2668%3DsecEnterprise%3AMuraliGS%2CUP%26S9%3D6873%2CU3%26qe%3D100%2CU3%26vz%3DMFgRmkqUGOWqohW9D8yvprPp_uuDnt_hySsV3gogz9OZQJImnaPt8K6sKDEsyfVO%2CUP%7D&cfValue=%257B%2522minValue%2522%253A%252220%2522%252C%2522maxValue%2522%253A%25222000%2522%257D&dsFilter=%255B%255D
        const innerText = await page.evaluate(() => document.querySelector('.sapUiSizeCompact'));
        console.log(innerText)
        // if(innerText == 'TRUE')
        await page.pdf({path: `${path.join(__dirname, 'documents')}/${cuid}.pdf`, format: 'A4'});
        await browser.close();
    } catch(e){
        console.log(e)
        await browser.close();   
    }

// return innerText
};
exports.generatePdf = generatePdf;