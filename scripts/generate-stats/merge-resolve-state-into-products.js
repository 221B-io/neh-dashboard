const fs = require('fs')
const dirpath = '../../data/json/products.json';
const RESOLVE_STATES = '../../data/json/resolveStateOfUrls.json';

// parseFiles()
 addResolveStateToProducts();

/** 
 * Get a file's data 
 * @param {string} path
 * @returns {array} of file data
 */
function getFile(path) {
    let fileData = fs.readFileSync(path, 'utf8');
    return JSON.parse(fileData);
}


/**
 * Adds resolve state to each product
 * @param {string} fileName
 */
function addResolveStateToProducts() {
    let data = getFile(dirpath);
    let resolveStateData = getFile(RESOLVE_STATES)

    data.forEach((product, index) => {
        // if there are products
        //  console.log(product)
 
            // loop over each product
            // d.products.forEach((product, i) => {
                // if product has a Primary URL
                if (product.primaryURL) {
                    resolveStateData.forEach((obj) => {
                        // console.log(obj)
                        if (obj.url === product.primaryURL) {
                            data[index].resolves = obj.resolves
                        }
                    })

                }
            // });
    });
    fs.writeFileSync(`../../data/json/products-with-resolve-state.json`, JSON.stringify(data, null, 2));
}



// /**
//  * Get all file names in a dirpath names
//  */
// function getAllFileNames() {
//     fs.readdirSync(dirpath).forEach(fileName => {
//         addResolveStateToProducts(fileName)
//     })
// }
