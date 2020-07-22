const mysql = require("mysql");
const inquirer = require("inquirer");
const boxen = require('boxen');

let employeeProfile;

var connection = mysql.createConnection({

    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'CJTaiden',
    database: 'employees_db'
});


connection.connect(err => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    starter();
});

function starter() {
    console.log(boxen('Employee Tracker', { padding: 1, margin: 1, borderStyle: 'double' }));
    toDo();
}

function toDo() {

    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do today?',
            name: 'toDo',
            choices: [
                'View all employees',
                'Veiw all employees by department',
                'Add a new employee',
                'Add a new Role',
                'Add a new Department',
                'Remove an employee',
                'Update an employees Role',
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
            case 'Update an employees Role':
                updateEmployee();
                break;
            case 'Exit':
                console.log('Youre up to date!');
                connection.end();
                break;


        }
    })
};

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

function updateEmployee() {
    connection.query(
        'SELECT * FROM employee',
        function (err, results) {
            employeeProfile = results;
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: 'Which employee would you like to update?',
                        name: "employee",
                        choices: results.map(result => result.first_name + " " + result.last_name + " " + result.role_id)
                    }
                ]).then(answer => {
                    let employeeInfo = answer.employee.split(" ");
                    connection.query("SELECT * FROM role", function (err, res) {
                        if (err) throw err;
                        inquirer
                            .prompt([
                                {
                                    type: 'list',
                                    message: 'What role would you like to select for this employee?',
                                    name: 'updatedRole',
                                    choices: res.map(res => res.id + ' ' + res.title)
                                }
                            ]).then(newRole => {
                                let roleId = newRole.updatedRole.split(' ')[0];
                                connection.query('UPDATE employee SET role_id = ? WHERE id = ?',
                                    [roleId, employeeInfo[2]], (err, res) => {
                                        if (err) throw err;
                                        console.log("Role has been updated! \n ");
                                        askAgain();
                                    });
                            });
                    });
                });
        });
};

function rolesTable() {
    connection.query('SELECT name AS "Department Title", id AS "Department ID" FROM department', function (err, results) {
        if (err) throw err;

        console.log('\n MESSAGE: Here are all current Departments and their IDs to be assigned to your new role. \n');
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
        'SELECT * FROM employee', function (err, results) {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'Which employee would you like to remove from the database?',
                        name: 'remove',
                        choices: results.map(result => result.id + " " + result.first_name + " " + result.last_name)
                    }
                ]).then(answer => {
                    let selection = answer.remove.split(' ')[0];

                    connection.query(
                        'DELETE FROM employee WHERE id = ?',
                        [selection[0]],
                        function (err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + " employee has been removed! \n ");
                            askAgain();
                        }
                    )
                })
        });
}


