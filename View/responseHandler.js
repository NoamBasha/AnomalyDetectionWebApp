function buildTable(data) {
  let table = document.getElementById("result");

  table.innerHTML = "";

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

function vaildateForm() {
  let train = document.getElementById("train_csv_file");
  let test = document.getElementById("test_csv_file");
  let result = document.getElementById("result");
  let msgs = [];

  if (train.files.length == 0) {
    msgs.push("Train CSV file was not uploaded\n");
  }

  if (test.files.length == 0) {
    msgs.push("Test CSV file was not uploaded");
  }

  if (msgs.length > 0) {
    result.innerText = msgs.join("");
    return false;
  }

  return true;
}

$(function () {
  $("#detect").on("click", async function () {
    if (!vaildateForm()) {
      return;
    }
    let detect = document.getElementById("detect");
    detect.disabled = true;
    console.log("Uploading files...");
    let train_csv_file;
    let test_csv_file;
    try {
      train_csv_file = await readContent("train_csv_file");
      test_csv_file = await readContent("test_csv_file");
    } catch (e) {
      detect.disabled = false;
      alert(e.message);
      return;
    }
    console.log("Finished uploading files!");

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
        detect.disabled = false;
        buildTable(JSON.parse(anomalies));
      },
      error: function () {
        detect.disabled = false;
        alert("Could not detect!\nMake sure you uploaded coordinated files");
      },
    });
  });
});

function denyFormRequest(e) {
  e.preventDefault();
  return false;
}
