class DesabafosApp {
  constructor() {
    this.apiUrl = "http://localhost:3000/desabafos";
    this.currentView = "pendentes";
    this.desabafoAtual = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.carregarPendentes();
  }

  bindEvents() {
    document
      .getElementById("btn-pendentes")
      .addEventListener("click", () => this.mostrarPendentes());
    document
      .getElementById("btn-respondidos")
      .addEventListener("click", () => this.mostrarRespondidos());

    document
      .getElementById("btn-atualizar-pendentes")
      .addEventListener("click", () => this.carregarPendentes());
    document
      .getElementById("btn-atualizar-respondidos")
      .addEventListener("click", () => this.carregarRespondidos());

    document
      .getElementById("btn-fechar-modal")
      .addEventListener("click", () => this.fecharModal());
    document
      .getElementById("btn-cancelar-resposta")
      .addEventListener("click", () => this.fecharModal());
    document
      .getElementById("form-resposta")
      .addEventListener("submit", (e) => this.enviarResposta(e));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.fecharModal();
    });
  }

  mostrarPendentes() {
    this.currentView = "pendentes";
    this.atualizarNavegacao();
    document.getElementById("secao-pendentes").classList.remove("hidden");
    document.getElementById("secao-respondidos").classList.add("hidden");
    this.carregarPendentes();
  }

  mostrarRespondidos() {
    this.currentView = "respondidos";
    this.atualizarNavegacao();
    document.getElementById("secao-respondidos").classList.remove("hidden");
    document.getElementById("secao-pendentes").classList.add("hidden");
    this.carregarRespondidos();
  }

  atualizarNavegacao() {
    document
      .querySelectorAll(".nav-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document.getElementById(`btn-${this.currentView}`).classList.add("active");
  }

  async carregarPendentes() {
    const container = document.getElementById("lista-desabafos-pendentes");
    container.innerHTML =
      '<div class="loading">Carregando desabafos pendentes...</div>';

    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();

      const pendentes = data.filter((item) => item.status === "pendente");

      if (pendentes.length === 0) {
        container.innerHTML =
          '<div class="empty-state">Nenhum desabafo pendente no momento.</div>';
        return;
      }

      container.innerHTML = pendentes
        .map((d) => this.criarItemDesabafo(d, true))
        .join("");

      document.querySelectorAll(".btn-responder").forEach((btn) => {
        const id = btn.getAttribute("data-id");
        btn.addEventListener(
          "click",
          () => this.abrirModalResposta(Number(id)) // issue
        );
      });
    } catch (error) {
      console.error("Erro ao carregar pendentes:", error);
      container.innerHTML =
        '<div class="empty-state">Erro ao carregar desabafos pendentes.</div>';
    }
  }

  async carregarRespondidos() {
    const container = document.getElementById("lista-desabafos-respondidos");
    container.innerHTML =
      '<div class="loading">Carregando desabafos respondidos...</div>';

    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();

      const respondidos = data.filter((item) => item.status === "respondido");

      if (respondidos.length === 0) {
        container.innerHTML =
          '<div class="empty-state">Nenhum desabafo respondido ainda.</div>';
        return;
      }

      container.innerHTML = respondidos
        .map((d) => this.criarItemDesabafo(d, false))
        .join("");
    } catch (error) {
      console.error("Erro ao carregar respondidos:", error);
      container.innerHTML =
        '<div class="empty-state">Erro ao carregar desabafos respondidos.</div>';
    }
  }

  criarItemDesabafo(desabafo, mostrarBotao = true) {
    const data = new Date(desabafo.data).toLocaleString("pt-BR");
    const statusClass =
      desabafo.status === "pendente" ? "status-pendente" : "status-respondido";
    const statusText =
      desabafo.status === "pendente" ? "Pendente" : "Respondido";

    return `
      <div class="desabafo-item">
        <div class="desabafo-header">
          <div class="desabafo-info">
            <h3>${desabafo.titulo}</h3>
            <div class="desabafo-data">${data}</div>
          </div>
          <div class="desabafo-status ${statusClass}">${statusText}</div>
        </div>
        <div class="desabafo-texto">${desabafo.texto}</div>
        ${
          mostrarBotao
            ? `<div class="desabafo-actions">
                 <button class="btn-responder" data-id="${desabafo.id}">
                   Responder
                 </button>
               </div>`
            : desabafo.resposta
            ? `<div class="desabafo-resposta">
                 <strong>Resposta:</strong> ${desabafo.resposta}
               </div>`
            : ""
        }
      </div>
    `;
  }

  async abrirModalResposta(id) {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`); // issue
      if (!response.ok) throw new Error("Desabafo não encontrado");

      this.desabafoAtual = await response.json();

      document.getElementById("desabafo-original").innerHTML = `
        <h4>${this.desabafoAtual.titulo}</h4>
        <p>${this.desabafoAtual.texto}</p>
        <small>Data: ${new Date(this.desabafoAtual.data).toLocaleString(
          "pt-BR"
        )}</small>
      `;

      document.getElementById("modal-resposta").classList.remove("hidden");
      document.getElementById("resposta-texto").focus();
    } catch (error) {
      console.error("Erro ao carregar desabafo:", error);
      this.showAlert("Erro ao carregar desabafo.", "error");
    }
  }

  fecharModal() {
    document.getElementById("modal-resposta").classList.add("hidden");
    document.getElementById("form-resposta").reset();
    this.desabafoAtual = null;
  }

  async enviarResposta(e) {
    e.preventDefault();

    const resposta = document.getElementById("resposta-texto").value.trim();
    if (!resposta) {
      this.showAlert("Por favor, escreva uma resposta.", "error");
      return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    this.setLoading(submitBtn, true);

    try {
      const response = await fetch(`${this.apiUrl}/${this.desabafoAtual.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...this.desabafoAtual,
          resposta,
          status: "respondido",
          dataResposta: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Erro ao enviar resposta");

      this.showAlert("Resposta enviada com sucesso!", "success");
      this.fecharModal();
      this.carregarPendentes();
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      this.showAlert("Erro ao enviar resposta. Tente novamente.", "error");
    } finally {
      this.setLoading(submitBtn, false);
    }
  }

  setLoading(button, isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? "Enviando..." : "Enviar Resposta";
  }

  showAlert(message, type) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      color: white;
      font-weight: 500;
      z-index: 1000;
      background-color: ${
        type === "success" ? "var(--success-color)" : "var(--danger-color)"
      };
    `;
    alert.textContent = message;

    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
  }
}

const app = new DesabafosApp();
