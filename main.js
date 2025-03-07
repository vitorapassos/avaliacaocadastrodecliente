/**
 * Main JS cadastro de cliente com Electron
 * @Author Vitor de Assis
 */

const { pipeline } = require("responselike")

console.log("Executando processo principal")

const { app, BrowserWindow, nativeTheme, Menu, shell } = require('electron/main')

let win

const createWindow = () => {
    nativeTheme.themeSource = 'dark'
    win = new BrowserWindow({
        width: 1010,
        height: 720
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
}

function aboutWindow(){
    nativeTheme.themeSource = 'light'

    const mainWindow = BrowserWindow.getFocusedWindow()


    if(mainWindow){
        about = new BrowserWindow({
            width: 320,
            height: 300,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: mainWindow,
            modal: true
        })
    }

    about.loadFile('./src/views/sobre.html')
}

// Inicialização
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
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
                label: 'Cadastrar'
            },
            {
                label: 'Sair',
                accelerator: 'Alt+F4',
                click: () => app.quit()
            }
        ]
    },
    {
        label: 'Relatório',
        submenu: [
            {
                label: 'Clientes'
            }

        ]
    },
    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Aplicar Zoom',
                role: 'ZoomIn'
            },
            {
                label: 'Reduzir Zoom',
                role: 'ZoomOut'
            },
            {
                label: 'Restaurar Zoom',
                role: 'resetZoom'
            },
            {
                type: 'separator'
            },
            {
                label: 'DevTools',
                role: 'ToggleDevTools'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositório',
                click: () => shell.openExternal('https://github.com/vitorapassos/avaliacaocadastrodecliente.git')
            },
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]


console.log("Executado com sucesso")