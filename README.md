# NEH Dashboard

## Full data scraping, parsing, and upload steps, from the beginning

- `cd scripts/ingest`
- `node pull-from-neh-api.js`
  - Requests data from the NEH website. Note: This is an extremely costly process, and makes ~100k requests to the NEH servers. Do not do this lightly, as the data is already saved locally and doesn't need to be updated often.
- `node parse-neh-html.js`
  - Parse the html files saved locally into JSON files.
- `node augment-grants.js`
  - Add the gathered products into a new JSON file with their respective grants, along with some computed indices and URL resolution data (this is what will be uploaded to ElasticSearch).
- `node generate-es-upload.js`
  - Turn the JSON resulting from the above command into a properly-formatted bulk-request body for ElasticSearch.
- `node before-upload.js`
  - Deletes the existing elasticsearch data and updates the index to the latest schema.
- `curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@requests" > /dev/null`
  - Post the bulk data to ElasticSearch.

## To Do
