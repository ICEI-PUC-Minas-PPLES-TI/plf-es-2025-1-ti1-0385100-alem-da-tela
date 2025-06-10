// Este arquivo será responsável por carregar e exibir os registros na tela_gerada.html

function carregarRegistros() {
    const listaRegistros = document.getElementById("lista-registros");
    const ultimoRegistroDestaque = document.getElementById("ultimo-registro-destaque"); // Novo elemento
    
    if (!listaRegistros) {
        console.warn("Elemento #lista-registros não encontrado. Verifique tela_gerada.html.");
        return;
    }
    if (!ultimoRegistroDestaque) { // Verificação para o novo elemento
        console.warn("Elemento #ultimo-registro-destaque não encontrado. Verifique tela_gerada.html.");
        return;
    }
  
    listaRegistros.innerHTML = '';
    ultimoRegistroDestaque.innerHTML = ''; // Limpa o conteúdo antes de carregar

    fetch("http://localhost:3000/registros")
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar registros: ' + response.statusText);
            }
            return response.json();
        })
        .then(registros => {
            if (registros && registros.length > 0) {
                // Ordenar registros por data ou ID para garantir que o "último" seja o mais recente
                registros.sort((a, b) => {
                    // Assumindo que 'id' é incremental ou 'data' pode ser usada para ordenação
                    // Se 'data' for uma string no formato 'YYYY-MM-DD', a comparação direta funciona
                    if (a.data > b.data) return -1;
                    if (a.data < b.data) return 1;
                    return b.id - a.id; // Para o caso de mesma data, use o ID
                });

                const ultimoRegistro = registros[0]; // O último registro após a ordenação

                // Exibir o último registro na área de destaque
                ultimoRegistroDestaque.innerHTML = `
                    <h2>Seu Último Desabafo:</h2>
                    <div class="destaque-card">
                        <h3>${ultimoRegistro.titulo || 'Sem título'}</h3>
                        <p><strong>Data:</strong> ${ultimoRegistro.data}</p>
                        <p>${ultimoRegistro.conteudo}</p>
                        ${ultimoRegistro.privado ? '<p><em>(Este registro é privado)</em></p>' : ''}
                        ${ultimoRegistro.profissional ? '<p><em>(Este registro foi enviado para um profissional)</em></p>' : ''}
                    </div>
                `;

                registros.forEach(registro => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <strong>${registro.titulo || 'Sem título'}</strong> (${registro.data})<br>
                        <p>${registro.conteudo}</p>
                        ${registro.privado ? '<em>(Privado)</em>' : ''}
                        ${registro.profissional ? '<em>(Enviado para profissional)</em>' : ''}
                        <div class="registro-actions">
                            <button class="edit-btn" data-id="${registro.id}">Editar</button>
                            <button class="delete-btn" data-id="${registro.id}">Excluir</button>
                        </div>
                    `;
                    li.dataset.id = registro.id; 
                    li.classList.add('registro-item'); 
  
                    listaRegistros.appendChild(li);
                });

                // Add event listeners for edit and delete buttons after they are rendered
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const id = event.target.dataset.id;
                        window.location.href = `diario.html?id=${id}`; // Redirect to diario.html for editing
                    });
                });

                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const id = event.target.dataset.id;
                        if (confirm('Tem certeza que deseja excluir este registro?')) {
                            excluirRegistro(id);
                        }
                    });
                });

            } else {
                listaRegistros.innerHTML = '<li>Nenhum registro encontrado.</li>';
                ultimoRegistroDestaque.innerHTML = '<h2>Nenhum registro para destaque.</h2>'; // Mensagem para o destaque
            }
        })
        .catch(error => {
            console.error("Erro ao carregar registros:", error);
            listaRegistros.innerHTML = '<li>Erro ao carregar registros.</li>';
            ultimoRegistroDestaque.innerHTML = '<h2>Erro ao carregar o último registro.</h2>';
        });
}

function excluirRegistro(id) {
    fetch(`http://localhost:3000/registros/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            alert('Registro excluído com sucesso!');
            carregarRegistros(); // Reload the list and highlight after deletion
        } else {
            alert('Erro ao excluir registro.');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir registro:', error);
        alert('Erro ao excluir registro.');
    });
}
  
document.addEventListener("DOMContentLoaded", carregarRegistros);