class RotinasApp {
  constructor() {
    this.apiUrl = "http://localhost:3000/rotina";
    this.editandoId = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.carregarRotinas();
  }

  bindEvents() {
    document.getElementById("btn-nova").onclick = () => this.abrirModal();
    document.getElementById("btn-fechar").onclick = () => this.fecharModal();
    document.getElementById("btn-cancelar").onclick = () => this.fecharModal();
    document.getElementById("form-rotina").onsubmit = (e) =>
      this.salvarRotina(e);
    document.getElementById("btn-back").onclick = () => {
      window.location.href = "../../modulos/home/home.html";
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.fecharModal();
    });

    document.getElementById("modal").onclick = (e) => {
      if (e.target.id === "modal") this.fecharModal();
    };
  }

  async carregarRotinas() {
    const container = document.getElementById("rotinas-lista");

    try {
      const response = await fetch(this.apiUrl);
      const rotinas = await response.json();

      if (!rotinas.length) {
        container.innerHTML =
          '<div class="empty-state">Nenhuma rotina cadastrada ainda.<br>Clique em "Nova Rotina" para começar!</div>';
        return;
      }

      rotinas.sort((a, b) => a.horario.localeCompare(b.horario));
      container.innerHTML = rotinas
        .map((rotina) => this.criarCard(rotina))
        .join("");
    } catch (error) {
      container.innerHTML =
        '<div class="empty-state">Erro ao carregar rotinas. Verifique se o servidor está rodando.</div>';
    }
  }

  criarCard(rotina) {
    return `
      <article class="rotina-card">
        <div class="rotina-header">
          <div class="rotina-info">
            <h3>${rotina.nome}</h3>
            <div class="rotina-categoria">${rotina.categoria}</div>
          </div>
          <div class="rotina-horario">${rotina.horario}</div>
        </div>
        <div class="rotina-actions">
          <button class="btn-icon" onclick="app.editarRotina(${rotina.id})">Editar</button>
          <button class="btn-icon danger" onclick="app.excluirRotina(${rotina.id})">Excluir</button>
        </div>
      </article>
    `;
  }

  abrirModal(rotina = null) {
    const modal = document.getElementById("modal");
    const title = document.getElementById("modal-title");
    const form = document.getElementById("form-rotina");

    if (rotina) {
      title.textContent = "Editar Rotina";
      document.getElementById("nome").value = rotina.nome;
      document.getElementById("horario").value = rotina.horario;
      document.getElementById("categoria").value = rotina.categoria;
      this.editandoId = rotina.id;
    } else {
      title.textContent = "Nova Rotina";
      form.reset();
      this.editandoId = null;
    }

    modal.classList.remove("hidden");
    document.getElementById("nome").focus();
    document.body.style.overflow = "hidden";
  }

  fecharModal() {
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("form-rotina").reset();
    this.editandoId = null;
    document.body.style.overflow = "";
  }

  async salvarRotina(e) {
    e.preventDefault();

    const rotina = {
      nome: document.getElementById("nome").value.trim(),
      horario: document.getElementById("horario").value,
      categoria: document.getElementById("categoria").value,
    };

    try {
     const url = this.editandoId
  ? `${this.apiUrl}/${this.editandoId}`
  : this.apiUrl;

      const method = this.editandoId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rotina),
      });

      if (!response.ok) throw new Error("Erro ao salvar");

      this.fecharModal();
      this.carregarRotinas();
    } catch (error) {
      alert("Erro ao salvar rotina. Tente novamente.");
    }
  }

  async editarRotina(id) {
    try {
   const response = await fetch(`${this.apiUrl}/${id}`);

      const rotina = await response.json();
      this.abrirModal(rotina);
    } catch (error) {
      alert("Erro ao carregar dados da rotina.");
    }
  }

  async excluirRotina(id) {
    if (!confirm("Deseja realmente excluir esta rotina?")) return;

    try {
     const response = await fetch(`${this.apiUrl}/${id}`, {
  method: "DELETE",
});

      if (!response.ok) throw new Error("Erro ao excluir");
      this.carregarRotinas();
    } catch (error) {
      alert("Erro ao excluir rotina.");
    }
  }
}

const app = new RotinasApp();