

const botaoEnviar = document.getElementById('botaoEnviar');
const caixa1 = document.getElementById('caixa1');

const botaoComentarios = document.querySelector('.comentarios');
const caixaMensagem2 = document.querySelector('.caixaMensagem2');
const botaoEnviar2 = document.getElementById('botaoEnviar2');
const caixa2 = document.getElementById('caixa2');
const respostasDiv = document.getElementById('respostas');


botaoEnviar.addEventListener('click', () => {
  const texto = caixa1.value.trim();
  if (texto === "") {
    alert("Digite algo.");
    return;
  }

  fetch('http://localhost:3000/comentarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo: "mensagem", texto: texto, data: new Date().toISOString() })
  })
    .then(res => res.json())
    .then(() => {
      alert('Mensagem enviada!');
      caixa1.value = "";
    })
    .catch(err => console.error(err));
});


botaoComentarios.addEventListener('click', () => {
  caixaMensagem2.classList.toggle('show');
  botaoEnviar2.classList.toggle('show');
  respostasDiv.classList.toggle('show');
  carregarRespostas(); 
});


botaoEnviar2.addEventListener('click', () => {
  const texto = caixa2.value.trim();
  if (texto === "") {
    alert("Digite uma resposta.");
    return;
  }

  fetch('http://localhost:3000/comentarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo: "resposta", texto: texto, data: new Date().toISOString() })
  })
    .then(res => res.json())
    .then((data) => {
      mostrarResposta(data.texto);
      caixa2.value = "";
    })
    .catch(err => console.error(err));
});


function mostrarResposta(texto) {
  const p = document.createElement('p');
  p.textContent = "Resposta: " + texto;
  respostasDiv.appendChild(p);
}


function carregarRespostas() {
  fetch('http://localhost:3000/comentarios')
    .then(res => res.json())
    .then(data => {
      respostasDiv.innerHTML = ""; 
      data
        .filter(item => item.tipo === "resposta")
        .forEach(item => mostrarResposta(item.texto));
    });
}

    fetch('http://localhost:3000/comentarios/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ texto: 'Comentário atualizado!' })
})
.then(res => res.json())
.then(data => console.log(data));
const phrases = {
  triste: [ "Tudo bem sentir-se triste às vezes.",
            "Permita-se chorar.",
            "Mesmo nos dias nublados, o sol ainda está lá." ],
  feliz:  [ "Compartilhe sua alegria!",
            "A felicidade é ainda maior quando dividida.",
            "Sorria, você está vivo!" ],
  aflito: [ "Respire fundo: um passo de cada vez.",
            "Você é mais forte do que pensa.",
            "Procure apoio, você não está só." ],
  ansioso:[ "Traga sua atenção para o presente.",
            "A ansiedade chega e também vai.",
            "Faça uma pausa; seu corpo agradece." ],
  nervoso:[ "Solte os ombros e alongue o pescoço.",
            "Transforme a energia nervosa em ação positiva.",
            "Você já superou desafios antes." ],
  angustiado:[ "Seja gentil consigo mesmo.",
               "Falar com alguém ajuda.",
               "Você está fazendo o melhor que pode." ]
};

const selectEl  = document.getElementById("emotion");
const phraseEl  = document.getElementById("phrase");
const btnPhrase = document.getElementById("showPhraseBtn");

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showPhrase() {
  const emotion = selectEl.value;
  if (!emotion) {
    phraseEl.textContent = "Por favor, escolha uma emoção.";
    return;
  }
  phraseEl.textContent = randomItem(phrases[emotion]);
}

btnPhrase.addEventListener("click", showPhrase);
selectEl.addEventListener("change", () => phraseEl.textContent = "");