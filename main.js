/**
 * Main JS cadastro de cliente com Electron
 * @Author Vitor de Assis
 */

//const { pipeline } = require('responselike')

console.log("Executando processo principal")

const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main')

// Ativação do preload.js (importação do path)
const path = require('node:path')

//  Importação dos métodos conectar e desconectar (módulo de conexão)
const { conectar, desconectar } = require('./database.js')


// Criando a janela principal
let win

const createWindow = () => {
    nativeTheme.themeSource = 'dark'
    win = new BrowserWindow({
        width: 1010,
        height: 720,

        // Preload
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
}


// Janela Sobre
let about
function aboutWindow() {
    nativeTheme.themeSource = 'light'

    const mainWindow = BrowserWindow.getFocusedWindow()


    if (mainWindow) {
        about = new BrowserWindow({
            width: 500,
            height: 260,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: mainWindow,
            modal: true,
            // Preload
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }

    about.loadFile('./src/views/sobre.html')
}

// Janela Cadastro de Cliente
let cadastroCliente
function cadastroWindow() {

    const mainWindow = BrowserWindow.getFocusedWindow()

    if (mainWindow) {
        cadastroCliente = new BrowserWindow({
            width: 1010,
            height: 720,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: mainWindow,
            modal: true
        })
    }
    cadastroCliente.loadFile('./src/views/cadastroCliente.html')
}

// Inicialização
app.whenReady().then(() => {
    createWindow()

    // Melhor local para estabelecer a conexão com o banco de dados
    // No MongoDB é mais eficiente manter uma única conexão aberta durante todo o tempo de vida do aplicativo e encerrar a conexão quando o aplicativo for finalizado
    // ipcMain.on (receber mensagem)
    // db-connect (rótulo da mensagem)
    ipcMain.on('db-connect', async (event) => {
        // a linha abaixo estabelece a conexão com o banco de dados
        await conectar()
        // enviar ao renderizador uma mensagem para trocar a imagem do icone do status do banco de dados (criar um delay de 0.5 ou 1s para sincronização com a nuvem)
        setTimeout(() => {
            // Enviar ao renderizador a mensagem "conectado"
            // db-status (IPC - Comunicaçao entre processos - preload.js)
            event.reply('db-status', "conectado")
        }, 500); // 500ms = 0.5s

    })

    // Só ativar a janela principal se nenuhma outra estiver ativa
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Encerrar a aplicação quando a janela for fechada
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit
    }
})

// Desconectar do banco de dados quando a aplicação for finalizada
app.on('before-quit', async () => {
    await desconectar()
})

// Reduzir a verbozidade de logs não críticos (devtools)
app.commandLine.appendSwitch('log-level', '3')

// Menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Cadastrar',
                click: () => cadastroWindow()
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
                label: 'Recarregar',
                role: 'reload'
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