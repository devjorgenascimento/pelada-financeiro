
import { salvar, carregar } from "./storage.js"

const inputNome = document.getElementById("input-nome-jogador");
const btnAdicionar = document.getElementById("btn-adicionar-jogador");
const btnFecharMes = document.getElementById("btn-fechar-mes");
const listaJogadores = document.getElementById("lista-jogadores");
const botoesAbas = document.querySelectorAll(".aba");
const telas = document.querySelectorAll(".tela");
const jogadoresSalvos = carregar("jogadores");
const btnExcluirJogador = document.getElementById("btn-excluir-jogador")

let modoExclusao = false;


if (jogadoresSalvos.length > 0) {
  jogadoresSalvos.forEach(j => {
    const linha = document.createElement("tr");

    linha.classList.add(
      j.status === "Pago" ? "linha-pago" : "linha-pendente"
    );

    linha.innerHTML = `
      <td class="nome">${j.nome}</td>
      <td class="status">${j.status}</td>
      <td>
        <input type="number" class="valor" min="0" step="0.01" value="${j.valor}">
      </td>
      <td>
        <select class="forma">
          <option value="Dinheiro" ${j.forma === "Dinheiro" ? "selected" : ""}>Dinheiro</option>
          <option value="Pix" ${j.forma === "Pix" ? "selected" : ""}>Pix</option>
        </select>
      </td>
      <td>
        <input type="checkbox" class="check" ${j.check ? "checked" : ""}>
      </td>
    `;

    if (j.check) {
      linha.querySelector(".valor").disabled = true;
      linha.querySelector(".forma").disabled = true;
    }

    listaJogadores.appendChild(linha);
  });
}

function salvarJogadores() {
  const linhas = listaJogadores.querySelectorAll("tr");
  const lista = [];

  linhas.forEach(linha => {
    const nome = linha.querySelector(".nome").textContent;
    const status = linha.querySelector(".status").textContent;
    const valor = linha.querySelector(".valor").value;
    const forma = linha.querySelector(".forma").value;
    const check = linha.querySelector(".check").checked;

    lista.push({ nome, status, valor, forma, check });
  });

  salvar("jogadores", lista); // 👈 FALTAVA ISSO
}


// ADICIONAR JOGADOR
btnAdicionar.addEventListener("click", () => {
  const nome = inputNome.value.trim();

  if (!nome) return;

  const linha = document.createElement("tr");
  linha.classList.add("linha-pendente");

  linha.innerHTML = `
    <td class="nome">${nome}</td>
    <td class="status pendente">Pendente</td>
    <td>
      <input type="number" class="valor" min="0" step="0.01">
    </td>
    <td>
      <select class="forma">
        <option value="Dinheiro">Dinheiro</option>
        <option value="Pix">Pix</option>
      </select>
    </td>
    <td>
      <input type="checkbox" class="check">
    </td>
  `;

  listaJogadores.appendChild(linha);
  inputNome.value = "";

  salvarJogadores();
});

// CHECKBOX MUDA STATUS E TRAVA CAMPOS
listaJogadores.addEventListener("click", (e) => {
  if (!e.target.classList.contains("check")) return;

  const linha = e.target.closest("tr");

  // 🗑 MODO EXCLUSÃO
  if (modoExclusao) {
    linha.remove();
    salvarJogadores();

    modoExclusao = false;
    listaJogadores.classList.remove("modo-exclusao");
    btnExcluirJogador.classList.remove("btn-exclusao-ativo");

    return;
  }

  const status = linha.querySelector(".status");
  const valor = linha.querySelector(".valor");
  const forma = linha.querySelector(".forma");
  const nome = linha.querySelector(".nome").textContent;

  if (e.target.checked) {

    // evita duplicação
    if (status.textContent === "Pago") return;

    const valorPago = parseFloat(valor.value);
    const formaPagamento = forma.value;

    if (!valorPago || isNaN(valorPago)) return;

    status.textContent = "Pago";

    linha.classList.remove("linha-pendente");
    linha.classList.add("linha-pago");

    valor.disabled = true;
    forma.disabled = true;

    listaJogadores.appendChild(linha);

    // 💰 CRIA MOVIMENTAÇÃO NO CAIXA
    const novaMov = {
      tipo: "entrada",
      valor: valorPago,
      descricao: `${nome} pagou a mensalidade no ${formaPagamento}`
    };

    movimentacoes.push(novaMov);
    salvar("caixa", movimentacoes);

    historicoMes.push(novaMov);
    salvar("historicoMes", historicoMes);

    renderizarMovimentacoes();

  } else {

    status.textContent = "Pendente";

    linha.classList.remove("linha-pago");
    linha.classList.add("linha-pendente");

    valor.disabled = false;
    forma.disabled = false;

    listaJogadores.prepend(linha);
  }

  salvarJogadores();
});

