const MainMenu = require('./lib/main_menu.js')

async function menu() {
    const mainMenu = new MainMenu();

    const userSelect = await mainMenu.run();

    userSelect
}

menu()