const express = require("express");
const ImageUpload = require("../Utilities/ImageUpload");
const fs = require("fs");
const path = require("path");

const upload = ImageUpload.upload;
router = express.Router();

router
// Adding New Employee with Image.
.post("/", upload.single('employee_image'), (req, res) => {
    fs.renameSync(req.file.path, req.file.path.replace('temp', req.body.empName 
                    + "_" + req.body.empId + path.extname(req.file.originalname)));
    res.send("Employee Image Added Successfully");
})

// Deleting Employee by deleting their Image.
.delete("/", (req, res) => {

    var fileName = req.body.empName + "_" + req.body.empId;

    if (fs.existsSync("./images/" + fileName + ".jpg")) {
        fileName += ".jpg";
    }
    else if (fs.existsSync("./images/" + fileName + ".png")) {
        fileName += ".png";
    }
    else {
        // console.log(fileName);
        throw new Error("Image not found - Check the details.");
    }

    // Delete Employee Image.
    fs.unlink("./images/" + fileName, (err) => {
        
        if (err) {
            throw new Error("File could not be deleted.");
        }
        res.end("File successfully deleted");
    });
});

module.exports = router;