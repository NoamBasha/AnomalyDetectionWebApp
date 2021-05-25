# Anomaly Detection Web Application

The project is a web application for anomalies detection, 
which was developed in JavaScript using Node.js and CSS.
The project is intended for a diverse audience of consumers such as regular users, 
automated services, etc.

The user opens a browser at 
``` localhost:8080 ```
, where he selects either regression-based or hybrid-based anomaly detection algorithm.
The user selects a Train CSV file to train the model with regular flight data, and another CSV file that may contain anomalies.
By clicking on the Detect button the files are transferred to the server.
The server detects the anomalies, and the output with the anomalies report appears on the same web page.

In addition, it is possible to send an HTTP POST to the same local address, 
where the command contains the selection of either of the algorithms mentioned above and the two CSV files.
This way the user recieves a JSON which includes the anomalies report.

## architecture
The project is based on the MVC architecture.
* View: is an HTML web page, two fields for selecting files, select button and a frame for displaying the output.
The controller instructs the view from where to pull the JSON and it in turn decodes and displays it.
* Controller: For the http post command to "/detect" the controller decodes the request 
and instructs the model to perform the calculation.
When receiving the result, the controller convrets it to a JSON and instructs the view to create the desired output.
* Model: The model implements the algorithm itself, and returns the anomlies report.

## Functionality
On our web page, the first option is to select a Train CSV file, 
below it is the option to select a Test CSV file and finally you can choose which anomaly detection algorithm you want to use.

After uploading the files and selecting the algorithm, you can send your selections to the server by clicking the 'Detect' button.
If you want a new detection, select the new files and a new anomaly detection algorithm and click the 'Detect' button again.
![](Image/AnomalyDetectionWebApp.PNG)

## Developers
* Noam Basha
* Hanna Sofer
* Adi Ziv
* Noa Miara