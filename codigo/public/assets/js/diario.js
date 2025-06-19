class DiarioApp {
  constructor() {
    this.apiUrl = "http://localhost:3000/diario";
    this.registros = [];
    this.registroAtual = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.setDataAtual();
    this.carregarRegistros();
  }

  bindEvents() {
    document.getElementById("btn-novo").onclick = () => this.novoRegistro();
    document.getElementById("form-diario").onsubmit = (e) =>
      this.salvarRegistro(e);
    document.getElementById("btn-cancelar").onclick = () =>
      this.cancelarEdicao();
  }

  setDataAtual() {
    const hoje = new Date().toISOString().split("T")[0];
    document.getElementById("data").value = hoje;
  }

  async carregarRegistros() {
    const container = document.getElementById("lista-registros");

    try {
      const response = await fetch(this.apiUrl);
      this.registros = await response.json();

      if (!this.registros.length) {
        container.innerHTML =
          '<div class="empty-state">Nenhum registro ainda.<br>Comece escrevendo!</div>';
        return;
      }

      this.registros.sort((a, b) => new Date(b.data) - new Date(a.data));
      container.innerHTML = this.registros
        .map((registro) => this.criarItem(registro))
        .join("");

      container.querySelectorAll(".registro-item").forEach((item) => {
        item.onclick = () => {
          const id = Number.parseInt(item.dataset.id);
          this.visualizarRegistro(id);
        };
      });
    } catch (error) {
      console.error("Erro ao carregar registros:", error);
      container.innerHTML =
        '<div class="empty-state">Erro ao carregar registros.</div>';
    }
  }

  criarItem(registro) {
    const data = new Date(registro.data).toLocaleDateString("pt-BR");
    const titulo = registro.titulo || "Sem título";
    const preview =
      registro.texto.substring(0, 50) +
      (registro.texto.length > 50 ? "..." : "");

    return `
      <div class="registro-item" data-id="${registro.id}">
        <div class="registro-titulo">${titulo}</div>
        <div class="registro-data">${data}</div>
        <div class="registro-preview">${preview}</div>
      </div>
    `;
  }

  novoRegistro() {
    this.registroAtual = null;
    this.limparFormulario();
    this.setDataAtual();
    this.removerSelecaoAtiva();
  }

  visualizarRegistro(id) {
    const registro = this.registros.find((r) => r.id === id);
    if (!registro) return;

    this.registroAtual = registro;
    this.preencherFormulario(registro);
    this.marcarComoAtivo(id);
  }

  preencherFormulario(registro) {
    document.getElementById("data").value = registro.data;
    document.getElementById("titulo").value = registro.titulo || "";
    document.getElementById("texto").value = registro.texto;
    document.getElementById("privado").checked = registro.privado === "sim";
    document.getElementById("profissional").checked =
      registro.profissional === "sim";
  }

  limparFormulario() {
    document.getElementById("form-diario").reset();
    this.setDataAtual();
  }

  marcarComoAtivo(id) {
    this.removerSelecaoAtiva();
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) item.classList.add("active");
  }

  removerSelecaoAtiva() {
    document.querySelectorAll(".registro-item").forEach((item) => {
      item.classList.remove("active");
    });
  }

  async salvarRegistro(e) {
    e.preventDefault();

    const registro = {
      data: document.getElementById("data").value,
      titulo: document.getElementById("titulo").value,
      texto: document.getElementById("texto").value,
      privado: document.getElementById("privado").checked ? "sim" : "nao",
      profissional: document.getElementById("profissional").checked
        ? "sim"
        : "nao",
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Salvando...";

    try {
      let response;
      if (this.registroAtual) {
        response = await fetch(`${this.apiUrl}/${this.registroAtual.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registro),
        });
      } else {
        response = await fetch(this.apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registro),
        });
      }

      if (!response.ok) throw new Error("Erro ao salvar");

      this.showAlert("Registro salvo com sucesso!", "success");
      this.carregarRegistros();

      if (registro.profissional === "sim") {
        console.log("Enviando também para desabafos...");
        await this.enviarParaProfissional(registro);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      this.showAlert("Erro ao salvar registro. Tente novamente.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Salvar Registro";
    }
  }

  async enviarParaProfissional(registro) {
    try {
      const response = await fetch("http://localhost:3000/desabafos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: registro.titulo || "Registro do diário",
          texto: registro.texto,
          data: registro.data,
          status: "pendente",
        }),
      });

      if (!response.ok) throw new Error("Erro ao enviar para desabafos");
      console.log("✅ Enviado para desabafos com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar para profissional:", error);
    }
  }

  cancelarEdicao() {
    this.registroAtual = null;
    this.limparFormulario();
    this.removerSelecaoAtiva();
  }

  showAlert(message, type) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
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
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
  }
}

new DiarioApp();
