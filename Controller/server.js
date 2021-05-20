//imports modules
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const anomalyDetector = require("../Model/anomalyDetector");

//define app uses
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(fileUpload({}));
app.use(express.static("../View"));

//Get Method for '/' url
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

//Post Method for '/search' url
app.post("/detect", (req, res) => {
  // Extract train_csv_file, test_csv_file, algorithm_type.

  /*
  let anomalies = anomalyDetector.detectAnomalies(
    train_csv_file,
    test_csv_file,
    algorithm_type
  );
  */

  // anomalies -> JSON

  res.send("Hello World");
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
