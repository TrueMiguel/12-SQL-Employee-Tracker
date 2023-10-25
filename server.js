// Import and require mysql2
const mysql = require('mysql2');

const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'Megamono@1',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );

//   having prompt for user data
class UserInput {
    async run() {
        const { options } = await inquirer.prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do: ',
                choices: [
                    'View All Employees', 
                    'Add Employee', 
                    'View All Roles',
                    'Update Employee Role', 
                    'Add Role', 
                    'View All Departments', 
                    'Add Department',
                    'Quit'
                ],
                loop: false
            } 
        ]);

        return options;
        
    }
}

// calling the userInput prompt
const userInput = new UserInput()

// function that will take the user input and then run specific proccesses depending on the selected option.
async function handleUserInput() {
    const selectedOption = await userInput.run();

    if (selectedOption === 'Quit') {
        console.log ('Goodbye!');
        process.exit(0);
    } else if (selectedOption === 'View All Employees') {
        viewAllEmployees();
    } else if (selectedOption === 'Add Employee') {
        addEmployee();
    } else if (selectedOption === 'View All Roles') {
        viewAllRoles();
    } else if (selectedOption === 'View All Departments') {
        viewAllDepartments();
    } else if (selectedOption === 'Update Employee Role') {
        updateEmployeeRole();
    } else if (selectedOption === 'Add Role') {
        newRole();
    } else {
        console.log (`You selected: ${selectedOption}`)
        handleUserInput();
    }
}

// function that starts the entire process
function start() {
    handleUserInput();
}

// functions to be called inside of the handleUserInput() function
async function viewAllEmployees() {
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) {
            console.error('Error: ', err);
        } else {
            const tableData = results.map(({ index, ...rest }) => rest);
            console.table(tableData);
        }
    start();
    });
}

async function viewAllRoles() {
    db.query('SELECT * FROM role', function (err, results) {
        if (err) {
            console.error('Error: ', err);
        } else {
            const tableConfig = {
                columns: { index: { display: false } }
            };
            console.table(results, tableConfig);
        }
    start();
    });
}

async function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) {
            console.error('Error: ', err);
        } else {
            const tableConfig = {
                columns: { index: { display: false } }
            };
            console.table(results, tableConfig);
        }
    start();
    });
}

const addEmployeeQuestions = [
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the first name: ',
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the last name: ',
    },
    {
      type: 'list',
      name: 'Role',
      message: 'What is their role: ',
      choices: [],
      loop: false
    },
    {
      type: 'list',
      name: 'Manager',
      message: 'Who is their manager: ',
      choices: [],
      loop: false
    },
  ];

// function to fetch the list of roles
function fetchRoles(callback) {
    db.query('SELECT title FROM role', function(err, results) {
        if (err) {
            console.error("Error: ", err);
        } else {
            const roleTitles = results.map(role => role.title);
            callback(null, roleTitles)
        }
    });
}

// function to fetch the list of Managers
function fetchManagers(callback) {
    db.query('SELECT first_name, last_name FROM employee', function(err, results) {
        if (err) {
            console.error("Error: ", err);
        } else {
            const managerNames = results.map(manager => `${manager.first_name} ${manager.last_name}`);
            callback(null, managerNames);
        }
    });
}

// function to prompt for user data
class AddEmployeePrompt {

