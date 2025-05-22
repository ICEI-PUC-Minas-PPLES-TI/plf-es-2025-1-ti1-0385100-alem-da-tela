// Função genérica para criar um card HTML com os dados
function criarCard(item) {
  return `
    <article class="resource-card">
      <h3>${item.titulo}</h3>
      <p>${item.descricao}</p>
      ${item.imagem ? `<img src="${item.imagem}" alt="${item.titulo}" />` : ''}
      <a href="${item.link || '#'}" class="resource-link">${item.acao || 'Começar Agora'}</a>
    </article>
  `;
}

// Função para carregar recursos
async function carregarRecursos() {
  try {
    const resposta = await fetch('http://localhost:3000/recursos');
    const recursos = await resposta.json();

    const container = document.getElementById('resource-container');
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

// Quando a página carregar, chama as funções para carregar todas as seções
window.addEventListener('DOMContentLoaded', () => {
  carregarRecursos();
  carregarComunidades();
  carregarProfissionais();
});
