/**
 * Main JS cadastro de cliente com Electron
 * @Author Vitor de Assis
 */

//const { pipeline } = require('responselike')

console.log("Executando processo principal");

// dialog: modulo electron para ativar a caixa de mensagens
// shell: acessar links e aplicações externas
const {
  app,
  BrowserWindow,
  nativeTheme,
  Menu,
  shell,
  ipcMain,
  dialog,
} = require("electron/main");

// Ativação do preload.js (importação do path)
const path = require("node:path");

//  Importação dos métodos conectar e desconectar (módulo de conexão)
const { conectar, desconectar } = require("./database.js");

// Model Cliente
const clienteModel = require("./src/models/Clientes.js");

// Importação da biblioteca nativa do JS para manipular arquivos
const fs = require("fs");

// Importação do pacote JSPDF (arquivos PDF) npm install jspdf
const { jspdf, default: jsPDF } = require("jspdf");

// Criando a janela principal
let win;

const createWindow = () => {
  nativeTheme.themeSource = "dark";
  win = new BrowserWindow({
    width: 1010,
    height: 720,

    // Preload
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  win.loadFile("./src/views/index.html");
};

// Janela Sobre
let about;
function aboutWindow() {
  nativeTheme.themeSource = "light";

  const mainWindow = BrowserWindow.getFocusedWindow();

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
        preload: path.join(__dirname, "preload.js"),
      },
    });
  }

  about.loadFile("./src/views/sobre.html");
}

