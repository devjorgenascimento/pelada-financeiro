const inputNome = document.getElementById("input-nome-jogador");
const btnAdicionar = document.getElementById("btn-adicionar-jogador");
const btnFecharMes = document.getElementById("btn-fechar-mes");
const listaJogadores = document.getElementById("lista-jogadores");
const botoesAbas = document.querySelectorAll(".aba");
const telas = document.querySelectorAll(".tela");

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

let saldo = 0;
let tipoAtual = null;

// Atualiza saldo na tela
function atualizarSaldo() {
  saldoSpan.textContent = saldo.toFixed(2);
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
  const li = document.createElement("li");

  if (tipoAtual === "entrada") {
    saldo += valor;
    li.innerHTML = `
      <span>🟢 ${descricao}</span>
      <strong>+ R$ ${valor.toFixed(2)}</strong>
    `;
  } else {
    saldo -= valor;
    li.innerHTML = `
      <span>🔴 ${descricao}</span>
      <strong>- R$ ${valor.toFixed(2)}</strong>
    `;
  }

  listaMov.prepend(li);
  atualizarSaldo();
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