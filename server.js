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

class UserInput {
    async run() {
        const { options } = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do: ',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'Add Role', 'View All Departments', 'Add Department'],
                loop: false
            }
        ]);

        console.log(options)
        
    }
}