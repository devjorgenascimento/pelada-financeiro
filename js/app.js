
import { salvar, carregar } from "./storage.js"

const inputNome = document.getElementById("input-nome-jogador");
const btnAdicionar = document.getElementById("btn-adicionar-jogador");
const btnFecharMes = document.getElementById("btn-fechar-mes");
const listaJogadores = document.getElementById("lista-jogadores");
const botoesAbas = document.querySelectorAll(".aba");
const telas = document.querySelectorAll(".tela");
const jogadoresSalvos = carregar("jogadores");

if (jogadoresSalvos.length > 0) {
  jogadoresSalvos.forEach(j => {
    const linha = document.createElement("tr");

    linha.classList.add(
      j.status === "Pago" ? "linha-pago" : "linha-pendente"
    );

    linha.innerHTML = `
      <td>${j.nome}</td>
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
    const nome = linha.children[0].textContent;
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
    <td>${nome}</td>
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
  const status = linha.querySelector(".status");
  const valor = linha.querySelector(".valor");
  const forma = linha.querySelector(".forma");

  if (e.target.checked) {
    status.textContent = "Pago";

    linha.classList.remove("linha-pendente");
    linha.classList.add("linha-pago");

    valor.disabled = true;
    forma.disabled = true;

    listaJogadores.appendChild(linha);

  } else {
    status.textContent = "Pendente";

    linha.classList.remove("linha-pago");
    linha.classList.add("linha-pendente");

    valor.disabled = false;
    forma.disabled = false;

    listaJogadores.prepend(linha)
  }

  salvarJogadores();
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
  salvarJogadores();
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
let saldo = 0;
let tipoAtual = null;

// Atualiza saldo na tela
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

// Abre modal
function abrirModal(tipo) {
  tipoAtual = tipo;
  modal.classList.add("ativo");

  modalValor.value = "";
  modalDescricao.value = "";
  modalValor.focus();

  modalTitulo.textContent =
    tipo === "entrada" ? "Nova Entrada" : "Nova Saída";
}

// Fecha modal
function fecharModal() {
  modal.classList.remove("ativo");
}

// Criar movimentação
function criarMovimentacao(valor, descricao) {

  movimentacoes.push({
    tipo: tipoAtual,
    valor: valor,
    descricao: descricao
  });

  salvar("caixa", movimentacoes);

  renderizarMovimentacoes();
}

function renderizarMovimentacoes() {
  listaMov.innerHTML = "";

  calcularSaldo();
  atualizarSaldo();

  movimentacoes
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

// Eventos abrir
btnEntrada.addEventListener("click", () => abrirModal("entrada"));
btnSaida.addEventListener("click", () => abrirModal("saida"));

// Cancelar
btnCancelar.addEventListener("click", fecharModal);

// Confirmar
btnConfirmar.addEventListener("click", () => {
  const valor = parseFloat(modalValor.value);
  const descricao = modalDescricao.value.trim();

  if (!valor || !descricao || isNaN(valor)) return;

  criarMovimentacao(valor, descricao);
  fecharModal();
});

renderizarMovimentacoes();