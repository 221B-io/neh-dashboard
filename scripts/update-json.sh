# Reparses the HTML files, combines the resulting json, and creates the upload file
cd ingest
node parse-neh-html.js && node combine-products-grants.js && node generate-es-upload-requests.js
cd ..