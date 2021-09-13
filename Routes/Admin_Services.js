const express = require("express");
const sqlConnection = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var router = express.Router();

router
    .post("/register", (req, res, next) => {
        const checkAdminQuery = "SELECT 1 FROM Admins WHERE Email = \'" + req.body.email + "\'";
        sqlConnection.query(checkAdminQuery, (error, results, fields) => {
            if (error) {
                next(new Error("Error - Try Again."));
                return;
            }
            if (results.length == 0) {
                // REFER: https://auth0.com/blog/hashing-in-action-understanding-bcrypt/ to understand this hashing.
                bcrypt.hash(req.body.password, 10).then((encryptedPassword) => {
                    const createAdminQuery = "INSERT INTO Admins(Email, Password) VALUES (\'" + req.body.email
                        + "\', \'" + encryptedPassword + "\');";
                    sqlConnection.query(createAdminQuery, (error, results, fields) => {
                        if (error) {
                            next(new Error("Error - Try Again."));
                            return;
                        }
                        res.end("Admin Created Successfully!");
                    });
                });
            }
            else {
                next(new Error("Admin Already Exists With The Same Email ID"));
            }
        });
    })

    .post("/login", (req, res, next) => {
        const checkAdminQuery = "SELECT ID, Email, Password FROM Admins WHERE Email = \'" + req.body.email + "\'";
        sqlConnection.query(checkAdminQuery, (error, results, fields) => {
            if (error) {
                next(new Error("Error - Try Again."));
                return;
            }
            if (results.length == 0) {
                res.status(401).end("Login Failed - Not An Admin.");
            }
            else {
                var admin = results[0];
                bcrypt.compare(req.body.password, admin.Password)
                .then((isValidCredentials) => {
                    if (isValidCredentials) {
                        // REFER: https://stackoverflow.com/questions/31309759/what-is-secret-key-for-jwt-based-authentication-and-how-to-generate-it
                        const signedToken = jwt.sign({
                            id: admin.ID,
                            email: admin.Email
                        },
                            process.env.JWT_SECRET,
                        {
                            expiresIn: '1h'
                        });
                        res.status(200).json({
                            message: 'Login Successful!',
                            token: signedToken
                        });
                    }
                    else {
                        res.status(401).end("Login Failed - Password Incorrect");
                    }
                });
            }
        });
    })

module.exports = router;
