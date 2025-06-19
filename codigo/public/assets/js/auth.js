const formElement = document.getElementById("auth-form");

if (formElement) {
  class AuthApp {
    constructor() {
      this.form = formElement;
      this.isLoginPage = document.title.toLowerCase().includes("login");
      this.init();
    }

    init() {
      this.bindEvents();
    }

    bindEvents() {
      this.form.addEventListener("submit", (e) => {
        if (this.isLoginPage) {
          this.handleLogin(e);
        } else {
          this.handleRegister(e);
        }
      });

      if (!this.isLoginPage) {
        const confirmPassword = document.getElementById("confirm-password");
        if (confirmPassword) {
          confirmPassword.addEventListener("input", () =>
            this.validatePasswordMatch()
          );
        }
      }
    }

    async handleLogin(e) {
      e.preventDefault();

      const formData = new FormData(this.form);
      const email = formData.get("email");
      const password = formData.get("password");
      const submitBtn = this.form.querySelector('button[type="submit"]');

      if (!this.validateEmail(email)) {
        this.showMessage("Por favor, insira um e-mail válido.", "error");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find(
        (u) => u.email === email && u.password === password
      );

      this.setLoading(submitBtn, true, "Entrando...");

      setTimeout(() => {
        if (existingUser) {
          localStorage.setItem("loggedUser", JSON.stringify(existingUser));
          this.showMessage("Login realizado com sucesso!", "success");

          setTimeout(() => {
            if (existingUser.tipo === "especialista") {
              window.location.href = "modulos/diario/desabafos.html";
            } else {
window.location.href = "modulos/home/home.html";



            }
          }, 1500);
        } else {
          this.showMessage("E-mail ou senha incorretos.", "error");
        }

        this.setLoading(submitBtn, false, "Entrar");
      }, 1000);
    }

    async handleRegister(e) {
      e.preventDefault();

      const formData = new FormData(this.form);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const confirmPassword = formData.get("confirm-password");
      const tipo = formData.get("tipo");
      const terms = formData.get("terms");
      const submitBtn = this.form.querySelector('button[type="submit"]');

      if (!name?.trim()) {
        this.showMessage("Por favor, insira seu nome.", "error");
        return;
      }

      if (!this.validateEmail(email)) {
        this.showMessage("Por favor, insira um e-mail válido.", "error");
        return;
      }

      if (password.length < 6) {
        this.showMessage("A senha deve ter pelo menos 6 caracteres.", "error");
        return;
      }

      if (password !== confirmPassword) {
        this.showMessage("As senhas não coincidem.", "error");
        return;
      }

      if (!terms) {
        this.showMessage("Você deve aceitar os termos de uso.", "error");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const emailExists = users.some((u) => u.email === email);

      if (emailExists) {
        this.showMessage("Este e-mail já está cadastrado.", "error");
        return;
      }

      users.push({ name, email, password, tipo });
      localStorage.setItem("users", JSON.stringify(users));

      this.setLoading(submitBtn, true, "Criando conta...");

      setTimeout(() => {
        this.showMessage(
          "Conta criada com sucesso! Redirecionando...",
          "success"
        );

        setTimeout(() => {
          window.location.href = "../../index.html";
        }, 1500);

        this.setLoading(submitBtn, false, "Criar conta");
      }, 1000);
    }

    validatePasswordMatch() {
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password");

      if (confirmPassword.value && password !== confirmPassword.value) {
        confirmPassword.style.borderColor = "var(--danger-color)";
      } else {
        confirmPassword.style.borderColor = "";
      }
    }

    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    setLoading(button, isLoading, text) {
      button.disabled = isLoading;
      button.textContent = text;
    }

    showMessage(message, type) {
      this.clearMessages();

      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${type}-message`;
      messageDiv.textContent = message;

      this.form.insertBefore(messageDiv, this.form.querySelector("button"));
    }

    clearMessages() {
      document.querySelectorAll(".message").forEach((el) => el.remove());
    }
  }

  new AuthApp();
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("btn-logout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedUser");
   window.location.href = "../../index.html";
    });
  }
});
