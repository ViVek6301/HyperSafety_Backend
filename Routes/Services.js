const express = require("express");
const ImageUpload = require("../Utilities/ImageUpload");
const fs = require("fs");
const path = require("path");

const storage = ImageUpload.storage;
const fileFilter = ImageUpload.fileFilter;
const upload = ImageUpload.upload;
router = express.Router();

// ADDING A NEW EMPLOYEE
router
.post("/", upload.single('employeeImage'), (req, res) => {
    fs.renameSync(req.file.path, req.file.path.replace('temp', req.body.name + "_" + req.body.id + path.extname(req.file.originalname)));
    res.send("perfectly working!!!");
})
.delete("/", (req, res) => {
    // req.body.name and req.body.id
    var fileName = req.body.name + "_" + req.body.id;
    if (fs.existsSync("./images/" + fileName + ".jpg")) {
        fileName += ".jpg";
    }
    else if (fs.existsSync("./images/" + fileName + ".png")) {
        fileName += ".png";
    }
    else {
        console.log(fileName);
        throw new Error("Image not found - Check the details.");
    }
    fs.unlink("./images/" + fileName, (err) => {
        if (err) {
            throw new Error("File could not be deleted.");
        }
        res.end("File successfully deleted");
    });
});



module.exports = router;