btnExcluirJogador.addEventListener("click", () => {
  modoExclusao = !modoExclusao;

  if (modoExclusao) {
    listaJogadores.classList.add("modo-exclusao");
    btnExcluirJogador.classList.add("btn-excluir-jogador");
  } else {
    listaJogadores.classList.remove("modo-exclusao");
    btnExcluirJogador.classList.remove("btn-exclusao-ativo");
  }
});

botoesAbas.forEach(botao => {
  botao.addEventListener("click", () => {

    botoesAbas.forEach(b => b.classList.remove("ativa"));
    botao.classList.add("ativa");

    telas.forEach(tela => tela.classList.remove("ativa"));

    const nomeAba = botao.dataset.aba;
    const telaAtiva = document.getElementById(`aba-${nomeAba}`);

    if (telaAtiva) {
      telaAtiva.classList.add("ativa")
    }
  })
})

// FECHAR MÊS (RESETAR STATUS)
btnFecharMes.addEventListener("click", () => {
  const linhas = listaJogadores.querySelectorAll("tr");
  
  linhas.forEach(linha => {
    const status = linha.querySelector(".status");
    const valor = linha.querySelector(".valor");
    const forma = linha.querySelector(".forma");
    const check = linha.querySelector(".check");
    

    linha.classList.remove("linha-pago");
    linha.classList.add("linha-pendente");

    status.classList.remove("pago");
    status.classList.add("pendente");

    status.textContent = "Pendente";
    valor.disabled = false;
    forma.disabled = false;
    if(check) {
      check.checked = false;
    }

  });

  historicoMes = [];

  salvar("historicoMes", historicoMes);

  listaMov.innerHTML = "";
});

// ABA CAIXA

const btnEntrada = document.getElementById("btn-entrada");
const btnSaida = document.getElementById("btn-saida");
const listaMov = document.getElementById("lista-movimentacoes");
const saldoSpan = document.getElementById("saldo");

// Modal
const modal = document.getElementById("modal-caixa");
const modalTitulo = document.getElementById("modal-titulo");
const modalValor = document.getElementById("modal-valor");
const modalDescricao = document.getElementById("modal-descricao");
const btnConfirmar = document.getElementById("modal-confirmar");
const btnCancelar = document.getElementById("modal-cancelar");

let movimentacoes = carregar("caixa") || [];
let historicoMes = carregar("historicoMes") || [];
let saldo = 0;
let tipoAtual = null;

// Atualiza saldo
function atualizarSaldo() {
  saldoSpan.textContent = saldo.toFixed(2);
}

function calcularSaldo() {
  saldo = movimentacoes.reduce((total, mov) => {
    return mov.tipo === "entrada"
      ? total + mov.valor
      : total - mov.valor;
  }, 0);
}

// Modal
function abrirModal(tipo) {
  tipoAtual = tipo;
  modal.classList.add("ativo");

  modalValor.value = "";
  modalDescricao.value = "";
  modalValor.focus();

  modalTitulo.textContent =
    tipo === "entrada" ? "Nova Entrada" : "Nova Saída";
}

function fecharModal() {
  modal.classList.remove("ativo");
}

// Criar movimentação
function criarMovimentacao(valor, descricao) {

  const novaMov = {
    tipo: tipoAtual,
    valor: valor,
    descricao: descricao
  };

  // permanente
  movimentacoes.push(novaMov);
  salvar("caixa", movimentacoes);

  // histórico do mês
  historicoMes.push(novaMov);
  salvar("historicoMes", historicoMes);

  renderizarMovimentacoes();
}

// Renderiza usando APENAS histórico do mês
function renderizarMovimentacoes() {
  listaMov.innerHTML = "";

  calcularSaldo();
  atualizarSaldo();

  historicoMes
    .slice()
    .reverse()
    .forEach(mov => {

      const li = document.createElement("li");

      if (mov.tipo === "entrada") {
        li.innerHTML = `
          <span>🟢 ${mov.descricao}</span>
          <strong>+ R$ ${mov.valor.toFixed(2)}</strong>
        `;
      } else {
        li.innerHTML = `
          <span>🔴 ${mov.descricao}</span>
          <strong>- R$ ${mov.valor.toFixed(2)}</strong>
        `;
      }

      listaMov.appendChild(li);
    });
}

// Eventos
btnEntrada.addEventListener("click", () => abrirModal("entrada"));
btnSaida.addEventListener("click", () => abrirModal("saida"));
btnCancelar.addEventListener("click", fecharModal);

btnConfirmar.addEventListener("click", () => {
  const valor = parseFloat(modalValor.value);
  const descricao = modalDescricao.value.trim();

  if (!valor || !descricao || isNaN(valor)) return;

  criarMovimentacao(valor, descricao);
  fecharModal();
});

// Inicializa
renderizarMovimentacoes();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js")
    .then(() => console.log("Service Worker registrado"));
}