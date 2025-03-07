/**
 * Main JS cadastro de cliente com Electron
 * @Author Vitor de Assis
 */

const { pipeline } = require("responselike")

console.log("Executando processo principal")

const { app, BrowserWindow, nativeTheme, Menu, Shell} = require('electron/main')

let win

const createWindow = () => {
    nativeTheme.themeSource = 'light'
    win = new BrowserWindow({
        width: 1010,
        height: 720
    })

    win.loadFile('./src/views/index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow()
        }
    })
})

app.on('window-all-closed', () =>{
    if (process.platform !== 'darwin') {
        app.quit
    }
})

app.commandLine.appendSwitch('log-level', '3')

// Menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: Sair
            }
        ]
    }
]


console.log("Executado com sucesso")