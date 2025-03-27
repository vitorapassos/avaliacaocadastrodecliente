/**
 * Cadastro de usuários
 * @author Vitor de Assis
 */



// Limpar
function limpar() {
    document.getElementById('inputNome').value = ""
    document.getElementById('InputRG').value = ""
    document.getElementById('inputCPF').value = ""
    document.getElementById('inputSexo').value = ""
    document.getElementById('inputDataNasc').value = ""
    document.getElementById('inputTelefone').value = ""
    document.getElementById('inputTelefone2').value = ""
    document.getElementById('inputEmail').value = ""
    document.getElementById('inputSenha').value = ""
    document.getElementById('inputCep').value = ""
    document.getElementById('InputEndereco').value = ""
    document.getElementById('inputNum').value = ""
    document.getElementById('inputComplemento').value = ""
    document.getElementById('inputBairro').value = ""
    document.getElementById('inputCidade').value = ""
    document.getElementById('inputEstado').value = ""
}



// Capturar foco para primeira caixa de texto
const foco = document.getElementById('inputNome')

document.addEventListener('DOMContentLoaded', () => {
    foco.focus()
})

let frmCli = document.getElementById('frmCli')
let inputNome = document.getElementById('inputNome')
let inputRG = document.getElementById('inputRG')
let inputCPF = document.getElementById('inputCPF')
let inputSexo = document.getElementById('inputSexo')
let inputDataNasc = document.getElementById('inputDataNasc')
let inputTelefone = document.getElementById('inputTelefone')
let inputTelefone2 = document.getElementById('inputTelefone2')
let inputEmail = document.getElementById('inputEmail')
let inputSenha = document.getElementById('inputSenha')
let inputCep = document.getElementById('inputCep')
let inputEndereco = document.getElementById('inputEndereco')
let inputNum = document.getElementById('inputNum')
let inputComplemento = document.getElementById('inputComplemento')
let inputBairro = document.getElementById('inputBairro')
let inputCidade = document.getElementById('inputCidade')
let inputEstado = document.getElementById('inputEstado')

// ======
// ==CC==

frmCli.addEventListener('submit', async (event) => {
    event.preventDefault()

    console.log(inputNome.value,
        inputRG.value,
        inputCPF.value,
        inputSexo.value,
        inputDataNasc.value,
        inputTelefone.value,
        inputTelefone2.value,
        inputEmail.value,
        inputSenha.value,
        inputCep.value,
        inputEndereco.value,
        inputNum.value,
        inputComplemento.value,
        inputBairro.value,
        inputCidade.value,
        inputEstado.value)

        // 
        const cliente = {
            
        }
})

// ==CC==
// ======

// Buscas CEP
function buscarEndereco() {
    let cep = document.getElementById('inputCep').value
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`

    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            document.getElementById('inputEndereco').value = dados.logradouro
            document.getElementById('inputBairro').value = dados.bairro
            document.getElementById('inputCidade').value = dados.localidade
            document.getElementById('inputEstado').value = dados.uf;
        })
        .catch(error => console.error('Erro ao buscar o endereço:', error));
}


// Validar CPF
function validaCPF(cpf) {

    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // Verifica se tem 11 dígitos e se não é uma sequência repetida (ex: 111.111.111-11)
    }

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) return false;

    return true;
}

// Checar CPF
function checarCPF() {

    let inputCPF = document.getElementById('inputCPF');
    let cpfNotificacao = document.getElementById('cpfNotificacao');

    if (!validaCPF(inputCPF.value)) {
        cpfNotificacao.style.display = "block"; // Mostra o popup
        inputCPF.focus(); // Retorna o foco para o campo CPF

    } else {
        cpfNotificacao.style.display = "none"; // Esconde o popup
    }
}
