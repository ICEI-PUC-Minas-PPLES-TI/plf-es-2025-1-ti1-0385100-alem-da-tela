async function carregarRotinas() {
  const resposta = await fetch('http://localhost:3000/rotinas');
  let rotinas = await resposta.json();

  rotinas.sort((a, b) => a.horario.localeCompare(b.horario));

  const container = document.getElementById('rotina-container');
  container.innerHTML = '';
  rotinas.forEach(item => {
    container.innerHTML += `
      <div class="rotina-card">
        <span>${item.horario}</span>
        <span>${item.icone} ${item.nome}</span>
        <small>(${item.categoria})</small>
        <button onclick="editarRotina(${item.id})">✏️</button>
        <button onclick="excluirRotina(${item.id})">🗑️</button>
      </div>
    `;
  });
}
