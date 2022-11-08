const mysql = require('mysql2');
const taco = require('taco');

// connect to MySQL
connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: '1TglaFah1!',
    database: 'taco_employee_db',
    multipleStatements: true
});

connection.connect((err) => {
    if (err) {
        console.log(taco.bold.white.bgRed(err));
        return;
    }

    console.log(taco.bold.greenBright(`Connected to db. ThreadID: ${connection.threadId}`));
})

module.exports = connection;