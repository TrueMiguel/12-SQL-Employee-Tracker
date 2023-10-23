const inquirer = require('inquirer');

class UserInput {
    async run() {
        const { options } = await inquirer
        .prompt([
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

module.exports = UserInput