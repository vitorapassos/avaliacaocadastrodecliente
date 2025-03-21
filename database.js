/**
 * Módulo de conexão com o banco de dados
 * Uso do framework mongoose
 */


// Importação do mongoose
// Não esquecer de instalar o módulo (npm i mongoose)
const mongoose = require('mongoose')

// Configuração do banco de dados
// ip/link do servidor, autenticação
// ao final da url difinir o nome do banco de dados
// exemplo: /dbnotes
const url = 'mongodb+srv://admin:123Senac@cluster0.fnijm.mongodb.net/dbclientes'

// Validação (evitar a abertura de várias conexões)
let conectado = false

// método para conectar com o banco de dados
const conectar = async () => {
    // se não estiver conectado
    if (!conectado) {
        //conectar com o banco de dados
        try {
            await mongoose.connect(url) //conectar
            conectado = true //setar a variável
            console.log("MongoDB conectado")
        } catch (error) {
            //tratamento de exceções especificas
            console.log(error)
        }
    }
}

// método para desconectar do banco de dados
const desconectar = async () => {
    // se estiver conectado
    if (conectado) {
        // desconectar
        try {
            await mongoose.disconnect(url) //desconectar
            conectado = false //setar a variável
            console.log("MongoDB desconectado")
        } catch (error) {
            console.log(error)
        }
    }
}

//exportar para o main os métodos conectar e desconectar
module.exports = { conectar, desconectar }