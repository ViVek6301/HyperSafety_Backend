const sqlConnection = require("../models/db");

const io = require('socket.io')(
    7091, 
    // {serveClient = false  }
);
io.on('connection', (socket) => {
    console.log("Got Connection");
    socket.on("Update Warnings.", (data) => {
        const updateWarningsQuery = "UPDATE Employees set Warnings = Warnings + 1," 
        + "LastWarned = CURRENT_TIMESTAMP  where EmployeeID = \"" + data + 
        "\" and LastWarned < NOW() - INTERVAL 1 MINUTE;"
        sqlConnection.query(updateWarningsQuery, (error, results, fields) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Number of rows Affected : " + results.affectedRows);
            }
        })
    })
});

console.log("Socket Server running on port 7091...");

module.exports = io;