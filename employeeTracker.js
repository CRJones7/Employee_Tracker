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
                'Remove and employee',
                'Update an employee',
            ]
        }
    ]).then(answer => {
        switch (answer.toDo) {
            case 'View all employees':
                // function to show all employees
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
            // case 'Add a new employee':
            //     // add employee function
            //     addEmployee();
            //     break;
            // case 'Remove and employee':
            //     // remove employee
            //     removeEmployee();
            //     break;
            // case 'Update an employee':
            //     // Edit an employee
            //     editEmployee();
            //     break;

        }
    })
}

function viewAll() {
    console.log("Selecting all employees...\n");
    connection.query("SELECT employee.first_name 'First Name', employee.last_name 'Last Name', role.title 'Title', role.salary 'Salary' FROM employee LEFT JOIN role ON employee.role_id = role.title", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);


        inquirer.prompt([
            {
                type: 'confirm',
                message: 'Would you like to make anymore changes?',
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
    });
};



function byDepartment() {
    connection.query('SELECT name FROM department', function (err, results) {
        if (err) throw err;
        else {
            inquirer.prompt([
                {
                    type: 'list',
                    message: 'What department would you like to see?',
                    name: 'department',
                    // choices: results.map(result => result.name)
                    choices: results
                }
            ])
        }
    });
         // filter employee table by which department is selected
        // Employees have a role id 
       // if the user selects Sales I want to show all employees who work in the sales department
    connection.query('SELECT name FROM department', function (err, results){

    });

                
              
               
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

// function addEmployee() {

// };

// function removeEmployee() {

// }




// run this when ending things!!
// function anyMore(){
//     inquirer.prompt([
//         {
//             type: 'confirm',
//             message: 'Would you like to make anymore changes?',
//             name: 'moreChanges'
//         }
//     ]).then(answer => {
//         if (answer.moreChanges === true) {
//             toDo();
//         } else {
//             console.log('Youre up to date!');
//             connection.end();
//         }
//     });
// };