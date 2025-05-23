/**
 *  preload.js - Usado no framework electron para aumentar a segurança e o desempenho
 */

// Importação dos recursos do framework electron
// ipcRenderer permite estabelecer uma comunicação entre processos (IPC) mains.js - renderer.js
// contextBridge: permissões de comunicação entre processos usando a api do electron
const { ipcRenderer, contextBridge } = require("electron");

// Enviar uma mensagem para o main.js estabelecer uma conexão com o banco de dados quando iniciar a aplicação
// send (enviar)
// db-connect (rótulo para identificar a mensagem)
ipcRenderer.send("db-connect");

// permissões para estabelecer a comunicação entre processos
contextBridge.exposeInMainWorld("api", {
  dbStatus: (message) => ipcRenderer.on("db-status", message),
  aboutExit: () => ipcRenderer.send("about-exit"),
  createCliente: (cliente) => ipcRenderer.send("create-cliente", cliente),
  clientWindow: () => ipcRenderer.on("cliente-window"),
  resetForm: (args) => ipcRenderer.on("reset-form", args),
  cpfDuplicate: (args) => ipcRenderer.on("cpf-duplicate", args),
  searchName: (cliName) => ipcRenderer.send("search-name", cliName),
  renderClient: (client) => ipcRenderer.on("render-client", client),
  validateSearch: () => ipcRenderer.send("validate-search"),
  setName: (args) => ipcRenderer.on("set-name", args),
  deleteClient: (id) => ipcRenderer.send("delete-client", id),
  updateClient: (client) => ipcRenderer.send("update-client", client),
});
