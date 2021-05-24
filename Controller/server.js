// Import Modules:
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const anomalyDetector = require("../Model/anomalyDetector");

app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({}));
app.use(express.static("../View"));

//Get Method for '/'
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

//Post Method for '/detect'
app.post("/detect", (req, res) => {
  // Extracting train_csv_file, test_csv_file, alg_type.
  if (req.files.length == 2) {
    if (req.files.train_csv_file && req.files.test_csv_file && req.body) {
      let train = req.files.train_csv_file.data.toString();
      let test = req.files.test_csv_file.data.toString();
      let alg_type = req.body.algorithms;

      if (train && test && alg_type) {
        // Detecting anomalies:
        let ad = new anomalyDetector();
        let anomalies = ad.detectAnomalies(train, test, alg_type);
        // anomalies -> JSON
        res.status(200).send(JSON.stringify(anomalies));
      }
      res.end();
    }
  } else {
    // No files
  }
});

//starting server on port 8080
app.listen(8080, () => console.log("server started at 8080"));
