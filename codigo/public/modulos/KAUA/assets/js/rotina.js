const apiUrl = 'http://localhost:3000/rotina';

// READ
async function carregarRotinas() {
  try {
    const resposta = await fetch(apiUrl);
    const rotinas = await resposta.json();

    rotinas.sort((a, b) => a.horario.localeCompare(b.horario));

    const container = document.getElementById('rotina-container');
    container.innerHTML = '';

    rotinas.forEach(item => {
      const card = document.createElement('div');
      card.className = 'rotina-card';

      card.innerHTML = `
        <span>${item.horario}</span>
        <span>${item.icone} ${item.nome}</span>
        <small>(${item.categoria})</small>
        <button onclick="editarRotina(${item.id})">✏️</button>
        <button onclick="excluirRotina(${item.id})">🗑️</button>
      `;

      container.appendChild(card);
    });
  } catch (erro) {
    console.error('Erro ao carregar rotinas:', erro);
    alert('Erro ao carregar rotinas.');
  }
}

// CREATE
async function adicionarRotina(rotina) {
  try {
    const resposta = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rotina),
    });
    if (!resposta.ok) throw new Error('Erro ao adicionar');
    carregarRotinas();
  } catch (erro) {
    console.error(erro);
    alert('Erro ao adicionar rotina.');
  }
}

// UPDATE
async function editarRotina(id) {
  const novoNome = prompt('Novo nome da rotina:');
  const novoHorario = prompt('Novo horário (HH:MM):');
  const novaCategoria = prompt('Nova categoria:');
  const novoIcone = prompt('Novo ícone (emoji):');

  if (novoNome && novoHorario && novaCategoria && novoIcone) {
    try {
      const resposta = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: novoNome,
          horario: novoHorario,
          categoria: novaCategoria,
          icone: novoIcone,
        }),
      });
      if (!resposta.ok) throw new Error('Erro ao editar');
      carregarRotinas();
    } catch (erro) {
      console.error(erro);
      alert('Erro ao editar rotina.');
    }
  }
}

// DELETE
async function excluirRotina(id) {
  if (confirm('Deseja realmente excluir esta rotina?')) {
    try {
      const resposta = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!resposta.ok) throw new Error('Erro ao excluir');
      carregarRotinas();
    } catch (erro) {
      console.error(erro);
      alert('Erro ao excluir rotina.');
    }
  }

  
}


window.editarRotina = editarRotina;
window.excluirRotina = excluirRotina;