// Janela Cadastro de Cliente
let cadastroCliente;
function cadastroWindow() {
  const mainWindow = BrowserWindow.getFocusedWindow();

  if (mainWindow) {
    cadastroCliente = new BrowserWindow({
      width: 1010,
      height: 720,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      parent: mainWindow,
      modal: true,
      // Preload
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
  }
  cadastroCliente.loadFile("./src/views/cadastroCliente.html");
}

// Inicialização
app.whenReady().then(() => {
  createWindow();

  // Melhor local para estabelecer a conexão com o banco de dados
  // No MongoDB é mais eficiente manter uma única conexão aberta durante todo o tempo de vida do aplicativo e encerrar a conexão quando o aplicativo for finalizado
  // ipcMain.on (receber mensagem)
  // db-connect (rótulo da mensagem)
  ipcMain.on("db-connect", async (event) => {
    // a linha abaixo estabelece a conexão com o banco de dados
    await conectar();
    // enviar ao renderizador uma mensagem para trocar a imagem do icone do status do banco de dados (criar um delay de 0.5 ou 1s para sincronização com a nuvem)
    setTimeout(() => {
      // Enviar ao renderizador a mensagem "conectado"
      // db-status (IPC - Comunicaçao entre processos - preload.js)
      event.reply("db-status", "conectado");
    }, 500); // 500ms = 0.5s
  });

  // Só ativar a janela principal se nenuhma outra estiver ativa
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Se o sistema não for MAC encerrar a aplicação quando a janela for fechada
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IMPORTANTE!!! Desconectar do banco de dados quando a aplicação for finalizada
app.on("before-quit", async () => {
  await desconectar();
});

// Reduzir a verbozidade de logs não críticos (devtools)
app.commandLine.appendSwitch("log-level", "3");

// Menu
const template = [
  {
    label: "Cadastro",
    submenu: [
      {
        label: "Cadastrar",
        click: () => cadastroWindow(),
      },
      {
        label: "Sair",
        accelerator: "Alt+F4",
        click: () => app.quit(),
      },
    ],
  },
  {
    label: "Relatório",
    submenu: [
      {
        label: "Clientes",
        click: () => relatorioClientes(),
      },
    ],
  },
  {
    label: "Ferramentas",
    submenu: [
      {
        label: "Aplicar Zoom",
        role: "ZoomIn",
      },
      {
        label: "Reduzir Zoom",
        role: "ZoomOut",
      },
      {
        label: "Restaurar Zoom",
        role: "resetZoom",
      },
      {
        type: "separator",
      },
      {
        label: "Recarregar",
        role: "reload",
      },
      {
        label: "DevTools",
        role: "ToggleDevTools",
      },
    ],
  },
  {
    label: "Ajuda",
    submenu: [
      {
        label: "Repositório",
        click: () =>
          shell.openExternal(
            "https://github.com/vitorapassos/avaliacaocadastrodecliente.git"
          ),
      },
      {
        label: "Sobre",
        click: () => aboutWindow(),
      },
    ],
  },
];

// ===============================================
// ================ CRUD CREATE ==================

ipcMain.on("create-cliente", async (event, cliente) => {
  console.log(cliente);

  try {
    const novoCliente = clienteModel({
      nome: cliente.nomeCli,
      rg: cliente.rgCli,
      cpf: cliente.cpfCli,
      sexo: cliente.sexoCli,
      dataNascimento: cliente.dataNascCli,
      telefone: cliente.telefoneCli,
      telefone2: cliente.telefone2Cli,
      email: cliente.emailCli,
      senha: cliente.senhaCli,
      cep: cliente.cepCli,
      endereco: cliente.enderecoCli,
      numero: cliente.numCli,
      complemento: cliente.complementoCli,
      bairro: cliente.bairroCli,
      cidade: cliente.cidadeCli,
      estado: cliente.estadoCli,
    });
    await novoCliente.save();

    // Confirmação de cliente adicionado ao banco (dialog)
    dialog
      .showMessageBox({
        type: "info",
        title: "Aviso",
        message: "Cliente adicionado com sucesso",
        buttons: ["OK"],
      })
      .then((result) => {
        // se o botão OK for pressionado
        if (result.response === 0) {
          // enviar para o renderizador limpar os campos (preload.js)
          event.reply("reset-form");
        }
      });
  } catch (error) {
    if (error.code === 11000) {
      dialog
        .showMessageBox({
          type: "error",
          title: "Atenção!",
          message: "CPF já cadastrado.\nVerifique o número digitado.",
          buttons: ["OK"],
        })
        .then((result) => {
          // Se o botão OK for pressionado
          if (result.response === 0) {
            // Limpar campo CPF, foco e borda em vermelho
            event.reply("cpf-duplicated");
          }
        });
    } else {
      console.log(error);
    }
  }
});

// ============== FIM CRUD CREATE ================
// ===============================================

// ===============================================
// =========== RELATÓRIO DE CLIENTES =============

async function relatorioClientes() {
  try {
    // ===========================================
    //        Confiuração do document PDF
    // ===========================================
    // p (portrait), l (landscape)
    // mm = milimiters
    // a4 = tamanho
    // sempre projetar conforme um documento impresso
    const doc = new jsPDF("p", "mm", "a4");

    // inserir data atual no documento
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    // diminuir texto doc.setFontSize() tamanho da fonte em ponto ( = word) pt
    doc.setFontSize(10);
    // a linha abaixo escreve um texto no documento
    doc.text(`Data: ${dataAtual}`, 170, 15); // (x,y (mm))
    doc.setFontSize(18);
    doc.text("Relatório de clientes", 15, 30);
    doc.setFontSize(12);
    let y = 50; // variável de apoio

    // Cabeçalho da tabela
    doc.text("Nome", 14, y);
    doc.text("Telefone", 85, y);
    doc.text("E-mail", 130, y);
    y += 5;

    //desenhar uma linha
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y); // (10 (inicio)___________200 (fim))
    y += 10;

    // ===============================================
    // Obter a listagem de clientes (ordem alfabética)
    // ===============================================

    const clientes = await clienteModel.find().sort({ nome: 1 });

    //    console.log(clientes)
    // popular o documento pdf com os clientes cadastrados
    clientes.forEach((c) => {
      // criar uma nova pagina se Y > 280mm (A4 = 297mm)
      if (y > 280) {
        doc.addPage();
        y = 20; // margem

        // Cabeçalho
        doc.text("Nome", 14, y);
        doc.text("Telefone", 85, y);
        doc.text("E-mail", 130, y);
        y += 5;
      }
      doc.text(c.nome, 14, y);
      doc.text(c.telefone, 85, y);
      doc.text(c.email, 130, y);
      y += 10;
    });

    // ============================================
    //        Numeração automática de páginas
    // ============================================

    const pages = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pages; i++){
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`Página ${i} de ${pages}`, 105,290, {align: 'center'})
    }

    // ============================================
    // Abrir o arquivo pdf no sistema operacional
    // ============================================

    // Definir o caminho do arquivo temporário e nome do arquivo com extensão .pdf (!!! Importante !!!)
    const tempDir = app.getPath("temp");
    const filePath = path.join(tempDir, "clientes.pdf");
    // salvar temporariamente o arquivo
    doc.save(filePath);
    // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
    shell.openPath(filePath);
  } catch (error) {
    console.log(error);
  }
}

// ========= FIM RELATÓRIO DE CLIENTES ===========
// ===============================================
