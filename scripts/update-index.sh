# Refreshes the index and reuploads all the data
cd ingest
node before-upload.js && curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@requests"; echo
cd ..