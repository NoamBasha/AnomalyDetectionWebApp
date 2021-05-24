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
  let train = req.files.train_csv_file.data.toString();
  let test = req.files.test_csv_file.data.toString();
  let alg_type = req.body.algorithms;

  // Detecting anomalies:
  let ad = new anomalyDetector();
  let anomalies = ad.detectAnomalies(train, test, alg_type);
  // anomalies -> JSON
  res.send(buildTable(anomalies));
  res.end();
});

function buildTable(data) {
  let tableStart = `<table class="table table-striped">
                      <tr class="bg-info">
                        <th>
                          Descripition
                        </th>
                        <th>
                          Time
                        </th>
                      </tr>
                      <tbody>`;
  let tableEnd = `    </tbody>
                    </table>`;
  let tableMiddle = ``;
  for (let i = 0; i < data.length; i++) {
    let row = `<tr>
                <td>${data[i].description}</td>
                <td>${data[i].time}</td>
               </tr>`;
    tableMiddle += row;
  }
  let table = tableStart + tableMiddle + tableEnd;
  return table;
}

//starting server on port 8080
app.listen(8080, () => console.log("server started at 8080"));
