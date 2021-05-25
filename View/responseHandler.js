function buildTable(data) {
  let table = document.getElementById("result");
  let row = table.insertRow();

  let thDescripition = document.createElement("th");
  thDescripition.innerHTML = "Descripition";
  let thTime = document.createElement("th");
  thTime.innerHTML = "Time";

  row.appendChild(thDescripition);
  row.appendChild(thTime);

  for (let i = 0; i < data.length; i++) {
    row = table.insertRow();
    let tdDescripition = document.createElement("td");
    let tdTime = document.createElement("td");
    tdDescripition.innerHTML = data[i].description;
    tdTime.innerHTML = data[i].time;
    row.appendChild(tdDescripition);
    row.appendChild(tdTime);
  }
}

async function readContent(inputId) {
  return new Promise((resolve) => {
    let file = document.getElementById(inputId).files[0];
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      resolve(evt.target.result);
    };
  });
}

$(function () {
  $("#detect").on("click", async function () {
    let train_csv_file = await readContent("train_csv_file");
    let test_csv_file = await readContent("test_csv_file");
    let alg_type = $("#algorithms");

    let toDetect = {
      train_csv_file: train_csv_file,
      test_csv_file: test_csv_file,
      alg_type: alg_type.val(),
    };

    $.ajax({
      type: "POST",
      url: "/detect",
      data: toDetect,
      success: function (anomalies) {
        buildTable(JSON.parse(anomalies));
      },
      error: function () {
        alert("Could not detect");
      },
    });
  });
});

function denyFormRequest(e) {
  e.preventDefault();
  return false;
}
