const form = document.getElementById("detectForm");
const train = document.getElementById("train_csv_file");
const test = document.getElementById("test_csv_file");
const alg_type = document.getElementById("algorithms");
const result = document.getElementById("result");

form.addEventListener("submit", (err) => {
  let msgs = [];

  if (train.files.length == 0) {
    msgs.push("Train CSV file was not uploaded\n");
  }

  if (test.files.length == 0) {
    msgs.push("Test CSV file was not uploaded");
  }

  if (msgs.length > 0) {
    err.preventDefault();
    result.innerText = msgs.join("");
  }
});
