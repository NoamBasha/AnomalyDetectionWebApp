// Import Modules:
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const anomalyDetector = require("../Model/anomalyDetector");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({}));
app.use(express.static("../View"));
//app.use(express.json());

//Get Method for '/'
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

//Post Method for '/detect'
app.post("/detect", (req, res) => {
  // Extracting train_csv_file, test_csv_file, alg_type.
  let train = req.body.train_csv_file;
  let test = req.body.test_csv_file;
  let alg_type = req.body.alg_type;

  // Detecting anomalies:
  let ad = new anomalyDetector();
  console.log("Detecting...");
  let anomalies = ad.detectAnomalies(train, test, alg_type);
  console.log("Finished detecting!");

  // anomalies -> JSON
  res.send(JSON.stringify(anomalies));
});

//starting server on port 8080
app.listen(8080, () => console.log("Server started at 8080"));
