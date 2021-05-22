// Import Modules:
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const anomalyDetector = require("../Model/anomalyDetector");

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(fileUpload({}));
app.use(express.static("../View"));

//Get Method for '/'
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

//Post Method for '/detect'
app.post("/detect", (req, res) => {
  console.log("Detecting...");
  // Extract train_csv_file, test_csv_file, alg_type.
  let train = req.files.train_csv_file.data.toString();
  let test = req.files.test_csv_file.data.toString();
  let alg_type = req.body.algorithms;

  //let adt = new anomalyDetector.anomalyDetector();
  let ad = new anomalyDetector();
  let anomalies = ad.detectAnomalies(train, test, alg_type);

  console.log(anomalies);

  // anomalies -> JSON

  res.send(anomalies);
  return;
  res.write("searching for " + req.body.key + +":\n");
  let key = req.body.key;
  if (req.files) {
    let file = req.files.text_file;
    let result = model.searchText(key, file.data.toString());
    res.write(result);
    //res.json(result);
    //res.write(JSON.stringify(result));
  }
  res.end();
});

//starting server on port 8080
app.listen(8080, () => console.log("server started at 8080"));
