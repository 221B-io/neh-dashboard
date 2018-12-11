const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;
console.log('running...')


let data = getFile('../data/json/grouped-tlds.json');
data = getCountsOfGroupings(data);
const fields = Object.keys(data[0]);

const json2csvParser = new Json2csvParser({
    fields
});
const csv = json2csvParser.parse(data);

fs.writeFileSync('../data/csv/tlds-count.csv', csv);


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
 * Get counts of groupings
 * @param {array} array of groupings
 * @returns {array} counted hosts
 */
function getCountsOfGroupings(arr) {
    let newArr = [];
    for (let element in arr) {
        newArr.push({
            "host": element,
            "count": arr[element].length
        })
    };
    return newArr;

}