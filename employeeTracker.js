const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require('util');

let employeeProfile;

var connection = mysql.createConnection({

    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'CJTaiden',
    database: 'employees_db'
});

// gives you an id for each connection made can initialize q's
connection.connect(err => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    toDo();
});

// Kickoff questions
function toDo() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do today?',
            name: 'toDo',
            choices: [
                'View all employees',
                'Veiw all employees by department',
                'View all employees by manager',
                'Add a new employee',
                'Add a new Role',
                'Add a new Department',
                'Remove an employee',
                'Update an employee',
                'Exit'
            ]
        }
    ]).then(answer => {
        switch (answer.toDo) {
            case 'View all employees':
                viewAll();
                break;
            case 'Veiw all employees by department':
                byDepartment();
                break;
            case 'Add a new employee':
                addEmployee();
                break;
            case 'Add a new Role':
                rolesTable();
                break;
            case 'Add a new Department':
                viewDepartments();
                break;
            case 'Remove an employee':
                removeEmployee();
                break;
            // case 'Update an employee':
            //     // Edit an employee
            //     updateEmployee();
            //     break;
            case 'Exit':
                console.log('Youre up to date!');
                connection.end();
                break;


        }
    })
}

function viewAll() {
    console.log("Selecting all employees...\n");
    connection.query("SELECT employee.first_name 'First Name', employee.last_name 'Last Name', role.title 'Title', role.salary 'Salary' FROM employee LEFT JOIN role ON employee.role_id = role.id", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        askAgain();
    });
};


function byDepartment() {
    connection.query('SELECT name FROM department', function (err, results) {
        if (err) throw err;
        else {
            console.log(results);
            inquirer
                .prompt([
                    {
                        type: 'rawlist',
                        message: 'What department would you like to see?',
                        name: 'department',
                        choices: results
                    }
                ]).then(answer => {
                    connection.query(`SELECT department.name, role.title, employee.first_name, employee.last_name
                    FROM department, role, employee
                    WHERE employee.role_id = role.id AND role.department_id = department.id AND department.name = ?`, [answer.department], function (err, results) {
                        if (err) throw err;
                        console.table(results);
                        askAgain();
                    })

                })
        }
    });



}

// function updateEmployee() {
//     connection.query(
//         'SELECT department.name "Department", role.title, employee.first_name, employee.last_name, employee.id FROM department, role, employee WHERE employee.role_id = role.id AND role.department_id = department.id',
//         function (err, results) {
//             employeeProfile = results;
//             if (err) throw err;
//             let employeeList = results.map(employee => {
//                 return `${employee.id} ${employee.first_name} ${employee.last_name}`
//             })
//             // console.log(employeeList);
//             inquirer
//                 .prompt([
//                     {
//                         type: "list",
//                         message: 'Which employee would you like to update?',
//                         name: "employee",
//                         choices: employeeList
//                     }
//                 ]).then(answer => {
//                     console.log(answer);
//                     let employeeInfo = answer.employee.split(" ");
//                     let allInfo = employeeProfile.filter(data => {
//                         return data.id === parseInt(employeeInfo[0]);
//                     })
//                     console.table(allInfo);
//                     inquirer
//                         .prompt([
//                             {
//                                 type: 'confirm',
//                                 message: 'Would you like to update this employees role?',
//                                 name: 'update',
//                             }
//                         ]).then(answer => {
//                             if (answer.update === false) {
//                                 askAgain();
//                             } else {

//                             }
//                         })
//                 })
//         }
//     )
// };

// addDepartment(){

// };

function rolesTable() {
    connection.query('SELECT role.title AS "Role Title", role.salary AS "Salary", role.department_id AS "Department ID", department.name AS "Department Title" FROM role LEFT JOIN department ON role.department_id = department.id', function (err, results) {
        if (err) throw err;

        console.log('\n Here are all current Roles by Department. \n');
        console.table(results);
        addRole();
    });
};
function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the title of the new Role?',
                name: 'roleTitle'
            },
            {
                type: 'input',
                message: 'What is the salary for this role?',
                name: 'roleSalary'
            },
            {
                type: 'input',
                message: 'Enter the ID of the department this role will fall under',
                name: 'departmentId'
            }
        ]).then(answers => {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answers.roleTitle,
                    salary: answers.roleSalary,
                    department_id: answers.departmentId
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + ' role inserted! \n')
                    askAgain();
                });
        })
};
function viewDepartments() {
    connection.query('SELECT name AS "Department Title" FROM department', function (err, results) {
        if (err) throw err;

        console.log('\n Here are all current Departments. \n');
        console.table(results);
        addDepartment();
    });
};

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'inout',
                message: 'What is the Title of the new department?',
                name: 'newDep'
            }
        ]).then(answer => {
            connection.query(
                'INSERT INTO department SET ?',
                {
                    name: answer.newDep
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + ' department inserted! \n')
                    askAgain();
                });
        })
};

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the new employees first name?',
                name: "firstName"
            },
            {
                type: 'input',
                message: 'What is the new employees last name?',
                name: "lastName"
            },
            {
                type: 'input',
                message: 'What is the new employees role Id?',
                name: "roleId"
            },
            {
                type: 'input',
                message: 'What is the new employees managers Id?',
                name: "managersId"
            }
        ]).then(answers => {
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answers.firstName,
                    last_name: answers.lastName,
                    role_id: answers.roleId,
                    manager_id: answers.managersId
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + ' employee inserted! \n')
                    askAgain();
                })
        })
};

function removeEmployee() {
    connection.query(
        'SELECT first_name, last_name FROM employee', function (err, results) {
            console.log(results);
            inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'Which employee would you like to remove from the database?',
                        name: 'remove',
                        choices: results.map(result => result.first_name + " " + results.last_name)
                    }
                ]).then(answer => {
                    console.log('Deleting employee' + answer + "\n");
                    connection.query(
                        'DELETE FROM employee WHERE ?',
                        {
                            first_name: answer.remove
                        },
                        function (err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + " has been deleted! \n ");
                            askAgain();
                        }
                    )
                })
        });
}

function askAgain() {
    inquirer.prompt([
        {
            type: 'confirm',
            message: 'Is there anything else you would like to do today?',
            name: 'moreChanges'
        }
    ]).then(answer => {
        if (answer.moreChanges === true) {
            toDo();
        } else {
            console.log('Youre up to date!');
            connection.end();
        }
    });
};























// function byManager() {
//     console.log("Selecting all employees by manager...\n");
//     connection.query("SELECT * FROM employee WHERE manager = ?", function (err, res) {
//         if (err) throw err;
//         // Log all results of the SELECT statement
//         console.table(res);
//         //   connection.end();
//     }).then(answer => {
//         inquirer.prompt([
//             {
//                 type: 'confirm',
//                 message: 'Would you like to make anymore changes?',
//                 name: 'moreChanges'
//             }
//         ]).then(answer => {
//             if (answer.moreChanges === true) {
//                 toDo();
//             } else {
//                 console.log('Youre up to date!');
//                 connection.end();
//             }
//         })
//     })
// };