const mysql = require('mysql2');
const inquirer = require('inquirer');
const chalk = require('chalk');
const cTable = require('console.table');
const connection = require('./config/tacoconnection');
const startScreen = [
  'View all Employees', 
  'View all Emplyees by Department', 
//   'View all Employees by Manager', 
  'Add Employee', 
  'Remove Employee', 
  'Update Employee Role', 
  'View all Roles', 
  'Add Role', 
  'Remove Role', 
  'View all Departments', 
  'Add Department', 
  'Remove Department', 
  'Exit'
]
// this is setting up an easier way for the query, as you can see instead of SELECT e.first_name it changes it to an easier to understand "First Name for all the query's"
const allEmployeeQuery = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title, d.department_name AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
FROM employees e
LEFT JOIN roles r 
ON r.id = e.role_id 
LEFT JOIN departments d 
ON d.id = r.department_id
LEFT JOIN employees m ON m.id = e.manager_id
ORDER BY e.id;`
const addEmployeeQuestions = [
  'What is the first name?', 
  'What is the last name?', 
  'What is their role?', 
  'Who is their manager?'
]
// this is concatenating the e.first_name and e.last_name as "full_name" for role query and it will also do so for Mgr query 
const roleQuery = 'SELECT * from roles; SELECT CONCAT (e.first_name," ",e.last_name) AS full_name FROM employees e'
const mgrQuery = 'SELECT CONCAT (e.first_name," ",e.last_name) AS full_name, r.title, d.department_name FROM employees e INNER JOIN roles r ON r.id = e.role_id INNER JOIN departments d ON d.id = r.department_id WHERE department_name = "Management";'

  
// runs the app then gives you your menu choices and takes you through them from there. 
const startApp = () => {
  inquirer.prompt({
      name: 'menuChoice',
      type: 'list',
      message: 'Select an option',
      choices: startScreen
  }).then((answer) => {
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
      }
  })
}

// show all employees
const showAll = () => {
  connection.query(allEmployeeQuery, (err, results) => {
      if (err) throw err;
      console.log(' ');
      console.table(chalk.bold.yellow('All Employees'), results)
      startApp();
  })
}

// show employees, filtered by department
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
              console.table(chalk.bold.yellow(`All Employees by Department: ${chosenDept.department_name}`), res)
              startApp();
          })
      })
  })
}

// show employees, filtered by manager
const showByManager = () => {
  connection.query(mgrQuery, (err, results) => {
      if (err) throw err;
      inquirer.prompt([
          {
              name: 'mgr_choice',
              type: 'list',
              choices: function () {
                  let choiceArray = results.map(choice => choice.full_name);
                  return choiceArray;
              },
              message: 'Select a Manager:'
          }
      ]).then((answer) => {
        // again another concatanation to give you the full name of the manager
          const mgrQuery2 = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", IFNULL(r.title, "No Data") AS "Title", IFNULL(d.department_name, "No Data") AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
              FROM employees e
              LEFT JOIN roles r 
              ON r.id = e.role_id 
              LEFT JOIN departments d 
              ON d.id = r.department_id
              LEFT JOIN employees m ON m.id = e.manager_id
              WHERE CONCAT(m.first_name," ",m.last_name) = ?
              ORDER BY e.id;`
          connection.query(mgrQuery2, [answer.mgr_choice], (err, results) => {
              if (err) throw err;
              console.log(' ');
              console.table(chalk.bold.yellow('Employees by Manager'), results);
              startApp();
          })
      })
  })
}

// add an employee to the employee menu options 
const addEmployee = () => {
  connection.query(roleQuery, (err, results) => {
      if (err) throw err;
      inquirer.prompt([
          {
              name: 'fName',
              type: 'input',
              message: addEmployeeQuestions[0]

          },
          {
              name: 'lName',
              type: 'input',
              message: addEmployeeQuestions[1]
          },
          {
              name: 'role',
              type: 'list',
              choices: function () {
                  let choiceArray = results[0].map(choice => choice.title);
                  return choiceArray;
              },
              message: addEmployeeQuestions[2]

          },
          {
              name: 'manager',
              type: 'list',
              choices: function () {
                  let choiceArray = results[1].map(choice => choice.full_name);
                  return choiceArray;
              },
              message: addEmployeeQuestions[3]
          }
      ]).then((answer) => {
          connection.query(
              `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES(?, ?, 
              (SELECT id FROM roles WHERE title = ? ), 
              (SELECT id FROM (SELECT id FROM employees WHERE CONCAT(first_name," ",last_name) = ? ) AS tmptable))`, [answer.fName, answer.lName, answer.role, answer.manager]
         
              )
          startApp();
      })
  })
}

