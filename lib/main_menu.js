const inquirer = require('inquirer');


class MainMenu {
    async run() {
        const input = await inquirer
            .prompt ([
                {
                    type: 'list',
                    name: 'menu',
                    message: 'What would you like to do?',
                    choices: ['View All Departments', 
                        'Add Department', 
                        'View All Employees', 
                        'Add Employee', 
                        'Update Employee Role', 
                        'View All Roles', 
                        'Add Role', 
                        'Quit',
                    ],
                    loop: false
                },
            ]);

        return input
    }
}

module.exports = MainMenu