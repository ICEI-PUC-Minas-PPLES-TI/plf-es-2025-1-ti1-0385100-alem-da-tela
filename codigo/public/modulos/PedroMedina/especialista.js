document.addEventListener("DOMContentLoaded", carregarDesabafosParaProfissional);

async function carregarDesabafosParaProfissional() {
    const listaDesabafosPendentes = document.getElementById("lista-desabafos-pendentes");
    const listaDesabafosRespondidos = document.getElementById("lista-desabafos-respondidos");

    if (!listaDesabafosPendentes || !listaDesabafosRespondidos) {
        console.error("Um ou mais elementos de lista de desabafos não foram encontrados no HTML.");
        return;
    }

    listaDesabafosPendentes.innerHTML = '<li>Carregando desabafos...</li>';
    listaDesabafosRespondidos.innerHTML = '';

    try {
        const desabafosResponse = await fetch("http://localhost:3000/registros");
        if (!desabafosResponse.ok) {
            throw new Error('Erro ao carregar desabafos: ' + desabafosResponse.statusText);
        }
        let registros = await desabafosResponse.json();

        const respostasResponse = await fetch("http://localhost:3000/respostas");
        if (!respostasResponse.ok) {
            throw new Error('Erro ao carregar respostas: ' + respostasResponse.statusText);
        }
        const respostas = await respostasResponse.json();

        const respostasMap = new Map();
        respostas.forEach(resp => {
            respostasMap.set(resp.registroId, resp);
        });

        listaDesabafosPendentes.innerHTML = '';
        listaDesabafosRespondidos.innerHTML = '';

        let temDesabafosPendentes = false;
        let temDesabafosRespondidos = false;

        registros.sort((a, b) => {
            if (a.data > b.data) return -1;
            if (a.data < b.data) return 1;
            return b.id - a.id;
        });

        registros.forEach(registro => {
            if (!registro.profissional) {
                return;
            }

            const respostaAssociada = respostasMap.get(registro.id);

            const li = document.createElement("li");
            li.classList.add("desabafo-card");
            li.dataset.id = registro.id;

            if (respostaAssociada) {
                temDesabafosRespondidos = true;
                li.innerHTML = `
                    <h3>${registro.titulo || 'Sem título'} (${registro.data})</h3>
                    <p>${registro.conteudo}</p>
                    <div class="resposta-existente">
                        <strong>Resposta do Especialista (${respostaAssociada.dataResposta || 'Data Desconhecida'}):</strong>
                        <p>${respostaAssociada.texto}</p>
                    </div>
                `;
                listaDesabafosRespondidos.appendChild(li);
            } else {
                temDesabafosPendentes = true;
                li.innerHTML = `
                    <h3>${registro.titulo || 'Sem título'} (${registro.data})</h3>
                    <p>${registro.conteudo}</p>
                    <div class="resposta-section">
                        <textarea id="resposta-registro-${registro.id}" placeholder="Escreva sua resposta aqui..."></textarea>
                        <button data-id="${registro.id}" class="btn-responder">Responder</button>
                    </div>
                `;
                listaDesabafosPendentes.appendChild(li);
            }
        });

        if (!temDesabafosPendentes) {
            listaDesabafosPendentes.innerHTML = '<li>Nenhum desabafo pendente no momento.</li>';
        }
        if (!temDesabafosRespondidos) {
            listaDesabafosRespondidos.innerHTML = '<li>Nenhum desabafo respondido ainda.</li>';
        }

        document.querySelectorAll('#lista-desabafos-pendentes .btn-responder').forEach(button => {
            button.addEventListener('click', (event) => {
                const registroId = event.target.dataset.id;
                const textarea = document.getElementById(`resposta-registro-${registroId}`);
                const respostaTexto = textarea.value.trim();

                if (respostaTexto) {
                    enviarResposta(registroId, respostaTexto);
                } else {
                    alert("Por favor, escreva uma resposta antes de enviar.");
                }
            });
        });

    } catch (error) {
        console.error("Erro geral ao carregar desabafos ou respostas:", error);
        listaDesabafosPendentes.innerHTML = '<li>Erro ao carregar desabafos pendentes.</li>';
        listaDesabafosRespondidos.innerHTML = '<li>Erro ao carregar desabafos respondidos.</li>';
    }
}

async function enviarResposta(registroId, respostaTexto) {
    const novaResposta = {
        registroId: parseInt(registroId),
        dataResposta: new Date().toISOString().split('T')[0],
        texto: respostaTexto
    };

    try {
        const response = await fetch(`http://localhost:3000/respostas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaResposta)
        });

        if (response.ok) {
            mostrarPopupSucesso();
            setTimeout(() => {
                carregarDesabafosParaProfissional();
            }, 1500);
        } else {
            const errorText = await response.text();
            throw new Error(`Erro ao enviar resposta: ${response.statusText} - ${errorText}`);
        }
    } catch (error) {
        console.error('Erro ao enviar resposta:', error);
        alert('Erro ao enviar resposta. Verifique o console para mais detalhes.');
    }
}

function mostrarPopupSucesso() {
    let popup = document.getElementById('success-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'success-popup';
        document.body.appendChild(popup);
    }
    popup.innerHTML = '&#10003; Sucesso!';

    popup.style.display = 'block';
    popup.style.opacity = '1';

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 500);
    }, 1000);
}