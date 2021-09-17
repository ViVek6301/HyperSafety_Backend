const express = require("express");

router = express.Router();

router.get("/", (req, res, next) => {
    res.end("Server is up.");
});

module.exports = router;