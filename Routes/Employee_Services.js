const express = require("express");
const ImageUpload = require("../Utilities/ImageUpload");
const fs = require("fs");
const path = require("path");
const sqlConnection = require("../models/db");
const request = require("request");
const auth = require("../Utilities/auth");
require('dotenv').config();

const upload = ImageUpload.upload;
router = express.Router();

router
    // Adding New Employee with Image.
    .post("/", auth.verifyToken, upload.single('employee_image'), (req, res, next) => { // expecting image(employee_image), empID and empName as fields
        const checkEmployeeQuery = "SELECT 1 FROM Employees WHERE EmployeeId = \'" + req.body.empID + "\';";
        sqlConnection.query(checkEmployeeQuery, (error, results, fields) => {
            if (error) {
                next(new Error("Error - Try Again."));
                return;
            }
            if (results.length == 0) {
                const fileName = 'temp' + path.extname(req.file.originalname);
                fs.renameSync(req.file.path, req.file.path.replace('temp', fileName));
                var imgurUploadRequest = {
                    'method': 'POST',
                    'url': 'https://api.imgur.com/3/image',
                    'headers': {
                        'Authorization': 'Bearer ' + process.env.IMGUR_ACCESS_TOKEN
                    },
                    formData: {
                        "image": fs.createReadStream("./images/" + fileName),
                        "album": process.env.IMGUR_ALBUM_ID,
                        "type": "file"
                    }
                    // 'maxRedirects': 20
                };

                request(imgurUploadRequest, function (error, response) {
                    if (error) {
                        console.log(error);
                        res.json(error);
                    }
                    var imgurUploadResponse = JSON.parse(response.body);
                    if (imgurUploadResponse.data.error) {
                        console.log(imgurUploadResponse.data.error);
                        res.status(imgurUploadResponse.status).send(imgurUploadResponse.data.error);
                        return;
                    }
                    fs.unlink("./images/" + fileName, (err) => {
                        if (err) {
                            throw new Error("Error - Try Again.");
                        }
                    });
                    const createEmployeeQuery = "INSERT INTO Employees(EmployeeName, EmployeeId, ImageID, ImageURL) " +
                        "VALUES (\'" + req.body.empName + "\',\'" + req.body.empID + "\',\'" + imgurUploadResponse.data.id
                        + "\',\'" + imgurUploadResponse.data.link + "\');";
                    sqlConnection.query(createEmployeeQuery, (error, results, fields) => {
                        if (error) {
                            throw error;
                        }
                        res.end("Employee Added Successfully");
                    });
                });

            }
            else {
                next(new Error("Employee Already Exists.")); // forcefully send to error-handling middleware
            }
        });
    })

    // Deleting Employee by deleting their Image.
    .delete("/", auth.verifyToken, (req, res, next) => {
        const findImageIDQuery = "SELECT ImageID FROM Employees WHERE EmployeeID =\'" + req.body.empID
            + "\' AND EmployeeName=\'" + req.body.empName + "\';";
        sqlConnection.query(findImageIDQuery, (error, results, fields) => {
            if (error) {
                next(new Error("Error - Try Again."));
                return;
            }
            if (results.length == 0) {
                next(new Error("Employee Not Found."));
                return;
            }
            else {
                const imageID = results[0].ImageID;
                const deleteEmployeeQuery = "DELETE FROM Employees WHERE EmployeeId=\'" + req.body.empID
                                            + "\' AND EmployeeName=\'" + req.body.empName + "\'";
                sqlConnection.query(deleteEmployeeQuery, (error, results, fields) => {
                    if (error) {
                        next(new Error("Error - Try Again."));
                        return;
                    }

                    var imgurDeleteRequest = {
                        'method': 'DELETE',
                        'url': 'https://api.imgur.com/3/image/' + imageID,
                        'headers': {
                            'Authorization': 'Bearer ' + process.env.IMGUR_ACCESS_TOKEN
                        }
                        // 'maxRedirects': 20
                    };
                
                    request(imgurDeleteRequest, function(error, response) {
                        if (error) {
                            console.log(error);
                            res.setHeader("Content-Type", "application/json");
                            res.status(500).json(error);
                            return;
                        }
                        var imgurDeleteResponse = JSON.parse(response.body);
                        if (imgurDeleteResponse.data.error) {
                            console.log(imgurDeleteResponse.data.error);
                            res.status(imgurDeleteResponse.status).send(imgurDeleteResponse.data.error);
                            return;
                        }
                        res.send("Employee Successfully Deleted.");
                    });

                });
            }
        });
    })

    .put("/", auth.verifyToken, (req, res, next) => {
        const resetRecordQuery = "UPDATE Employees SET Warnings = 0 WHERE EmployeeID = \'" + req.body.empID
            + "\' AND EmployeeName = \'" + req.body.empName + "\'";
        sqlConnection.query(resetRecordQuery, (error, results, fields) => {
            if (error) {
                next(new Error("Error - Try Again."));
                return;
            }
            var affectedRows = results.affectedRows;
            if (affectedRows === 0) {
                next(new Error("Employee Not Found."));
            }
            else {
                res.end("Record Reset Successfully.");
            }
        });
    })

    .get("/", auth.verifyToken, (req, res, next) => {
        const getEmployeesQuery = "SELECT EmployeeID, EmployeeName, Warnings FROM Employees";
        sqlConnection.query(getEmployeesQuery, (error, results, fields) => {
            if (error) {
                next(new Error("Error - Try Again."));
                return;
            }
            res.setHeader("Content-Type", "application/json");
            res.json(results);
        });
    })

    .get("/:warnings", auth.verifyToken, (req, res, next) => {
        const getEmployeesQuery = "SELECT EmployeeID, EmployeeName, Warnings FROM Employees WHERE Warnings >= " + req.params.warnings;
        sqlConnection.query(getEmployeesQuery, (error, results, fields) => {
            if (error) {
                next(new Error("Error - Try Again."));
                return;
            }
            res.setHeader("Content-Type", "application/json");
            res.json(results);
        });
    })

    .get("/:empID/:empName", auth.verifyToken, (req, res, next) => {
        const getEmployeesQuery = "SELECT * FROM Employees WHERE EmployeeID = \""
            + req.params.empID + "\" and EmployeeName = \"" + req.params.empName + "\"";
        sqlConnection.query(getEmployeesQuery, (error, results, fields) => {
            if (error) {
                next(new Error("Error - Try Again."));
                return;
            }
            res.setHeader("Content-Type", "application/json");
            res.json(results);
        });
    });

module.exports = router;