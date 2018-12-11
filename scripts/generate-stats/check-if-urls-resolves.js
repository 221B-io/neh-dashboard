// const http = require('http');
const fs = require('fs');
const axios = require('axios');


const dirpath = "../../data/json/resolve-state/cleaned/combinedResolveState.json";

let productsData = getFile(dirpath);
productsData = productsData.filter(product => product.status === 403);
console.log(productsData.length);
resolveAllUrls(productsData)
// saveUrlData(productsData[0]);
// combineFilesInToOneFile()
// combineAllResolveStateFilesRemovingDuplicates()
/** 
 * resolve all urls and save to file their resolve state
 * @param {array} products
 */
function resolveAllUrls(products) {

  for (const product of products) {
      let index = products.indexOf(product);
      saveUrlData(product, index);
  }

}

/** 
 * Check if URL exists
 * @param {string} product
 * @returns {string} return string boolean true if file exits 
 */
function saveUrlData(product, index) {
    if (product.primaryURL) {
      let url = product.primaryURL;
      if (Array.isArray(product.primaryURL)) {
        url = product.primaryURL[0];
      }
      axios.get(url).then(results => {
        console.log(results.request.res.responseURL);
        console.log(`${index} out of ${productsData.length} ${results.status}`);
        let data = { grantId: product.grantId, primaryURL: product.primaryURL, title: product.title[0], status: results.status, data: results.data };
        // fs.writeFileSync(`../../data/json/resolve-state/404/${index}.json`, JSON.stringify(data, null, 2));
      }).catch(function(error) {
        console.log('------------------')
        console.log(error)
        console.log(`catch: ${index} out of ${productsData.length} ${error}`);
        if (error.response) {
          let data = { grantId: product.grantId, primaryURL: product.primaryURL, title: product.title[0], status: error.response.status, data: error.response.data };
          // fs.writeFileSync(`../../data/json/resolve-state/404/${error.response.status}-${index}.json`, JSON.stringify(data, null, 2));
        } else {
          let data = { grantId: product.grantId, primaryURL: product.primaryURL, title: product.title[0], status: error.errno, data: null };
          // fs.writeFileSync(`../../data/json/resolve-state/404/ENOTFOUND-${index}.json`, JSON.stringify(data, null, 2));
        }
      });
    }
}

/** 
 * Get a file's data 
 * @param {string} filePath
 * @returns {array} of file data
 */
function getFile(filePath) {
    let fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
}


/** 
 * Get a file's data 
 * @param {string} filePath
 * @returns {array} of file data
 */
function combineFilesInToOneFile() {
    let fileNames = [];
    fs.readdirSync("../../data/json/resolve-state/404/").forEach(
      fileName => {
        if (fileName !== ".DS_Store") { 
          fileNames.push(fileName);
        }
      }
    );
    combineAllProducts(fileNames);
}

/**
 * Combine all data in to one file and save to file
 * @param {array} fileNames 
*/
function combineAllProducts(fileNames) {
    let allProducts = [];
    fileNames.forEach((fileName, index) => {
       let fileData = getFile(`../../data/json/resolve-state/404/${fileName}`)
        // console.log(fileData.title);
        allProducts.push({
          primaryURL: fileData.primaryURL,
          title: fileData.title,
          status: fileData.status
        });
        // fileData.forEach((grant) => {
        //   console.log(grant)
        //     // if (grant.products.length > 0) {
        //     //     allProducts.push(...grant.products)
        //     // }
        // })
  
    })
    fs.writeFileSync(`../../data/json/resolve-state/404/combinedResolveState.json`, JSON.stringify(allProducts, null, 2));
}



function combineAllResolveStateFilesRemovingDuplicates() {
  let one = getFile('../../data/json/resolve-state/combinedResolveState.json');
  let two = getFile("../../data/json/resolve-state/403/combinedResolveState.json");
  let three = getFile('../../data/json/resolve-state/404/combinedResolveState.json');
  console.log(one.length);
  console.log(two.length);
  console.log(three.length);

  one = one.filter(product => product.status !== 404);
  console.log('-'+ one.length);
  one = one.filter(product => product.status !== 403);
  console.log("-" + one.length);

  let combinedData = [...one, ...two, ...three];
  console.log(combinedData.length);
  fs.writeFileSync(`../../data/json/resolve-state/cleaned/combinedResolveState.json`, JSON.stringify(combinedData, null, 2));
}