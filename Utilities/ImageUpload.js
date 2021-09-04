const multer = require("multer");

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
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
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