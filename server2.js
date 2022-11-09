// const mysql = require('mysql2');
// const inquirer = require('inquirer');
// const chalk = require('chalk');
// const cTable = require('console.table');
const inquirer = require('inquirer');
const startScreen = [
    'View all Employees',
    'View all Emplyees by Department',
    'View all Employees by Manager',
    'Add Employee',
    'Remove Employee',
    'Update Employee Role',
    'View all Roles',
    'Add Role',
    'Remove Role',
    'View all Departments',
    'Add Department',
    'Remove Department',
    'Exit',
];
// allows selecting of employee by "first name" instead of "first_name" or "Deparment" instead of "deparment_name" etc.
// const allEmployeeQuery = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title, d.ddepartment_name AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
// FROM employees e
// LEFT JOIN roles r 
// ON r.id = e.role_id 
// LEFT JOIN departments d 
// ON d.id = r.department_id
// LEFT JOIN employees m ON m.id = e.manager_id
// ORDER BY e.id;`;

inquirer.prompt([
    {
        name: 'menuChoice',
        type: 'list',
        message: 'Select an option',
        choices: startScreen,
     },
    ])
.then((answer) => {
    switch (answer.menuChoice) {
        case 'View all Employees':
            showAll();
            break;
        case 'View all Emplyees by Department':
            showByDept();
            break;
        case 'View all Employees by Manager':
            showByManager();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Remove Employee':
            removeEmployee();
            break;
        case 'Update Employee Role':
            updateRole();
            break;
        case 'View all Roles':
            viewRoles();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'Remove Role':
            removeRole();
            break;
        case 'View all Departments':
            viewDept();
            break;
        case 'Add Department':
            addDept();
            break;
        case 'Remove Department':
            removeDept();
            break;
        case 'Exit':
            connection.end();
            break;
        default:
            connection.end()
    }
})
// allows selecting of employee by "first name" instead of "first_name" or "Deparment" instead of "deparment_name" etc.
const allEmployeeQuery = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title, d.ddepartment_name AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
FROM employees e
LEFT JOIN roles r 
ON r.id = e.role_id 
LEFT JOIN departments d 
ON d.id = r.department_id
LEFT JOIN employees m ON m.id = e.manager_id
ORDER BY e.id;`;
// allows you to add an employee
const addEmployeeQuestions = [
    'What is the employees first name?',
    'What is the employees last name?',
    'What will be their role?',
    'Who will be their manager?'
];
// concatenating the names to make a full name and also adding their title and derartment-- also desplays manager when they are in fact a manager
const roleQuery = 'SELECT * from roles; SELECT CONCAT (e.first_name," ",e.last_name) AS full_name FROM employees e';
const mgrQuery = 'SELECT CONCAT (e.first_name," ",e.last_name) AS full_name, r.title, d.department_name FROM employees e INNER JOIN roles r ON r.id = e.role_id INNER JOIN departments d ON d.id = r.department_id WHERE department_name = "Management";';


// runs the app, allows options for adding and removing employees, updating and removing roles, viewing by manager or department etc. 
   inquirer.prompt([
        {
            name: 'menuChoice',
            type: 'list',
            message: 'Select an option',
            choices: startScreen,
         },
        ])
    .then((answer) => {
        switch (answer.menuChoice) {
            case 'View all Employees':
                showAll();
                break;
            case 'View all Emplyees by Department':
                showByDept();
                break;
            case 'View all Employees by Manager':
                showByManager();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Update Employee Role':
                updateRole();
                break;
            case 'View all Roles':
                viewRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Remove Role':
                removeRole();
                break;
            case 'View all Departments':
                viewDept();
                break;
            case 'Add Department':
                addDept();
                break;
            case 'Remove Department':
                removeDept();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                connection.end()
        }
    })


// startApp();
// // show all employees
// const showAll = () => {
//     connection.query(allEmployeeQuery, (err, results) => {
//         if (err) throw err;
//         console.log(' ');
//         console.table(chalk.bold.bgRed('All Employees'), results)
//         startApp();
//     })
// };

// show employees, filtered by department, then you can select by "first name" instead if "first_name" or "Deparment" instead of "deparment_name" etc.
const showByDept = () => {
    const deptQuery = 'SELECT * FROM departments';
    connection.query(deptQuery, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'deptChoice',
                type: 'list',
                choices: function () {
                    let choiceArray = results.map(choice => choice.department_name)
                    return choiceArray;
                },
                message: 'Select a Department to view:'
            }
        ]).then((answer) => {
            let chosenDept;
            for (let i = 0; i < results.length; i++) {
                if (results[i].department_name === answer.deptChoice) {
                    chosenDept = results[i];
                }
            }
            const query = 'SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", d.department_name AS "Department", r.salary AS "Salary" FROM employees e INNER JOIN roles r ON r.id = e.role_id INNER JOIN departments d ON d.id = r.department_id WHERE ?;';
            connection.query(query, { department_name: chosenDept.department_name }, (err, res) => {
                if (err) throw err;
                console.log(' ');
                console.table(chalk.bold.bgRed(`All Employees by Department: ${chosenDept.department_name}`), res)
                // startApp();
            })
        })
    })
};