    async run(questions) {
        
        // getting the list of roles on a await
        const roles = await new Promise((resolve, reject) => {
            fetchRoles((err, roleTitles) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(roleTitles);
                }
            });
        });

        //updating the role question with the current role titles
        questions[2].choices = roles;

        //getting the list of managers and including null
        const managers = await new Promise ((resolve, reject) => {
            fetchManagers((err, allManagers) => {
                if (err) {
                    reject(err);
                } else {
                    allManagers.push('NULL');
                    resolve(allManagers)
                }
            });
        });

        // updating the manager questions with the current list of managers
        questions[3].choices = managers;

        const answers = await inquirer.prompt(questions);
        
        // function to insert the new employe information into the employee table
        async function insertEmployee() {

        let role_id = undefined;
        let manager_id = undefined;
        const manager_name = answers.Manager.split(' ');

        //making a new Promise to force trigger the update to the er_id
        const er_id = await new Promise((resolve, reject) => {
            db.query(`SELECT id FROM role WHERE title = "${answers.Role}"`, (err, results) => {
                if (err) {
                reject(err);
                } else {
                resolve(results);
                }
            });
            });
            
        //making a new Promise to force trigger the update to the em_id
        const em_id = await new Promise((resolve, reject) => {
            db.query(`SELECT id FROM employee WHERE first_name = "${manager_name[0]}" AND last_name = "${manager_name[1]}"`, (err, results) => {
                if (err) {
                reject(err);
                } else {
                resolve(results);
                }
            });
            });
            
        //updating the role_id from the er_id
        if (er_id.length > 0) {
        role_id = er_id[0].id;
        }
        
        //updating the manager_id from the em_id
        if (em_id.length > 0) {
        manager_id = em_id[0].id;
        }
        
        // the query to INSERT the gathered information into the employee table
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.firstName}", "${answers.lastName}", ${role_id}, ${manager_id}
        )`)

        // displaying the table
        db.query('SELECT * FROM employee', function (err, results) {
            if (err) {
                console.error('Error: ', err);
            } else {
                console.table(results)
                start();
            }
        })
    }

    await insertEmployee()

    }
  }
  
// function for adding an employee
async function addEmployee() {
const userInput = new AddEmployeePrompt();
userInput.run(addEmployeeQuestions);
}

// questions to ask for which employee and role to update
const employeeRoleQuestions = [
    {
      type: 'list',
      name: 'employee',
      message: 'Which employee to update: ',
      choices: [],
      loop: false
    },
    {
      type: 'list',
      name: 'role',
      message: 'Which role to update: ',
      choices: [],
      loop: false
    },
  ];

// class to run the employee role update questions and then to update the table
class UpdateEmployeeRole {

    async run(questions) {

        //getting the list of managers and including null
        const managers = await new Promise ((resolve, reject) => {
            fetchManagers((err, allManagers) => {
                if (err) {
                    reject(err);
                } else {
                    allManagers.push('NULL');
                    resolve(allManagers)
                }
            });
        });

        // updating the manager questions with the current list of managers
        questions[0].choices = managers;

        // getting the list of roles on a await
        const roles = await new Promise((resolve, reject) => {
            fetchRoles((err, roleTitles) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(roleTitles);
                }
            });
        });

        //updating the role question with the current role titles
        questions[1].choices = roles;

        const answers = await inquirer.prompt(questions);

        async function updateRole() {
            
            let role_id = undefined;
            const employee_name = answers.employee.split(' ')

            //making a new Promise to force trigger the update to the er_id
            const er_id = await new Promise((resolve, reject) => {
            db.query(`SELECT id FROM role WHERE title = "${answers.role}"`, (err, results) => {
                if (err) {
                reject(err);
                } else {
                resolve(results);
                }
            });
            });

            //updating the role_id from the er_id
            if (er_id.length > 0) {
            role_id = er_id[0].id;
            }

            db.query(`UPDATE employee SET role_id = ${role_id} WHERE first_name = "${employee_name[0]}" AND last_name = "${employee_name[1]}"`)

            // displaying the table
            db.query(`SELECT * FROM employee WHERE first_name = "${employee_name[0]}" AND last_name = "${employee_name[1]}"`, function (err, results) {
                if (err) {
                    console.error('Error: ', err);
                } else {
                    console.table(results)
                    start();
                }
            })


        }
        await updateRole()
    }
}

// function for updating employee role
async function updateEmployeeRole() {
    const userInput = new UpdateEmployeeRole();
    userInput.run(employeeRoleQuestions)
}

// questions to ask for adding a new role
const newRoleQuestions = [
    {
      type: 'input',
      name: 'title',
      message: 'What is the name of the title: ',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary: ',
    },
    {
      type: 'list',
      name: 'department',
      message: 'Which department for this role: ',
      choices: [],
      loop: false
    },
  ];

// function to get the list of departments
function fetchDepartments(callback) {
    db.query('SELECT name FROM department', function(err, results) {
        if (err) {
            console.error("Error: ", err);
        } else {
            const depName = results.map(department => department.name);
            callback(null, depName)
        }
    });
}

// class to run the new role questions and to update the table
class NewRole {

    async run(questions) {

        //getting the list of departments
        const departments = await new Promise ((resolve, reject) => {
            fetchDepartments((err, allDepartments) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(allDepartments)
                }
            });
        });

        // updating the manager questions with the current list of managers
        questions[2].choices = departments;

        const answers = await inquirer.prompt(questions);

        console.log(answers.title)
        console.log(answers.salary)
        console.log(answers.department)

        async function addRole() {

            let department_id = undefined;

            // making a Promise to get the department id
            const d_id = await new Promise((resolve, reject) => {
                db.query(`SELECT id FROM department WHERE name = "${answers.department}"`, (err, results) => {
                    if (err) {
                    reject(err);
                    } else {
                    resolve(results);
                    }
                    });
                });

            //updating the department_id from the d_id
            if (d_id.length > 0) {
            department_id = d_id[0].id;
            }

            // the query to INSERT the gathered information into the employee table
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answers.title}", "${answers.salary}", ${department_id})`)

            // displaying the table
            db.query('SELECT * FROM role', function (err, results) {
                if (err) {
                    console.error('Error: ', err);
                } else {
                    console.table(results)
                    start();
                }
            })

        }

        await addRole()
    }

}

// function for adding a new role
async function newRole() {
    const userInput = new NewRole();
    userInput.run(newRoleQuestions)
}

start();

