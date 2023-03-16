const puppeteer = require('puppeteer');
const ExelWriter = require('./exelWriter');

async function findAllEmails(filePath) {
  const links = await ExelWriter.extractLinks(filePath);
  const emailList = [];

  // Initialize a single instance of the browser
  const browser = await puppeteer.launch({
    headless: true,
});
  try {
    const promises = [];
    let count = 0;

    for (const element of links) {
      const promise = getEmail(browser, element)
        .then((emails) => {
          return "Emails found for: " + element + ": " + "\n" + emails + "\n";
        })
        .catch((error) => {
          console.log(error);
          return "";
        });

      promises.push(promise);
      count++;

      if (count >= 20) {
        const results = await Promise.all(promises);
        emailList.push(...results);
        promises.length = 0;
        count = 0;
      }
    }

    if (count > 0) {
      const results = await Promise.all(promises);
      emailList.push(...results);
    }

    return emailList.join("");
  } catch (error) {
    console.log(error);
  } finally {
    // Close the browser when done
    await browser.close();
  }
}
  
  
  

async function getEmail(browser, URL) {
  let emails = [];
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(8000);
  try {
     // set timeout to 10 seconds
    await page.goto(URL);

    const impressum = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const regex = /impressum|imprint/i;
      const impressumLink = links.find((link) => regex.test(link.innerText));
      if (impressumLink) {
        impressumLink.click();
      }
    });

    await page.waitForNavigation();

    await page.waitForSelector('a[href^="mailto:"]', { timeout: 8000 });
    

    emails = await page.evaluate(() => {
      const emailElements = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
      return emailElements.map((email) => email.innerText + "\n");
    });

    await page.close();
  } catch (error) {
    await page.close();
    console.error("Page has been closed cause of:" + error);
  }
  return emails;
}



module.exports = {
    getEmail: getEmail,
    findAllEmails: findAllEmails
}
