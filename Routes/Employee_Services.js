const express = require("express");
const ImageUpload = require("../Utilities/ImageUpload");
const fs = require("fs");
const path = require("path");
const sqlConnection = require("../models/db");
const auth = require("../Utilities/auth");

const upload = ImageUpload.upload;
router = express.Router();

router
    // Adding New Employee with Image.
    .post("/", auth.verifyToken ,upload.single('employee_image'), (req, res, next) => { // expecting image(employee_image), empId and empName as fields
        const checkEmployeeQuery = "SELECT 1 FROM Employees WHERE EmployeeId = \'" + req.body.empId + "\';";
        sqlConnection.query(checkEmployeeQuery, (error, results, fields) => {
            if (error) {
                next(new Error("Error - Try Again."));
                return;
            }
            if (results.length == 0) {
                const createEmployeeQuery = "INSERT INTO Employees(EmployeeName, EmployeeId) " +
                                            "VALUES (\'" + req.body.empName + "\',\'" + req.body.empId + "\');";
                sqlConnection.query(createEmployeeQuery, (error, results, fields) => {
                    if (error) {
                        throw error;
                    }
                    // console.log(results);
                    fs.renameSync(req.file.path, req.file.path.replace('temp', req.body.empName
                                  + "_" + req.body.empId + path.extname(req.file.originalname)));
                    res.end("Employee Added Successfully");
                });
            }
            else {
                next(new Error("Employee Already Exists.")); // forcefully send to error-handling middleware
            }
        });
    })

    // Deleting Employee by deleting their Image.
    .delete("/", auth.verifyToken,(req, res, next) => { // expecting empId and empName as fieldss

        var fileName = req.body.empName + "_" + req.body.empId;
        var imageFound = true;
        if (fs.existsSync("./images/" + fileName + ".jpg")) {
            fileName += ".jpg";
        }
        else if (fs.existsSync("./images/" + fileName + ".png")) {
            fileName += ".png";
        }
        else {
            imageFound = false;
        }

        const deleteEmployeeQuery = "DELETE FROM Employees WHERE EmployeeId=\'" + req.body.empId 
                                    + "\' AND EmployeeName=\'" + req.body.empName + "\'";
        sqlConnection.query(deleteEmployeeQuery, (error, results, fields) => {
            if (error) {
                next(new Error("Error - Try Again."));
                return;
            }
            var affectedRows = results.affectedRows;
            if (affectedRows === 0) {
                next(new Error("Employee Not Found."));
            } 
            else {
                if (imageFound) {
                    fs.unlink("./images/" + fileName, (err) => {
                        if (err) {
                            throw new Error("Error - Try Again.");
                        }
                    });
                }
                res.end("Employee Successfully Deleted.");
            }
        });
    })

    .put("/", auth.verifyToken, (req, res, next) => {
        const resetRecordQuery = "UPDATE Employees SET Warnings = 0 WHERE EmployeeID = \'" + req.body.empId 
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
    });

module.exports = router;