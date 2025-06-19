class ComunidadeApp {
  constructor() {
    this.apiUrl = "http://localhost:3000/comentarios";
    this.currentView = "nova-mensagem";
    this.currentMessageId = null;
    this.allComments = [];
    this.init();
  }

  init() {
    this.bindEvents();
    this.showSection("nova-mensagem");
  }

  bindEvents() {
    document.getElementById("btn-nova").onclick = () =>
      this.showSection("nova-mensagem");
    document.getElementById("btn-todas").onclick = () => {
      this.showSection("todas-mensagens");
      this.loadAll();
    };
    document.getElementById("btn-atualizar").onclick = () => this.loadAll();
    document.getElementById("form-mensagem").onsubmit = (e) =>
      this.sendMessage(e);
    document.getElementById("resposta-form").onsubmit = (e) =>
      this.sendReply(e);
    document.getElementById("btn-cancelar").onclick = () => this.hideReply();
    document.getElementById("btn-back").onclick = () => {
  window.location.href = "../../modulos/home/home.html";

    };
  }

  showSection(section) {
    document
      .querySelectorAll(".card")
      .forEach((el) => el.classList.add("hidden"));
    document.getElementById(section).classList.remove("hidden");

    document
      .querySelectorAll(".btn-nav")
      .forEach((btn) => btn.classList.remove("active"));
    if (section === "nova-mensagem") {
      document.getElementById("btn-nova").classList.add("active");
    } else {
      document.getElementById("btn-todas").classList.add("active");
    }
  }

  async sendMessage(e) {
    e.preventDefault();
    const textarea = document.getElementById("texto-mensagem");
    const text = textarea.value.trim();
    const btn = e.target.querySelector("button");

    if (!text) {
      this.showMessage("Escreva uma mensagem", "error");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Enviando...";

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "mensagem",
          texto: text,
          data: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Erro ao enviar");

      this.showMessage("Mensagem enviada!", "success");
      textarea.value = "";
      this.showReply();
    } catch (error) {
      this.showMessage("Erro ao enviar. Tente novamente.", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Enviar Mensagem";
    }
  }

  async sendReply(e) {
    e.preventDefault();
    const textarea = document.getElementById("texto-resposta");
    const text = textarea.value.trim();
    const btn = e.target.querySelector("button");

    if (!text || !this.currentMessageId) return;

    btn.disabled = true;
    btn.textContent = "Enviando...";

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "resposta",
          texto: text,
          data: new Date().toISOString(),
          idMensagem: this.currentMessageId,
        }),
      });

      if (!response.ok) throw new Error("Erro");

      const data = await response.json();
      textarea.value = "";
      this.loadAll();
    } catch (error) {
      console.error(error);
    } finally {
      btn.disabled = false;
      btn.textContent = "Enviar Resposta";
    }
  }

  showReply(messageId = null) {
    this.currentMessageId = messageId;
    document.getElementById("form-resposta").classList.remove("hidden");
  }

  hideReply() {
    document.getElementById("form-resposta").classList.add("hidden");
    this.currentMessageId = null;
  }

  async loadAll() {
    const container = document.getElementById("lista-comentarios");
    container.innerHTML = '<div class="loading">Carregando...</div>';

    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();

      if (!data.length) {
        container.innerHTML =
          '<div class="empty-state">Nenhuma mensagem ainda</div>';
        return;
      }

      this.allComments = data;
      const mensagens = data.filter((c) => c.tipo === "mensagem");

      mensagens.sort((a, b) => new Date(b.data) - new Date(a.data));
      container.innerHTML = mensagens
        .map((item) => this.createCommentItem(item))
        .join("");
    } catch (error) {
      container.innerHTML = '<div class="error">Erro ao carregar</div>';
    }
  }

  createCommentItem(item) {
    const date = new Date(item.data).toLocaleString("pt-BR");

    const respostas = this.allComments.filter(
      (r) => r.tipo === "resposta" && r.idMensagem === item.id
    );

    const respostasHTML = respostas
      .map((r) => {
        const rDate = new Date(r.data).toLocaleString("pt-BR");
        return `
          <div class="resposta-item">
            <div class="item-header">
              <span class="item-tipo">Resposta</span>
              <span class="item-data">${rDate}</span>
            </div>
            <div class="item-texto">${r.texto}</div>
          </div>
        `;
      })
      .join("");

    return `
      <div class="comentario-item">
        <div class="item-header">
          <span class="item-tipo">Mensagem</span>
          <span class="item-data">${date}</span>
        </div>
        <div class="item-texto">${item.texto}</div>
        <button class="btn-responder" onclick="app.showReply(${item.id})">Responder</button>
        ${respostasHTML}
      </div>
    `;
  }

  showMessage(message, type) {
    const existing = document.querySelector(".message");
    if (existing) existing.remove();

    const div = document.createElement("div");
    div.className = `message ${type}`;
    div.textContent = message;

    const form = document.getElementById("form-mensagem");
    form.insertBefore(div, form.querySelector("button"));

    setTimeout(() => div.remove(), 3000);
  }
}

const app = new ComunidadeApp();
