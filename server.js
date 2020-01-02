const express = require("express");
const app = express();
const connection = require("./dbConfig");
const dump = require("./dump");
const queries = require("./queries");
const utils = require("./utils");

connection.query("select count(*) from costs", (error, results) => {  // dumps data in DB only when no table is there.
  if (error) {
    connection.query(dump, (error, results) => {
      if (error) {
        console.log("Error in executing query  ", error)
      }
      else {
        "Database seed successfull";
      }
    })
  };
});

const getCost = function (queryParams) {   // db call for the query
  return new Promise(function (resolve, reject) {
  connection.query(
    queries.getQueryStrings(queryParams),  // fetching query string
    function (err, rows) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve(rows);
      }
    }
  )
}
  )
}

app.get("/cost-explorer", async (req, res) => {
  try {
    const results = await getCost(req.query);    // fetching table results form query
    res.send({
      success: true,
      data: utils.aggregateResults(results),   //modifying the fetched results
    })
  }
  catch (exception) {
    res.send({
      success: false,
      message: "Error in fetching data " + exception,
    })
  }
})

app.listen(5000, (err, data) => {
  if (err) {
    console.log("Error in starting server ");
  }
  else {
    console.log("Server started at 5000");
  }
})