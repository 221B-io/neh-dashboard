const fs = require('fs');

console.log('running...')
// let a1 = [
//     {
//         "url": "http://www.worldcat.org/isbn//9780416081008NON",
//         "resolves": true
//     },
//     {
//         "url": "http://www.worldcat.org/isbn//9788460537007NONsdd",
//         "resolves": true
//     },
//     {
//         "url": "http://www.worldcat.org/isbn//9780801497384",
//         "resolves": false
//     },
//     {
//         "url": "http://www.worldcat.org/isbn//9780300070804",
//         "resolves": false
//     },
//     {
//         "url": "http://www.worldcat.org/isbn//9780226259413",
//         "resolves": false
//     },
//     {
//         "url": "http://www.worldcat.org/isbn//9780820455976",
//         "resolves": false
//     },
//     {
//         "url": "http://www.worldcat.org/isbn//9780918720603",
//         "resolves": false
//     },
// ];

// let a2 = [
//     {
//         "url": "http://www.worldcat.org/isbn//9780801497384",
//         "resolves": true
//     },
//     {
//         "url": "http://www.worldcat.org/isbn//9780300070804",
//         "resolves": true
//     },
//     {
//         "url": "http://www.worldcat.org/isbn//9780226259413",
//         "resolves": true
//     },
//     {
//         "url": "http://www.worldcat.org/isbn//9780820455976",
//         "resolves": true
//     },
//     {
//         "url": "http://www.worldcat.org/isbn//9780918720603",
//         "resolves": true
//     },
// ];

// removeDuplicates('url', a1, a2)


let a1 = getFile('../../data/json/resolveState/resolveStateOfUrls1.json');
let a2 = getFile('../../data/json/resolveState/resolveStateOfUrls2.json');
fs.writeFileSync('../../data/json/resolveStateOfUrls.json', JSON.stringify(removeDuplicates('url', a1, a2), null, 2));

/**
 * Removes duplicates from array by type
 * @param {string} type
 * @param {array} arrayOne
 * @param {array} arrayTwo 
 * @returns {array} duplicate free array 
 */
function removeDuplicates(type, arrayOne, arrayTwo) {
    let newArray = [];
    arrayOne.forEach(arrayOneEle => {
        arrayTwo.forEach(arrayTwoEle => {
            if (arrayTwoEle[type] === arrayOneEle[type]) {
                newArray.push(arrayTwoEle);
            } 
        });

    });

    return [...arrayOne.filter(e => e.resolves), ...newArray];
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
