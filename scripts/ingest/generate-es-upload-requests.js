const fs = require('fs');

let bulk = '';

// = 1966, <= 2019
// Caution: Running all years at once will take up to an hour.
// Uploading in smaller chunks by altering the following for-loop is recommended.
for (let j = 1966; j <= 2019; j += 1) {
  const content = fs.readFileSync(
    `../../data/json/by-year-with-products/${j}.json`,
    {
      encoding: 'utf-8'
    }
  );
  parsedContent = JSON.parse(content);
  for (let i in parsedContent) {
    let index = {
      index: {
        _index: 'neh',
        _type: 'grant',
        _id: parsedContent[i].grantId
      }
    };

    bulk += JSON.stringify(index) + '\n';
    bulk += JSON.stringify(parsedContent[i]) + '\n';
  }
}

fs.writeFileSync('requests', bulk);

// After running this file, run in bash:
// curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@requests" > /dev/null
