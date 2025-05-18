// URL da API json-server
const API_URL = 'http://localhost:3000/recursos';

// Função para criar um card HTML com os dados do recurso
function criarCardRecurso(recurso) {
  return `
    <article class="resource-card">
      <h3>${recurso.titulo}</h3>
      <p>${recurso.descricao}</p>
      <img src="${recurso.imagem}" alt="${recurso.titulo}" />
      <a href="#" class="resource-link">Começar Agora</a>
    </article>
  `;
}

// Função para buscar os dados e montar a seção
async function carregarRecursos() {
  try {
    const resposta = await fetch(API_URL);
    const recursos = await resposta.json();

    const container = document.querySelector('#recursos-content .resource-grid');
    container.innerHTML = ''; // limpa antes de preencher

    recursos.forEach(recurso => {
      container.innerHTML += criarCardRecurso(recurso);
    });

    // Remove a classe 'hidden' para mostrar a seção
    document.getElementById('recursos-content').classList.remove('hidden');
  } catch (error) {
    console.error('Erro ao carregar recursos:', error);
  }
}

// Quando a página carregar, chama a função
window.onload = () => {
  carregarRecursos();
};
