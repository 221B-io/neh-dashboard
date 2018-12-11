const fs = require('fs')
const dirpath = '../../data/json/productURLs.json';

let productURLs = getFile(dirpath);
parseFiles(productURLs);

/** 
 * Parse over all files data and return count of similar domains 
 * @param {array} productURLs
 * @returns {array} count of similar domains
 */
function parseFiles(productURLs) {
    let trimmedProductURL = []
    productURLs.forEach((url) => {
        trimmedProductURL.push({
            host: getHostName(url),
            url: url,
        });
    });
    fs.writeFileSync(`../../data/json/groupedProductURLs.json`, JSON.stringify(groupBy('host', trimmedProductURL), null, 2));
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