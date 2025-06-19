function showContent(contentId) {
  document
    .querySelectorAll(".content-area")
    .forEach((el) => el.classList.add("hidden"));
  const target = document.getElementById(contentId + "-content");
  if (target) {
    target.classList.remove("hidden");
    target.scrollIntoView({ behavior: "smooth" });
  }
}
const welcomeEl = document.getElementById("welcome-message");
const user = JSON.parse(localStorage.getItem("loggedUser"));

if (welcomeEl && user?.name) {
  const firstName = user.name.split(" ")[0];
  welcomeEl.textContent = `Boas vindas, ${firstName}!`;
}

function openModal() {
  document.getElementById("modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
