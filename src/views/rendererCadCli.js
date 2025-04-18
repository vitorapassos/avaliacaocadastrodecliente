/**
 * Cadastro de usuários
 * @author Vitor de Assis
 */

let frmCli = document.getElementById("frmCli");
let inputNome = document.getElementById("inputNome");
let inputRG = document.getElementById("inputRG");
let inputCPF = document.getElementById("inputCPF");
let inputSexo = document.getElementById("inputSexo");
let inputDataNasc = document.getElementById("inputDataNasc");
let inputTelefone = document.getElementById("inputTelefone");
let inputTelefone2 = document.getElementById("inputTelefone2");
let inputEmail = document.getElementById("inputEmail");
let inputSenha = document.getElementById("inputSenha");
let inputCep = document.getElementById("inputCep");
let inputEndereco = document.getElementById("inputEndereco");
let inputNum = document.getElementById("inputNum");
let inputComplemento = document.getElementById("inputComplemento");
let inputBairro = document.getElementById("inputBairro");
let inputCidade = document.getElementById("inputCidade");
let inputEstado = document.getElementById("inputEstado");
let searchCient = document.getElementById("inputBuscar");

// Capturar foco para primeira caixa de texto
const foco = document.getElementById("inputBuscar");

// Criar um vetor global para manipular os dados do cliente
let arrayClient = [];

document.addEventListener("DOMContentLoaded", () => {
  foco.focus();

  // Desativar botões
  btnUpdate.disable = true;
  btnDelete.disable = true;
});

// ======================
// == Cadastro Cliente ==

frmCli.addEventListener("submit", async (event) => {
  event.preventDefault();

  console.log(
    inputNome.value,
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
    inputEstado.value
  );

  try {
    const cliente = {
      nomeCli: inputNome.value,
      rgCli: inputRG.value,
      cpfCli: inputCPF.value,
      sexoCli: inputSexo.value,
      dataNascCli: inputDataNasc.value,
      telefoneCli: inputTelefone.value,
      telefone2Cli: inputTelefone2.value,
      emailCli: inputEmail.value,
      senhaCli: inputSenha.value,
      cepCli: inputCep.value,
      enderecoCli: inputEndereco.value,
      numCli: inputNum.value,
      complementoCli: inputComplemento.value,
      bairroCli: inputBairro.value,
      cidadeCli: inputCidade.value,
      estadoCli: inputEstado.value,
    };

    api.createCliente(cliente);
  } catch (error) {
    console.log(error);
  }
});

// == FIM Cadastro Cliente ==
// ==========================

// Buscas CEP
function buscarEndereco() {
  let cep = document.getElementById("inputCep").value;
  let urlAPI = `https://viacep.com.br/ws/${cep}/json/`;

  fetch(urlAPI)
    .then((response) => response.json())
    .then((dados) => {
      document.getElementById("inputEndereco").value = dados.logradouro;
      document.getElementById("inputBairro").value = dados.bairro;
      document.getElementById("inputCidade").value = dados.localidade;
      document.getElementById("inputEstado").value = dados.uf;
    })
    .catch((error) => console.error("Erro ao buscar o endereço:", error));
}

// Validar CPF
function validaCPF(cpf) {
  cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

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
  let inputCPF = document.getElementById("inputCPF");
  let cpfNotificacao = document.getElementById("cpfNotificacao");

  if (!validaCPF(inputCPF.value)) {
    /*cpfNotificacao.style.display = "block"; // Mostra o popup
        inputCPF.focus(); // Retorna o foco para o campo CPF*/
    inputCPF.classList.remove("is-valid");
    inputCPF.classList.add("is-invalid");
  } else {
    inputCPF.classList.remove("is-invalid");
    inputCPF.classList.add("is-valid");
  }
}

// ============================
// ====== CPF duplicado =======

function cpfDuplicate(cliente) {
  inputCPF.value = "";
  inputCPF.focus();
  inputCPF.classList.add("is-invalid");
}

api.cpfDuplicate((args) => {
  cpfDuplicate();
});

// ==== FIM CPF duplicado =====
// ============================

// ============================
// ==== RESETAR FORMULÁRIO ====

function resetForm() {
  // recarregar a pagina
  location.reload();
}

// Uso da api resetForm quando salvar, editar ou excluir um cliente
api.resetForm((args) => {
  resetForm();
});

// ========== FIM =============
// ==== RESETAR FORMULÁRIO ====

// ============================
// ======== CRUD READ =========

// setar o nome do cliente o nome do cliente para fazer um novo cadastro se a busca retornar que o cliente
api.setName((args) => {
  console.log("teste do IPC 'set-name'");
  let busca = document.getElementById("inputBuscar").value;

  // foco no campo nome
  inputNome.focus();
  // Limpar o campo de busca
  foco.value = "";
  // Copiar o nome do cliente para o campo nome
  inputNome.value = busca;
  //
  busca.value = "";
});

function searchName() {
  // console.log("Teste botão buscar")
  // Passo 1:  Capturar o nome a ser pesquisado
  let cliName = document.getElementById("inputBuscar").value; // Teste do passo 1
  console.log(cliName);
  // Validação de campo obrigatório
  if (cliName === "") {
    // Enviar ao main um pedido para alertar o usuário
    api.validateSearch();
  } else {
    // Passo 2: Enviar o nome do cliente ao main
    api.searchName(cliName);
    // Passo 5: Receber os dados do cliente
    api.renderClient((event, client) => {
      // Teste de recebimento dos dados do cliente
      console.log(client);
      // Passo 6: Renderização  dos dados do cliente - não esquecer de converter os dados de STRING para JSON
      const clientData = JSON.parse(client);
      arrayClient = clientData;

      // Uso do ForEach para percorrer o vetor e extrair os dados
      arrayClient.forEach((c) => {
        inputNome.value = c.nome;
        inputRG.value = c.rg;
        inputCPF.value = c.cpf;
        inputSexo.value = c.sexo;
        inputDataNasc.value = c.dataNascimento;
        inputTelefone.value = c.telefone;
        inputTelefone2.value = c.telefone2;
        inputEmail.value = c.email;
        inputSenha.value = c.senha;
        inputCep.value = c.cep;
        inputEndereco.value = c.endereco;
        inputNum.value = c.numero;
        inputComplemento.value = c.complemento;
        inputBairro.value = c.bairro;
        inputCidade.value = c.cidade;
        inputEstado.value = c.estado;
      });
    });
  }
}

// ========== FIM =============
// ======== CRUD READ =========
