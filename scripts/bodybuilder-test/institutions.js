const bodybuilder = require('bodybuilder');
const axios = require('axios');

const url = 'http://localhost:9200/_search?';
body = bodybuilder().agg('terms', 'institution.keyword', { size: 100 }).build();
axios.post(url, body).then((res) => {
  console.log(JSON.stringify(res.data.aggregations['agg_terms_institution.keyword'].buckets, null, 2));
}).catch((e) => {
  console.log(e);
});