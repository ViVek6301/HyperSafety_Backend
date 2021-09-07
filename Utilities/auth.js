const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
    console.log("Token: " + token);
    if (!token) {
        return res.status(403).send("Token Not Supplied.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
    }
    catch (err) {
        res.status(401).send("Invalid Token");
    }

    return next();

}

module.exports = {verifyToken};