 document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recursoId = urlParams.get("id");

    if (!recursoId) {
      document.body.innerHTML = "<h2>ID inválido</h2>";
      return;
    }

    // Aqui você muda para a URL do seu JSON Server (por padrão: http://localhost:3000)
    fetch(`http://localhost:3000/recursos/${recursoId}`)
      .then((res) => res.json())
      .then((dados) => {
        if (dados.length === 0) {
          document.body.innerHTML = "<h2>Recurso não encontrado</h2>";
          return;
        }

        const recurso = dados[0];

        // Agora monta dinamicamente o conteúdo
        const container = document.getElementById("detalhes-container");
        container.innerHTML = `
          <h2>${recurso.titulo}</h2>
          <img src="${recurso.imagem}" alt="${recurso.titulo}" style="max-width: 300px;" />
          <p>${recurso.descricao}</p>
          <a href="index.html">Voltar</a>
        `;
      })
      .catch((error) => {
        console.error("Erro ao buscar o recurso:", error);
        document.body.innerHTML = "<h2>Erro ao carregar os dados</h2>";
      });
  });