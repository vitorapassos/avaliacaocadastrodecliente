/**
 * Modelo de dados dos Clientes
 * Criação da coleção (MongoDB)
 */

const { model, Schema } = require('mongoose')

const clientesSchema = new Schema({
    nome: {
        type: String
    },
    rg: {
        type: String
    },
    cpf: {
        type: String,
        unique
    },
    sexo: {
        type: String
    },
    dataNascimento: {
        type: Date
    },
    telefone: {
        type: String
    },
    celular: {
        type: String
    },
    email: {
        type: String
    },
    senha: {
        type: String
    },
    cep: {
        type: String
    },
    endereco: {
        type: String
    },
    numero: {
        type: String
    },
    complemento: {
        type: String
    },
    bairro: {
        type: String
    },
    cidade: {
        type: String
    },
    estado: {
        type: String
    }


}, { versionKey: false })


module.exports = model ('Clientes', clientesSchema)