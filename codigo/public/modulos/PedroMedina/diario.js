// Define a data atual no campo de data
document.getElementById("data-registro").value = new Date().toISOString().split("T")[0];

// Ajusta o tamanho do textarea automaticamente
const textarea = document.getElementById('registro');
textarea.addEventListener('input', function () {
  this.style.height = 'auto'; // Reseta a altura
  this.style.height = this.scrollHeight + 'px'; // Ajusta para o conteúdo
});

// Captura o botão de envio
const btnEnviar = document.getElementById("btn-enviar");

btnEnviar.addEventListener("click", () => {
  // Captura os valores do formulário
  const dataRegistro = document.getElementById("data-registro").value;
  const tituloRegistro = document.getElementById("titulo-registro").value;
  const registro = document.getElementById("registro").value;
  const privado = document.querySelector('input[name="privado"]:checked')?.value === "sim";
  const profissional = document.querySelector('input[name="profissional"]:checked')?.value === "sim";

  // Monta o objeto a ser enviado
  const novoRegistro = {
    data: dataRegistro,
    titulo: tituloRegistro || "Sem título", // Valor padrão
    conteudo: registro,
    privado: privado,
    profissional: profissional,
  };

  // Envia os dados para o json-server
  fetch("http://localhost:3000/registros", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(novoRegistro),
  })
    .then((response) => {
      if (response.ok) {
        alert("Registro enviado com sucesso!");
        // Limpa o formulário
        document.getElementById("data-registro").value = new Date().toISOString().split("T")[0];
        document.getElementById("titulo-registro").value = "";
        document.getElementById("registro").value = "";
        document.querySelectorAll('input[name="privado"]').forEach((el) => (el.checked = false));
        document.querySelectorAll('input[name="profissional"]').forEach((el) => (el.checked = false));
      } else {
        alert("Erro ao enviar registro.");
      }
    })
    .catch((error) => {
      console.error("Erro ao enviar registro:", error);
      alert("Erro ao enviar registro.");
    });
});
