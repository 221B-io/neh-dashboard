const cheerio = require('cheerio');
const fs = require('fs');

// From https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
/**
 *
 * @param {string} str - The string to be converted to camel case.
 * @param {string} - The camelcased version of the input.
 */
function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, '');
}

/**
 * Prevents the next line from executing for a set amount of time.
 * @param {number} millis - The number of milliseconds the program sleeps for before resuming.
 */
async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

/**
 * Scrapes the downloaded HTML for all general grant information of a certain year.
 * @param {number} year - the issue year of grants to be scraped.
 * @returns {object[]} - array of JSON objects representing individual grants
 */
function parseYearOverview(year) {
  const grants = [];
  const html = fs.readFileSync(`../../data/html/by-year/${year}.html`, {
    encoding: 'utf-8'
  });
  const $ = cheerio.load(html);
  const resultList = $('table#dlResults > tbody > tr');
  resultList.each((idx, result) => {
    // Grant ID
    const grantId = $(result)
      .find('td table tbody tr')
      .first()
      .find('td p a')
      .first()
      .text();
    // Project Information
    const projectInformation = $(result)
      .find('td table tbody tr')
      .first()
      .find('td span')
      .html();
    let institution, projectDirector;
    if (projectInformation) {
      // test for a zip-code, and assign
      // whichever part contains the zipcode to the institution field
      if (/\d\d\d\d\d/.test(projectInformation.split('<br>')[0])) {
        projectDirector = projectInformation.split('<br>')[1];
        institution = projectInformation.split('<br>')[0];
      } else {
        projectDirector = projectInformation.split('<br>')[0];
        institution = projectInformation.split('<br>')[1];
      }
    }

    // Grant Information
    const title = $(result)
      .find('td table tbody tr')
      .eq(1)
      .find('td p span')
      .text()
      .trim();
    const description = $(result)
      .find('td table tbody tr')
      .eq(1)
      .find('td p')
      .eq(1)
      .text()
      .trim();

    // Left side of details
    const leftColumn = $(result)
      .find('td table tbody tr')
      .eq(2)
      .find('td')
      .first();
    const fields = $(leftColumn)
      .find('p')
      .eq(0)
      .find('span')
      .text();

    let fieldsArray;
    if (fields) {
      fieldsArray = fields.split(/[,;]/g);
    }

    const program = $(leftColumn)
      .find('p')
      .eq(1)
      .find('span')
      .text();
    const division = $(leftColumn)
      .find('p')
      .eq(2)
      .find('span')
      .text();

    // Right side of details
    const rightColumn = $(result)
      .find('td table tbody tr')
      .eq(2)
      .find('td')
      .eq(1);

    // Grant Money
    const usd = $(rightColumn)
      .find('p')
      .eq(0)
      .find('span')
      .eq(1)
      .html();
    let approvedUsd, awardedUsd;
    if (usd) {
      approvedUsd = usd.split('<br>')[0];
      awardedUsd = usd.split('<br>')[1];
    }

    if (approvedUsd) {
      approvedUsd = approvedUsd
        .replace(/\(.*\)/, '')
        .replace('$', '')
        .replace(',', '')
        .trim();
    }
    if (awardedUsd) {
      awardedUsd = awardedUsd
        .replace(/\(.*\)/, '')
        .replace('$', '')
        .replace(',', '')
        .trim();
    }

    // Grant Dates
    const grantDates = $(rightColumn)
      .find('p')
      .eq(1)
      .find('span')
      .text();
    let grantStartDate, grantEndDate;
    if (grantDates) {
      grantStartDate = grantDates.split('–')[0].trim();
      grantEndDate = grantDates.split('–')[1].trim();
    }

    // Store as Object
    const obj = {
      grantId,
      projectDirector,
      institution,
      title,
      description,
      fields: fieldsArray,
      program,
      division,
      approvedUsd,
      awardedUsd,
      grantStartDate,
      grantEndDate
    };
    grants.push(obj);
  });
  console.log(`Scraped year ${year}`);
  return grants;
}

/**
 * Turns a year's worth of grants from html to JSON
 * @param {number} year
 */
function saveYearToJson(year) {
  let grants = parseYearOverview(year);
  fs.writeFileSync(
    `../../data/json/by-year/${year}.json`,
    JSON.stringify(grants, null, 2)
  );
}

/**
 * Turns all years of grants into JSON
 */
function saveAllYearsToJson() {
  for (i = 1966; i < 2020; i += 1) {
    saveYearToJson(i);
  }
}

/**
 * Reads a grant products page's html locally and returns the product information as JSON.
 * @param {string} grantId
 * @returns {object[]} - an array of products
 */
function parseProductsPage(grantId) {
  let products = [];
  detailResults = fs.readFileSync(
    `../../data/html/products-by-grant/${grantId}.html`,
    { encoding: 'utf-8' }
  );
  const $d = cheerio.load(detailResults);
  const detailedResultList = $d('span#lblProducts > p');
  detailedResultList.each((idx, dResult) => {
    // parse data in to json blob
    let temp = {
      grantId
    };
    temp['title'] = $d(dResult)
      .find('span.gray')
      .text();

    const detailedProjectInformation = $d(dResult)
      .html()
      .split('<br>');
    detailedProjectInformation.forEach(eleText => {
      let key, value;
      key = eleText.split(': ')[0].replace(/\n/g, '');
      value = eleText
        .split(': ')
        .slice(1)
        .join(': '); // takes everything after the first colon
      if (key && !key.includes('<span class="gray">')) {
        if (key === 'ISBN') {
          key = 'isbn';
        }
        key = camelize(key);
        if (key === 'primaryURL' || key === 'secondaryURL') {
          let matches = value.match(/href="(\S*)"/i);
          if (matches) {
            value = matches[1];
            // remove malformed bits like "http://http//www.example.com"
            value = value.replace(/https?:\/\/https?:?\/*/, 'http://');
          }
        }
        // if value has been created already create an array && is not already an array
        if (temp[key] && !Array.isArray(temp[key])) {
          let tempArray = [temp[key]];
          tempArray.push(value);
          temp[key] = tempArray;
        } else if (Array.isArray(temp[key])) {
          // if its an array push the object on
          temp[key].push(value);
        } else {
          // create value
          temp[key] = value;
        }
      }
    });
    products.push(temp);
  });
  return products;
}

/**
 * Parses every locally saved products page html and saves the resulting JSON to a single new file.
 */
async function parseAllGrantProductsPages() {
  let files = fs.readdirSync('../../data/json/by-year');
  let allProducts = [];
  for (let i = 0; i < files.length; i += 1) {
    // for (let i = 0; i < 4; i += 1) {
    // parse each file
    let fileName = files[i];
    let yearJson = JSON.parse(
      fs.readFileSync(`../../data/json/by-year/${fileName}`)
    );
    console.log(`Checking ${yearJson.length} grants (${fileName})`);
    for (let j = 0; j < yearJson.length; j += 1) {
      // grab the grantId from each grant in file
      // and use that to GET the products page for the grant
      let grantId = yearJson[j].grantId;
      console.log(`checking ${grantId}`);
      let products = await parseProductsPage(grantId);
      if (products.length > 0) {
        console.log(`Products found on ${grantId}`);
        console.log(`Products: ${products}`);
        allProducts = allProducts.concat(products);
      }
    }
    console.log(`FINISHED YEAR-FILE: ${fileName}`);
  }
  fs.writeFileSync(
    '../../data/json/products.json',
    JSON.stringify(allProducts, null, 2)
  );
}

// Test:
(async () => {
  saveAllYearsToJson();
  parseAllGrantProductsPages();
})();
