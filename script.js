const puppeteer = require('puppeteer');
const ExelWriter = require('./exelWriter');

async function findAllEmails(filePath) {
    let links = await ExelWriter.extractLinks(filePath);
    let emailArr=[];
    let emailList = [];
    try{
    for (let i = 0; i < links.length; i++) {
    const element = links[i];
    const emails = await getEmail(element);
    emailArr+="Emails found for: " + element + ": " + "\n" + emails + "\n";
    }return emailArr;
    
  
    process.exit();
    }catch(error){
    console.log(error);
    }
    }

async function getEmail(URL) {
    let emails = [];
    
    try {
        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();
        await page.goto(URL);

        const impressum = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            const regex = /impressum|imprint/i;
            const impressumLink = links.find(link => regex.test(link.innerText));
            if (impressumLink) {
                impressumLink.click();
            }
        });

        await page.waitForNavigation();

        await page.waitForSelector('a[href^="mailto:"]');
        //if no emails are found with the above regex try this
       
            emails = await page.evaluate(() => {
                const emailElements = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
                return emailElements.map(email => email.innerText + "\n");
            });
          
        await browser.close();
        


    } catch (error) {
        console.error(error);
    }
    return emails;
}

module.exports = {
    getEmail: getEmail,
    findAllEmails: findAllEmails
}
