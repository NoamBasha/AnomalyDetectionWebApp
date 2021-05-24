const form = document.getElementById("detectForm");
const train = document.getElementById("train_csv_file");
const test = document.getElementById("test_csv_file");
const alg_type = document.getElementById("algorithms");
const result = document.getElementById("result");

form.addEventListener("submit", (err) => {
  document.result.innerHTML = document.result;
});
