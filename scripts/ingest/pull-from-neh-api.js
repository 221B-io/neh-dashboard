const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

/**
  Prevents the next line from executing for a set amount of time.
  @param {number} millis - The number of milliseconds the program sleeps for before resuming.
*/
async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

/**
 * 
 * @param {string} grantId 
 */
async function scrapeGrantProductsHtml(grantId) {
  const queryString = `https://securegrants.neh.gov/publicquery/products.aspx?f=1&gn=${grantId}`;
  const results = await axios.get(queryString);
  return results.data;
}


/**
 * Writes a grant's product page to a local html file
 * @param {string} grantId - the grant's id, and also the resulting html filename.
 */
async function saveProductsToHtml(grantId) {
  let html = await scrapeGrantProductsHtml(grantId);
  fs.writeFileSync(`../../data/html/products-by-grant/${grantId}.html`, html);
}

/**
 * 
 */
async function saveAllProductsHtmlPages() {
  let files = fs.readdirSync('../../data/json/by-year');
  for (let i = 0 ; i < files.length ; i += 1) {
    const fileName = files[i];
    const grants = JSON.parse(
      fs.readFileSync(
        `../../data/json/by-year/${fileName}`, 
        {encoding: 'utf-8'}
      )
    );
    console.log(`Reading ${grants.length} grants from ${fileName}`);
    for (let j = 0 ; j < grants.length ; j += 1) {
      const grantId = grants[j].grantId;
      if (!fs.existsSync(`../../data/html/products-by-grant/${grantId}.html`)) {
      await sleep(250);
      console.log(`Visiting ${grantId}`);
      await saveProductsToHtml(grantId);
      } else {
        console.log(`../../data/html/products-by-grant/${grantId}.html already exists.`);
      }
    }
  }
}

/**
 * Queries the NEH API for a specific year's worth of grants.
 * @param {number} year 
 * @return {string} - the visited page's HTML
 */
async function scrapeYearOverviewHtml(year) {
  const queryString = `https://securegrants.neh.gov/publicquery/main.aspx?q=1&a=0&n=0&o=0&ot=0&k=0&f=0&s=0&cd=0&p=0&d=0&y=1&yf=${year}&yt=${year}&prd=0&cov=0&prz=0&wp=0&ob=year&or=DESC`
  let results = await axios.get(queryString);
  return results.data;
}

/**
 * Calls scrapeYearOverviewHtml for each available year and writes results to files.
 */
async function getAllYearsHtml() {
  for (let i = 1966; i <= 2019; i += 1) {
    // Write the grant overview to a file
    let html = await scrapeYearOverviewHtml(i);
    fs.writeFileSync(`../../html/by-year/${i}.html`, html);
  }
}

(async () => {
  getAllYearsHtml();
  saveAllProductsHtmlPages();
})();