// delete an employee from the employee roster... RIP twitter anyone, anyone?
const removeEmployee = () => {
  connection.query(allEmployeeQuery, (err, results) => {
      if (err) throw err;
      console.log(' ');
      console.table(chalk.bold.yellow('All Employees'), results)
      inquirer.prompt([
          {
              name: 'IDtoRemove',
              type: 'input',
              message: 'Enter the Employee ID of the person to remove:'
          }
      ]).then((answer) => {
          connection.query(`DELETE FROM employees where ?`, { id: answer.IDtoRemove })
          startApp();
      })
  })
}

// update the employee's role in the company "choose or die, choose or die" RIP Elon Musk
const updateRole = () => {
  const query = `SELECT CONCAT (first_name," ",last_name) AS full_name FROM employees; SELECT title FROM roles`
  connection.query(query, (err, results) => {
      if (err) throw err;
      inquirer.prompt([
          {
              name: 'empl',
              type: 'list',
              choices: function () {
                  let choiceArray = results[0].map(choice => choice.full_name);
                  return choiceArray;
              },
              message: 'Select an employee to update their role:'
          },
          {
              name: 'newRole',
              type: 'list',
              choices: function () {
                  let choiceArray = results[1].map(choice => choice.title);
                  return choiceArray;
              }
          }
      ]).then((answer) => {
          connection.query(`UPDATE employees 
          SET role_id = (SELECT id FROM roles WHERE title = ? ) 
          WHERE id = (SELECT id FROM(SELECT id FROM employees WHERE CONCAT(first_name," ",last_name) = ?) AS tmptable)`, [answer.newRole, answer.empl], (err, results) => {
                  if (err) throw err;
                  startApp();
              })
      })
  })
}

// view all the available roles that can be in said company
const viewRoles = () => {
  let query = `SELECT title AS "Title" FROM roles`;
  connection.query(query, (err, results) => {
      if (err) throw err;

      console.log(' ');
      console.table(chalk.bold.yellow('All Roles'), results);
      startApp();
  })

}

// add a new role to the company
const addRole = () => {
  const addRoleQuery = `SELECT * FROM roles; SELECT * FROM departments`
  connection.query(addRoleQuery, (err, results) => {
      if (err) throw err;
      console.log('');
      console.table(chalk.bold.yellow('List of current Roles:'), results[0]);
      inquirer.prompt([
          {
              name: 'newTitle',
              type: 'input',
              message: 'Enter the new Title:'
          },
          {
              name: 'newSalary',
              type: 'input',
              message: 'Enter the salary for the new Title:'
          },
          {
              name: 'dept',
              type: 'list',
              choices: function () {
                  let choiceArray = results[1].map(choice => choice.department_name);
                  return choiceArray;
              },
              message: 'Select the Department for this new Title:'
          }
      ]).then((answer) => {
          connection.query(
              `INSERT INTO roles(title, salary, department_id) 
              VALUES
              ("${answer.newTitle}", "${answer.newSalary}", 
              (SELECT id FROM departments WHERE department_name = "${answer.dept}"));`
          )
          startApp();
      })
  })
}

// delete a role from the entire company Elon Musk anybody? 
removeRole = () => {
  query = `SELECT * FROM roles`;
  connection.query(query, (err, results) => {
      if (err) throw err;
      inquirer.prompt([
          {
              name: 'removeRole',
              type: 'list',
              choices: function () {
                  let choiceArray = results.map(choice => choice.title);
                  return choiceArray;
              },
              message: 'Select a Role to remove:'
          }
      ]).then((answer) => {
          connection.query(`DELETE FROM roles WHERE ? `, { title: answer.removeRole });
          startApp();
      })
  })
}

// view the available departments in the company as a whole
const viewDept = () => {
  query = `SELECT department_name AS "Departments" FROM departments`;
  connection.query(query, (err, results) => {
      if (err) throw err;
      console.log('');
      console.table(chalk.bold.yellow('All Departments'), results)
      startApp();
  })
}

// add a new department to the company as a whole
const addDept = () => {
  query = `SELECT department_name AS "Departments" FROM departments`;
  connection.query(query, (err, results) => {
      if (err) throw err;
      console.log('');
      console.table(chalk.bold.yellow('List of current Departments'), results);
      inquirer.prompt([
          {
              name: 'newDept',
              type: 'input',
              message: 'Enter the name of the Department to add:'
          }
      ]).then((answer) => {
          connection.query(`INSERT INTO departments(department_name) VALUES( ? )`, answer.newDept)
          startApp();
      })
  })
}

// delete an entire department from the company RIP twitter
const removeDept = () => {
  query = `SELECT * FROM departments`;
  connection.query(query, (err, results) => {
      if (err) throw err;
      inquirer.prompt([
          {
              name: 'dept',
              type: 'list',
              choices: function () {
                  let choiceArray = results.map(choice => choice.department_name);
                  return choiceArray;
              },
              message: 'Select the department to remove:'
          }
      ]).then((answer) => {
          connection.query(`DELETE FROM departments WHERE ? `, { department_name: answer.dept })
          startApp();
      })
  })
}

startApp();