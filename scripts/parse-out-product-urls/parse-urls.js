const fs = require('fs')
const dirpath ='../../data/json/products.json';

writeProductURLsToFile();

/**
 * Get all productURLs from all *product.json files and save them to a file
 * @constructs
 */
function writeProductURLsToFile() {
    // fs.readdir(dirpath, function (err, files) {
    fs.writeFileSync(`../../data/json/productURLs.json`, JSON.stringify(parseFiles(), null, 2));
    // })
}

/** 
* Parse over all files data and return an array of primary URLs
* @returns {array} of Primary URL
*/
function parseFiles() {
    let productURLs = [];
    let fileJSON = getFile();
        fileJSON.forEach((product) => {
            let productURL = product['Primary URL'];
            if (productURL) {
                if (Array.isArray(productURL)) {
                    productURL.forEach((url) =>{
                        productURLs.push(url.replace(/ /g, ''))
                    })
                } else {
                    productURLs.push(productURL.replace(/ /g, ''))
                }
            }
        });
    return productURLs;
}

/** 
 * Get a file's data 
 * @param {string} path
 * @returns {array} of file data
 */
function getFile() {
    let fileData = fs.readFileSync(dirpath, 'utf8');
    return JSON.parse(fileData);
}
