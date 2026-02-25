export function salvar(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados))
}

export function carregar(chave) {
  const dados = localStorage.getItem(chave)
  return dados ? JSON.parse(dados) : []
}