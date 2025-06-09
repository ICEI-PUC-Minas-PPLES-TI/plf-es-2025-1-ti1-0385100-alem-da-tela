// Este arquivo será responsável por carregar e exibir os registros na tela_gerada.html

function carregarRegistros() {
    const listaRegistros = document.getElementById("lista-registros");
    if (!listaRegistros) {
        console.warn("Elemento #lista-registros não encontrado. Verifique tela_gerada.html.");
        return;
    }
  
    listaRegistros.innerHTML = '';
  
    fetch("http://localhost:3000/registros")
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar registros: ' + response.statusText);
            }
            return response.json();
        })
        .then(registros => {
            if (registros && registros.length > 0) {
                registros.forEach(registro => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <strong>${registro.titulo || 'Sem título'}</strong> (${registro.data})<br>
                        <p>${registro.conteudo}</p>
                        ${registro.privado ? '<em>(Privado)</em>' : ''}
                        ${registro.profissional ? '<em>(Enviado para profissional)</em>' : ''}
                    `;
                    // Adiciona um atributo de dados (data-id) para armazenar o ID do registro
                    li.dataset.id = registro.id; //
                    li.classList.add('registro-item'); // Adiciona uma classe para estilização e seleção
  
                    // Adiciona o event listener para cada item da lista
                    li.addEventListener('click', () => { //
                        // Redireciona para diario.html, passando o ID do registro na URL
                        window.location.href = `diario.html?id=${registro.id}`; //
                    });
  
                    listaRegistros.appendChild(li);
                });
            } else {
                listaRegistros.innerHTML = '<li>Nenhum registro encontrado.</li>';
            }
        })
        .catch(error => {
            console.error("Erro ao carregar registros:", error);
            listaRegistros.innerHTML = '<li>Erro ao carregar registros.</li>';
        });
  }
  
  document.addEventListener("DOMContentLoaded", carregarRegistros);