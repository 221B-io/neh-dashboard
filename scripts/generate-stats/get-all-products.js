const fs = require('fs')

getAllFileNames()
/**
 * Get all file names in a dir names
 */
function getAllFileNames() {
    let fileNames = [];
    fs.readdirSync('../../data/json/by-year-with-products-resolve-state/').forEach(fileName => {
        fileNames.push(fileName)
    })
    combineAllProducts(fileNames)
}


/**
 * Combine all products in to one file and save to file
 * @param {array} fileNames 
*/
function combineAllProducts(fileNames) {
    let allProducts = [];
    fileNames.forEach((fileName) => {
        let fileData = getFile(`../../data/json/by-year-with-products-resolve-state/${fileName}`)
        fileData.forEach((grant) => {
            if (grant.products.length > 0) {
                allProducts.push(...grant.products)
            }
        })
  
    })
    fs.writeFileSync(`../../data/json/productsWithResolveState.json`, JSON.stringify(allProducts, null, 2));
}

/** 
 * Get a file's data 
 * @param {string} path
 * @returns {array} of file data
 */
function getFile(path) {
    let fileData = fs.readFileSync(path, 'utf8');
    return JSON.parse(fileData);
}

