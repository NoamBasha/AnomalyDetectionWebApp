# AnomalyDetectionWebApp

The project is a web application for anomaly detection algorithms, which was developed in JavaScript using node.js and CSS.
The project is intended for a diverse audience of consumers such as regular users, automated services, etc.

The user opens a browser at localhost:8080, where he selects a regression-based and hybrid-based anomaly detection algorithm.
The user selects a valid CSV file, and another file that may contain anomalies.
By clicking on the upload button the files are transferred to the server.
The server detects anomalies and the output with the anomalies report appears on the same web page.

In addition, it is possible to send an HTTP POST to the same local address, where the command contains the selection of the algorithms mentioned above.
This way the user gets back JSON which includes reporting where the anomalies occurred.

##architecture
The project is based on the MVC architecture.
*View: is an HTML web page, two fields for selecting files and a frame for displaying the output.
The controller instructs the view from where to pull the JSON and it in turn decodes and displays it.
*Controller: For the http post command to "/ detect" the controller decodes the request and instructs the model to perform the calculation.
In receiving the result as JSON the controller instructs the view to create the desired output.
*Model: The model implements the algorithm itself, and returns the exception report as JSON.

##Functionality
On our web page, Anomaly Detector, the top option was to drag a Train CSV file, 
below it is the option to drag a Test CSV file and finally you can choose which anomaly detection algorithm you want to use.
After uploading the files and selecting the algorithm, you can send to the server by clicking the 'Detect' button.
If you want a new detection, drag the new files and click the 'Detect' button again.

