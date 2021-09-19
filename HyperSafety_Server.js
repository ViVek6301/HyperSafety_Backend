const express = require("express");
const bodyParser = require("body-parser");
const EmployeeServices = require('./Routes/Employee_Services');
const AdminServices = require("./Routes/Admin_Services");
const Ping = require("./Routes/Ping");
const morgan = require("morgan");
const checkImgurAccessToken = require("./Utilities/updateImgurAccessToken");

var app = express();
app.listen(7090);

checkImgurAccessToken.checkImgurAccessToken();

console.log("Employee Management Server is Running...");

app.use(bodyParser.json());
app.use(morgan('combined'));

app.use('/api/employee_services', EmployeeServices);
app.use('/api/admin_services', AdminServices);
app.use("/api/ping", Ping);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send(err.message);
});