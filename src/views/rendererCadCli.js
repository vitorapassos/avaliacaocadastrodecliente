/**
 * Cadastro de usuários
 * @author Vitor de Assis
 */
let frmSearchClient = document.getElementById("frmSearchClient");
let frmCli = document.getElementById("frmCli");
let inputIdClient = document.getElementById("inputIdClient");
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
let searchClient = document.getElementById("inputBuscar");

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


// ====================================================
// ============== MANIPULAÇÃO DO ENTER ================

function teclaEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // ignorar o comportamento padrão
    // executar o método de busca do cliente
    searchName();
  }
}

// "Escuta" do teclado ('keydown' = pressionar tecla)
frmSearchClient.addEventListener("keydown", teclaEnter);

// função para restaurar o padrão (tecla Enter)
function restaurarEnter() {
  frmSearchClient.removeEventListener("keydown", teclaEnter);
}

// ============ FIM MANIPULAÇÃO DO ENTER ==============
// ====================================================

// Capturar foco para primeira caixa de texto
const foco = document.getElementById("inputBuscar");

// Criar um vetor global para manipular os dados do cliente
let arrayClient = [];

document.addEventListener("DOMContentLoaded", () => {
  // Desativar botões editar e excluir
  btnUpdate.disabled = true;
  btnDelete.disabled = true;
  // Ativar botão adicionar
  btnCreate.disabled = false;

  foco.focus();
});

// ======================
// == Cadastro Cliente ==

frmCli.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Estratégia para usar o submit para cadastrar um novo cliente ou editar os dados de um cliente já existente
  // verificar se existe o id do cliente

  if (inputIdClient.value === "") {
    // Cadastrar um novo cliente
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
  } else {
    // Alterar os dados de um cliente existente
    // Teste de validação do ID
    //console.log(inputIdClient.value);
    // Cadastrar um novo cliente
    const cliente = {
      idCli: inputIdClient.value,
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
    api.updateClient(cliente);

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
  //limpa o ampo de busca (foco foi capturado de forma global)
  //busca.value = "";

  // Restaurar tecla Enter
  restaurarEnter();
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
        inputIdClient.value = c._id;
        inputNome.value = c.nome;
        inputRG.value = c.rg;
        inputCPF.value = c.cpf;
        inputSexo.value = c.sexo;
        inputDataNasc.value = formatDate(c.dataNascimento);
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
        // restaurar tecla Enter
        restaurarEnter();
        // desativar o botão adicionar
        // Desativar botões editar e excluir
        btnCreate.disabled = true;
        // Ativaros botões editar e excluir
        btnUpdate.disabled = false;
        btnDelete.disabled = false;
      });
    });
  }
}

// ========== FIM =============
// ======== CRUD READ =========

// ==============================
// ======== CRUD DELETE =========
// Meu Deus como eu odeio esse git
function removeClient() {
  //console.log(inputIdClient.value) // teste do passo 1
  // Passo 2: Envio do id para o main
  api.deleteClient(inputIdClient.value);
}

// ============ FIM =============
// ======== CRUD DELETE =========
