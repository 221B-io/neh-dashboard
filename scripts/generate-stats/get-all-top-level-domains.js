const fs = require('fs');

const dirpath = '../../data/json/products-with-resolve-state.json';

getTopLevelDomains();

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
 * Get top level domains from URLS
 */
function getTopLevelDomains() {
    let products = getFile(dirpath);
    let tempTLDs = [];
    for (let product in products) {
        try {
           let splitURL = getHostName(products[product].primaryURL).split('.');
            tempTLDs.push({
                tld: splitURL[splitURL.length - 1],
                url: products[product].primaryURL
            });
        } catch(e) {
            // console.log(`malformed URL ${e}`)
        }

    }
    console.log(tempTLDs)

    fs.writeFileSync(`../../data/json/grouped-tlds.json`, JSON.stringify(groupBy('tld', tempTLDs), null, 2));
}


/** 
 * Get a host name from a URL
 * @param {string} url
 * @returns {string} hostname of URL
 */
function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    } else {
        return null;
    }
}

/** 
 * Group like host names by prop
 * @param {string} prop to group by
 * @param {array} array used to group on
 * @returns {array} grouped props
 */
function groupBy(prop, array) {
    return array.reduce(function (groups, item) {
        const val = item[prop]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
    }, {})
}