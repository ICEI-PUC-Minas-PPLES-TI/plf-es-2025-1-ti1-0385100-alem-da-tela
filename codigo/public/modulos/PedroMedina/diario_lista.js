function carregarRegistros() {
    const listaRegistros = document.getElementById("lista-registros");
    const ultimoRegistroDestaque = document.getElementById("ultimo-registro-destaque");

    if (!listaRegistros) {
        console.warn("Elemento #lista-registros não encontrado. Verifique tela_gerada.html.");
        return;
    }
    if (!ultimoRegistroDestaque) {
        console.warn("Elemento #ultimo-registro-destaque não encontrado. Verifique tela_gerada.html.");
        return;
    }

    listaRegistros.innerHTML = '';
    ultimoRegistroDestaque.innerHTML = '<h2>Carregando...</h2>';

    Promise.all([
        fetch("http://localhost:3000/registros").then(response => {
            if (!response.ok) throw new Error('Erro ao carregar registros: ' + response.statusText);
            return response.json();
        }),
        fetch("http://localhost:3000/respostas").then(response => {
            if (!response.ok) throw new Error('Erro ao carregar respostas: ' + response.statusText);
            return response.json();
        })
    ])
    .then(([registros, respostas]) => {
        const respostasMap = new Map();
        respostas.forEach(resp => {
            respostasMap.set(resp.registroId, resp);
        });

        if (registros && registros.length > 0) {
            registros.sort((a, b) => {
                if (a.data > b.data) return -1;
                if (a.data < b.data) return 1;
                return b.id - a.id;
            });

            const ultimoRegistro = registros[0];
            if (ultimoRegistro) {
                const respostaDestaque = respostasMap.get(ultimoRegistro.id);
                ultimoRegistroDestaque.innerHTML = `
                    <h2>Último Registro Destaque</h2>
                    <div class="destaque-card">
                        <h3>${ultimoRegistro.titulo || 'Sem título'}</h3>
                        <p><strong>Data:</strong> ${ultimoRegistro.data}</p>
                        <p>${ultimoRegistro.conteudo}</p>
                        ${ultimoRegistro.privado ? '<em>(Privado)</em>' : ''}
                        ${ultimoRegistro.profissional ? '<em>(Enviado para profissional)</em>' : ''}
                        ${respostaDestaque ? `<div class="resposta-profissional"><strong>Resposta do Profissional (${respostaDestaque.dataResposta || 'Data Desconhecida'}):</strong><p>${respostaDestaque.texto}</p></div>` : ''}
                    </div>
                `;
            } else {
                ultimoRegistroDestaque.innerHTML = '<h2>Nenhum registro para destaque.</h2>';
            }

            registros.forEach(registro => {
                const li = document.createElement("li");
                li.classList.add('registro-item');
                li.dataset.id = registro.id;

                const respostaAssociada = respostasMap.get(registro.id);

                li.innerHTML = `
                    <strong>${registro.titulo || 'Sem título'}</strong> (${registro.data})<br>
                    <p>${registro.conteudo}</p>
                    ${registro.privado ? '<em>(Privado)</em>' : ''}
                    ${registro.profissional ? '<em>(Enviado para profissional)</em>' : ''}
                    ${respostaAssociada ? `<div class="resposta-profissional"><strong>Resposta do Profissional (${respostaAssociada.dataResposta || 'Data Desconhecida'}):</strong><p>${respostaAssociada.texto}</p></div>` : ''}
                    <button class="delete-btn" data-id="${registro.id}">Excluir</button>
                `;

                li.addEventListener('click', (event) => {
                    if (event.target.classList.contains('delete-btn')) {
                        return;
                    }
                    window.location.href = `diario.html?id=${registro.id}`;
                });

                listaRegistros.appendChild(li);
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
            ultimoRegistroDestaque.innerHTML = '<h2>Nenhum registro para destaque.</h2>';
        }
    })
    .catch(error => {
        console.error("Erro ao carregar registros ou respostas:", error);
        listaRegistros.innerHTML = '<li>Erro ao carregar registros.</li>';
        ultimoRegistroDestaque.innerHTML = '<h2>Erro ao carregar o último registro.</h2>';
    });
}

function excluirRegistro(id) {
    Promise.all([
        fetch(`http://localhost:3000/registros/${id}`, {
            method: 'DELETE',
        }),
        fetch(`http://localhost:3000/respostas?registroId=${id}`).then(res => res.json()).then(respostas => {
            if (respostas.length > 0) {
                return fetch(`http://localhost:3000/respostas/${respostas[0].id}`, { method: 'DELETE' });
            }
            return Promise.resolve();
        })
    ])
    .then(([registroResponse, respostaResponse]) => {
        if (registroResponse.ok) {
            alert('Registro e resposta (se houver) excluídos com sucesso!');
            carregarRegistros();
        } else {
            alert('Erro ao excluir registro principal.');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir registro ou resposta:', error);
        alert('Erro ao excluir registro.');
    });
}

document.addEventListener("DOMContentLoaded", carregarRegistros);