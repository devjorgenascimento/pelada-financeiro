const botoesAbas = document.querySelectorAll(".aba");
const telas = document.querySelectorAll(".tela");
const addJogador = document.getElementById("btn-adicionar-jogador");

let jogadores = []

const listaJogadores = document.getElementById("lista-jogadores")

function renderizarJogadores() {
  listaJogadores.innerHTML = ""

  jogadores.forEach((jogador, index) => {
    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td>${jogador.nome}</td>
      <td class="${jogador.pago ? "pago" : "pendente"}">
        ${jogador.pago ? "Pago" : "Pendente"}
      </td>
      <td>${jogador.pago ? "R$ " + jogador.valor : "-"}</td>
      <td>${jogador.forma ? jogador.forma : "-"}</td>
      <td>
  <input 
    type="checkbox" 
    ${jogador.pago ? "checked" : ""} 
    onchange="togglePagamento(${index})"
   </td>
    `

    listaJogadores.appendChild(tr)
  })
}

function adicionarJogador(nome) {
  jogadores.push({
    nome,
    pago: false,
    valor: 0,
    forma: null
  })

  renderizarJogadores()
}

botoesAbas.forEach(botao => {
  botao.addEventListener("click", () => {
    
    // Remove ativo de todos os botões
    botoesAbas.forEach(b => b.classList.remove("ativa"))
    
    // Remove ativo de todas as telas
    telas.forEach(t => t.classList.remove("ativa"))
    
    // Ativa botão clicado
    botao.classList.add("ativa")
    
    // Descobre qual aba abrir
    const nomeAba = botao.dataset.aba
    const telaAtiva = document.getElementById(`aba-${nomeAba}`)
    
    telaAtiva.classList.add("ativa")
  })
});

function togglePagamento(index) {
  const jogador = jogadores[index]

  if (!jogador.pago) {
    const valor = Number(prompt("Valor pago:"));
    const forma = prompt("Forma (pix ou dinheiro):");

    if (!valor || !forma) return

    jogador.pago = true
    jogador.valor = valor
    jogador.forma = forma

  } else {
    jogador.pago = false
    jogador.valor = 0
    jogador.forma = null
  }

  renderizarJogadores();
}



adicionarJogador("Vitor", true)
adicionarJogador("Aderbal")
adicionarJogador("Jorge")
