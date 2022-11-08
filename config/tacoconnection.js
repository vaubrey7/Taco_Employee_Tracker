const mysql = require('mysql2');
const chalk = require('chalk');

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
        console.log(chalk.bold.white.bgblack(err));
        return;
    }

    console.log(chalk.bold.greenBright(`Connected to db. ThreadID: ${connection.threadId}`));
})

module.exports = connection;