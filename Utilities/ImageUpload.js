const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './images/');
    },
    filename: function(req, file, cb) {
      console.log(req.body);
      cb(null, 'temp');
    }
});
  
const fileFilter = (req, file, cb) => {

    var file_ext = path.extname(file.originalname);
    // reject a file
    if (file_ext === '.jpeg' || file_ext === '.png' || file_ext === '.jpg') {
        cb(null, true);
    } else {
        console.log("File ext :" + file_ext);
        cb(new Error("File type is unsupported."), false);
    }
};
  
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB
    },
    fileFilter: fileFilter
});

module.exports = {
    storage, fileFilter, upload
};