const express = require("express"); // call express
const router = express.Router(); // get an instance of the express Router

router.get("/", function(req, res) {
  res.json({ message: "hooray! welcome to our api!" });
});

router.get("/api/institutions", async (req, res) => {
  body = bodybuilder()
    .agg("terms", "institution.keyword", { size: 50 })
    .build();
  let myUrl = `http://127.0.0.1:9200/neh/grant/_search`;
  try {
    let results = await axios.post(myUrl, body);
    res.json(
      results.data.aggregations["agg_terms_institution.keyword"].buckets
    );
  } catch (e) {
    res.sendStatus(500);
  }
});
// TODO: make this retrieve the number of grants that have products
/*
"must_not": {
  "script": {
    "script": "_source.locations.size() > 0"
  }
}
*/
app.get("/api/grantswithproducts", async (req, res) => {
  body = {
    query: {
      must_not: {
        script: {
          script: "_source.locations.size() > 0"
        }
      }
    }
  };
  let myUrl = `http://127.0.0.1:9200/neh/grant/_search`;
  try {
    let results = await axios.post(myUrl, body);
    res.json(
      results.data.aggregations["agg_terms_institution.keyword"].buckets
    );
  } catch (e) {
    res.sendStatus(500);
  }
});
// TODO: make this retrieve the number of grants with product links vs the number of links that still work
router.get("/api/workinglinks", async (req, res) => {
  body = bodybuilder()
    .agg("terms", "institution.keyword", { size: 20 })
    .build();
  let myUrl = `http://127.0.0.1:9200/neh/grant/_search`;
  try {
    let results = await axios.post(myUrl, body);
    res.json(
      results.data.aggregations["agg_terms_institution.keyword"].buckets
    );
  } catch (e) {
    res.sendStatus(500);
  }
});
// Get things associated with person
// TODO: make this only apply to certain fields
router.get("/api/people", async (req, res) => {
  let myUrl = `http://127.0.0.1:9200/neh/grant/_search?q=${req.params.q}`;
  try {
    let results = await axios.post(myUrl);
    res.json(
      results.data.aggregations["agg_terms_institution.keyword"].buckets
    );
  } catch (e) {
    res.sendStatus(500);
  }
});
router.get("/api/grants", async (req, res) => {
  let queryString = url.parse(req.url).query;
  let myUrl = `http://127.0.0.1:9200/neh/grant/_search?${queryString}`;
  try {
    let results = await axios.post(myUrl);
    res.json(results.data);
  } catch (e) {
    console.log(e);
    console.log(queryString);
    console.log(myUrl);
    res.sendStatus(400);
  }
});
router.post("/api/raw", async (req, res) => {
  const body = req.body;
  try {
    let results = await axios.post("http://localhost:9200/neh/_search", body);
    res.json(results.data);
  } catch (e) {
    res.json(e).sendStatus(400);
  }
});

export default router;
