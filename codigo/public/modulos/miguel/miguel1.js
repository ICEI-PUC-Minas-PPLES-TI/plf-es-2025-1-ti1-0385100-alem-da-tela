let phrases = {};

fetch('frases.json')
  .then(response => response.json())
  .then(data => {
    phrases = data;
  })
  .catch(error => {
    console.error('Erro ao carregar frases:', error);
  });

const selectEl = document.getElementById("emotion");
const phraseEl = document.getElementById("phrase");
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
  if (phrases[emotion]) {
    phraseEl.textContent = randomItem(phrases[emotion]);
  } else {
    phraseEl.textContent = "Nenhuma frase encontrada para essa emoção.";
  }
}

btnPhrase.addEventListener("click", showPhrase);
selectEl.addEventListener("change", () => phraseEl.textContent = "");
