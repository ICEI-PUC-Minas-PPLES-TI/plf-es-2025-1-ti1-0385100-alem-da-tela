
// Função para carregar recursos
async function carregarRecursos() {
  try {
    const resposta = await fetch('http://localhost:3000/recursos');
    const recursos = await resposta.json();

    const container = document.getElementById('resource-link');
    container.innerHTML = '';

    recursos.forEach(recurso => {
      container.innerHTML += criarCard(recurso);
    });

document.getElementById('recursos-content').classList.remove('hidden');

  } catch (error) {
    console.error('Erro ao carregar recursos:', error);
  }
}
 
// Função para carregar comunidades
async function carregarComunidades() {
  try {
    const resposta = await fetch('http://localhost:3000/comunidades');
    const comunidades = await resposta.json();

    const container = document.getElementById('comunidade-container');
    container.innerHTML = '';

    comunidades.forEach(item => {
      container.innerHTML += criarCard(item);
    });

    document.getElementById('comunidades-content').classList.remove('hidden');
  } catch (error) {
    console.error('Erro ao carregar comunidades:', error);
  }
}

// Função para carregar profissionais
async function carregarProfissionais() {
  try {
    const resposta = await fetch('http://localhost:3000/profissionais');
    const profissionais = await resposta.json();

   const container = document.getElementById('profissional-container');
    container.innerHTML = '';

    profissionais.forEach(item => {
      container.innerHTML += criarCard(item);
    });

   document.getElementById('profissional-content').classList.remove('hidden');
  } catch (error) {
    console.error('Erro ao carregar profissionais:', error);
  }
}

// Função para carregar rotinas
async function carregarRotinas() {
  try {
    const resposta = await fetch('http://localhost:3000/rotinas');
    let rotinas = await resposta.json();

    // Ordenar por horário crescente
    rotinas.sort((a, b) => a.horario.localeCompare(b.horario));

    const container = document.getElementById('rotina-container');
    container.innerHTML = '';

    rotinas.forEach(item => {
      container.innerHTML += `
        <article class="rotina-card">
          <div><strong>${item.horario}</strong></div>
          <div>${item.icone || ''} ${item.nome}</div>
          <div><small>(${item.categoria})</small></div>
        </article>
      `;
    });

    document.getElementById('rotina-content').classList.remove('hidden');
  } catch (error) {
    console.error('Erro ao carregar rotinas:', error);
  }
}


// Quando a página carregar, chama as funções para carregar todas as seções
window.addEventListener('DOMContentLoaded', () => {
  carregarRecursos();
  carregarComunidades();
  carregarProfissionais();
  carregarRotinas(); //rotinas adicionada para rodas automaticamente com os outros cards 
});
