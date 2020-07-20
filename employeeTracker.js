const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require('util');


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
                'Remove an employee',
                'Update an employee',
            ]
        }
    ]).then(answer => {
        switch (answer.toDo) {
            case 'View all employees':
                viewAll();
                break;
            case 'Veiw all employees by department':
                // function to show all filtered by department
                byDepartment();
                break;
            // case 'View all employees by manager':
            //     // filtered by manager
            //     byManager();
            //     break;
            case 'Add a new employee':
                addEmployee();
                break;
            case 'Remove an employee':
                removeEmployee();
                break;
            // case 'Update an employee':
            //     // Edit an employee
            //     editEmployee();
            //     break;

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
            inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'What department would you like to see?',
                    name: 'department',
                    // choices: results.map(result => result.name)
                    choices: results
                }
            ]).then(answer => {
                connection.query(
    //    SELECT department.name, employee.first_name, employee.last_name, FROM department 

                    ''
                )
            })
        }
    });
        // filter employee table by which department is selected
        // Employees have a role id 
        // if the user selects Sales I want to show all employees who work in the sales department


}


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

// function editEmployee(){

// }

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
                    console.log(res.affectedRows + 'employee inserted! \n')
                    askAgain();
                }
            )
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