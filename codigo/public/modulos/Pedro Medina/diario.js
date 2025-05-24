const hoje = new Date().toISOString().split("T")[0];
  document.getElementById("data-registro").value = hoje;

const textarea = document.getElementById('registro');

textarea.addEventListener('input', function() {
  this.style.height = 'auto';            // reseta a altura
  this.style.height = this.scrollHeight + 'px'; // ajusta para o conteúdo
});

const form = document.getElementById('diarioForm');

form.addEventListener('submit', function(event) {
  event.preventDefault(); // evita recarregar a página

  // pega os dados do form
  const data = document.getElementById('data').value;
  const titulo = document.getElementById('titulo').value;
  const conteudo = document.getElementById('conteudo').value;
  const privado = document.getElementById('privado').checked;

  // cria o objeto que vai ser salvo
  const novoRegistro = {
    data,
    titulo,
    conteudo,
    privado,
    profissional
  };

  // envia para o json-server via POST
  fetch('http://localhost:3000/registros', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(novoRegistro)
  })
  .then(response => response.json())
  .then(data => {
    alert('Registro salvo com sucesso!');
    form.reset(); // limpa o formulário
  })
  .catch(error => {
    alert('Erro ao salvar registro.');
    console.error(error);
  });
});