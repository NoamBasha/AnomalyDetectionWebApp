// Import Modules:
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const anomalyDetector = require("../Model/anomalyDetector");

app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({}));
app.use(express.static("../View"));

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;
global.document = document;

//Get Method for '/'
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

//Post Method for '/detect'
app.post("/detect", (req, res) => {
  // Extracting train_csv_file, test_csv_file, alg_type.
  if (req.files && req.files.train_csv_file && req.files.test_csv_file) {
    let train = req.files.train_csv_file.data.toString();
    let test = req.files.test_csv_file.data.toString();
    let alg_type = req.body.algorithms;

    // Detecting anomalies:
    let ad = new anomalyDetector();
    let anomalies = ad.detectAnomalies(train, test, alg_type);
    // anomalies -> JSON
    console.log(buildTable(anomalies));
    res.send(buildTable(anomalies));
    res.end();
  }
  res.status(400).send("Please enter two csv files and pick an algorithm");
  res.end();
});

function buildTable(data) {
  let table = document.createElement("table");
  let row = table.insertRow();

  let thDescripition = document.createElement("th");
  thDescripition.innerHTML = "Descripition";
  let thTime = document.createElement("th");
  thTime.innerHTML = "Time";

  row.appendChild(thTime);
  row.appendChild(thDescripition);

  for (let i = 0; i < data.length; i++) {
    row = table.insertRow();
    let tdDescripition = document.createElement("td");
    let tdTime = document.createElement("td");
    tdDescripition.innerHTML = data[i].description;
    tdTime.innerHTML = data[i].time;
    row.appendChild(tdDescripition);
    row.appendChild(tdTime);
  }

  table.setAttribute(
    "style",
    "border:5px solid black;border-collapse:collapse;width:100%;padding:8px;text-align:center;font-size:25px;"
  );

  return table.outerHTML;
}

//starting server on port 8080
app.listen(8080, () => console.log("server started at 8080"));
