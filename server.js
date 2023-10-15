// adding in the required packages
// const express = require('express');
const mysql = require ('mysql2');
const inquirer = require ('inquirer');

const MainMenu = require('./lib/main_menu.js')

const PORT = process.env.PORT || 3001;

// const app = express();

// app.use(express.urlencoded({ extended: false}))
// app.use(express.json());

// using mysql to connect to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Megamono@1',
        database: 'employee_db'
    },
    console.log ('Connected to the employee_db database')
);

// doing a query to the database
// db.query('SELECT * FROM department', function (err, results) {
//     console.log(results);
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
    
async function main() {
    const menu = new MainMenu();
    const userSelect = await menu.run();

    userSelect

//     switch (userChoice.Menu){
//         case 'View All Departments':
//             console.log('List of departments')
//             break;
//         case 'Add Department':
//             console.log('Adding a Department')
//             break;
//         case 'View All Employees':
//             console.log('Here are the employees')
//             break;
//         case 'Add Empoyee':
//             console.log('Please add an employee')
//             break;
//         case 'Update Employee Role':
//             console.log('update role')
//             break;
//         case 'View All Roles':
//             console.log('Here are the roles')
//             break;
//         case 'Add Role':
//             console.log('Please add a role')
//             break;
//         case 'Quit':
//             console.log('Goodbye!');
//             process.exit(0);
//             break;
//         default:
//             console.log('Invalid choice')
//     }

}

main()