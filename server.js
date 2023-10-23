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

const employeeQuestions = [
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
      type: 'input',
      name: 'Role',
      message: 'What is their role: ',
    },
    {
      type: 'input',
      name: 'Manager',
      message: 'Who is their manager (NULL if none): ',
    },
  ];
  
  // function to prompt for user data
  class AddEmployeePrompt {
    async run(questions) {

        db.query('SELECT title FROM department', function (err, results) {
            if (err) {
                console.error('Error: ', err);
            } else {
                console.table(results, tableConfig);
            }
        });
        
      const answers = await inquirer.prompt(questions);
      console.log('Employee Details:');
      console.log('First Name:', answers.firstName);
      console.log('Last Name:', answers.lastName);
      console.log('Role:', answers.Role);
      console.log('Manager:', answers.Manager);
      start();
    }
  }
  
  // function for adding an employee
  async function addEmployee() {
    const userInput = new AddEmployeePrompt();
    userInput.run(employeeQuestions);
  }

start();

// listOfRoles = db.query('SELECT title FROM role', function (err, results) {
    //     if (err) {
    //         console.error('Error: ', err);
    //         return;
    //     }
    
    //     const roleTitles = results.map(role => role.title);
    //     console.log(roleTitles);
    
    //     // You can use roleTitles or return it for further use
    // });
