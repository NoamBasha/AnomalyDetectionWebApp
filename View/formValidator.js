const form = document.getElementById("detectForm");
const train = document.getElementById("train_csv_file");
const test = document.getElementById("test_csv_file");
const alg_type = document.getElementById("algorithms");
const result = document.getElementById("result");

form.addEventListener("submit", (err) => {
  let msgs = [];

  if (train.data == null) {
    msgs.push("There is no train csv uploaded");
  }

  if (test.data == null) {
    msgs.push("There is no test csv uploaded");
  }

  if (alg_type.data == null) {
    msgs.push("Algorithm type was not selected");
  }

  if (msgs.length > 0) {
    err.preventDefault();
    console.log("Error");
    result.innerText = msgs.join(",");
  }
});
