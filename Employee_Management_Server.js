const express = require("express");
const bodyParser = require("body-parser");
const Services = require('./Routes/Services');

var app = express();
app.listen(7091);

console.log("Employee Management Server is Running...");

app.use(bodyParser.json());

app.use('/api/employee_services', Services);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send(err.message);
});