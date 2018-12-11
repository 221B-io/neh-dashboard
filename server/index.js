const express = require("express"); // call express
const bodyParser = require("body-parser");
const bodybuilder = require("bodybuilder");
// const router = require("./routes/index");
const router = express.Router();
const app = express(); // define our app using express
const axios = require("axios");
const grantsUrl = `http://127.0.0.1:9200/neh/grant/_search`;

// How to write middleware
router.use(function(req, res, next) {
  console.log("Time:", Date.now());
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  try {
    next();
  } catch (e) {
    res.status(500).json(":(");
  }
});

router.get("/", function(req, res) {
  res.json({ message: "hooray! welcome to our api!" });
});

router.get("/detail", async (req, res) => {
  let results = await axios.get(
    `http://localhost:9200/_search?q=${req.query.q}`
  );
  res.json(results.data);
});

router.get("/fulltext", async (req, res) => {
  console.log(req.query);
  let results = await axios.get(
    `http://localhost:9200/_search?q=${req.query.q}&from=${
      req.query.from
    }&size=${req.query.size}`
  );
  res.json(results.data);
});

router.get("/divisions", async (req, res) => {
  body = {
    aggs: {
      divisions: {
        terms: {
          field: "division.keyword"
        }
      }
    }
  };
  let results = await axios.post(grantsUrl, body);
  res.json(results.data);
});

router.get("/programs", async (req, res) => {
  body = {
    aggs: {
      programs: {
        terms: {
          field: "program.keyword"
        }
      }
    }
  };
  let results = await axios.post(grantsUrl, body);
  res.json(results.data);
});

router.get("/institutions", async (req, res) => {
  body = bodybuilder()
    .agg("terms", "institution.keyword", { size: 13 })
    .build();
  let results = await axios.post(grantsUrl, body);
  res.json(results.data.aggregations["agg_terms_institution.keyword"].buckets);
});
router.get("/grantsovertime", async (req, res) => {
  const body = {
    aggs: {
      grants_over_time: {
        date_histogram: { field: "grantStartDate", interval: "year" },
        aggs: {
          total_usd: {
            sum: {
              field: "approvedUsd"
            }
          },
          gender: {
            terms: {
              field: "directorGender.keyword"
            }
          }
        }
      }
    }
  };
  let results = await axios.post(grantsUrl, body);
  console.log(results.data);
  res.json(results.data.aggregations.grants_over_time.buckets);
});

router.get("/usdovertime", async (req, res) => {
  const body = {
    aggs: {
      grants_over_time: {
        date_histogram: { field: "grantStartDate", interval: "year" },
        aggs: {
          total_usd: {
            sum: {
              field: "approvedUsd"
            }
          }
        }
      }
    }
  };
  let results = await axios.post(grantsUrl, body);
  console.log(results.data);
  res.json(results.data.aggregations.grants_over_time.buckets);
});

router.get("/resolved", async (req, res) => {
  const bodyResolved = {
    query: {
      term: {
        "products.primaryURLResolves": true
      }
    }
  };
  const bodyUnresolved = {
    query: {
      term: {
        "products.primaryURLResolves": false
      }
    }
  };
  let resolvedResults = await axios.post(grantsUrl, bodyResolved);
  let unresolvedResults = await axios.post(grantsUrl, bodyUnresolved);
  res.json({
    resolved: resolvedResults.data.hits.total,
    unresolved: unresolvedResults.data.hits.total
  });
});

router.get("/websitesovertime", async (req, res) => {
  const body = {
    websites_over_time: {
      date_histogram: { field: "grantStartDate", interval: "year" }
    },
    query: {
      exists: {
        field: products.primaryURLResolves
      }
    }
  };
  let results = await axios.post(grantsUrl, body);
  debugger;
  res.json(results.data.aggregations.grants_over_time.buckets);
});

router.get("/urlroots", async (req, res) => {
  body = {
    aggs: {
      quantities: {
        terms: {
          field: "products.primaryURLRoot.keyword",
          size: "10"
        }
      }
    }
  };
  console.log(JSON.stringify(body, null, 2));
  let results = await axios.post(grantsUrl, body);
  debugger;
  res.json(results.data.aggregations.quantities.buckets);
});

// Retrieves the number of grants with products
router.get("/grantswithproducts", async (req, res) => {
  body = {
    query: {
      exists: { field: "products" }
    }
  };
  let results = await axios.post(grantsUrl, body);
  res.json(results.data);
  res.status(500).json(":(");
});

router.get("/recent", async (req, res) => {
  body = bodybuilder()
    .query("match_all")
    .sort("grantStartDate", "desc")
    .build();
  let results = await axios.post(grantsUrl, body);
  res.json(results.data);
});

router.get("/gender", async (req, res) => {
  body = {
    aggs: {
      genders: {
        terms: { field: "directorGender" }
      }
    }
  };
  let results = await axios.post(grantsUrl, body);
  res.json(results.data);
});

// TODO: make this retrieve the number of grants with product links vs the number of links that still work
router.get("/workinglinks", async (req, res) => {
  body = bodybuilder()
    .agg("terms", "institution.keyword", { size: 20 })
    .build();
  let results = await axios.post(grantsUrl, body);
  res.json(results.data.aggregations["agg_terms_institution.keyword"].buckets);
});

// Get things associated with person
// TODO: make this only apply to certain fields
router.get("/people", async (req, res) => {
  let myUrl = `${grantsUrl}?q=${req.params.q}`;
  let results = await axios.post(myUrl);
  res.json(results.data.aggregations["agg_terms_institution.keyword"].buckets);
});

router.post("/raw", async (req, res) => {
  const body = req.body;
  let results = await axios.post(grantsUrl, body);
  res.json(results.data);
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port
app.use("/api", router);
app.listen(port);
console.log("Magic happens on port " + port);
