const mysql = require('mysql2');


// connects to MySQL
connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1TglaFah1!',
    database: 'taco_employee_db',
    multipleStatements: true
});


module.exports = connection;