const EMAIL_DESTINO = "seu-email@exemplo.com";

const body = document.body;
const themeButton = document.querySelector(".theme-toggle");
let savedTheme;
try { savedTheme = localStorage.getItem("portfolio-theme"); } catch (_) { /* Tema funciona mesmo sem armazenamento. */ }
if (savedTheme === "light") body.classList.add("light");

function updateThemeIcon() {
  themeButton.textContent = body.classList.contains("light") ? "☾" : "☀";
}
updateThemeIcon();
themeButton.addEventListener("click", () => {
  body.classList.toggle("light");
  try { localStorage.setItem("portfolio-theme", body.classList.contains("light") ? "light" : "dark"); } catch (_) { /* Preferência apenas nesta sessão. */ }
  updateThemeIcon();
});

const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-links");
menuButton.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});
menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
}));

document.querySelectorAll(".filter").forEach(button => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll(".filter").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    const selected = button.dataset.filter;
    document.querySelectorAll(".project-card").forEach(card => {
      card.classList.toggle("hidden", selected !== "todos" && !card.dataset.category.includes(selected));
    });
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

document.querySelector("#contact-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const status = document.querySelector(".form-status");
  if (EMAIL_DESTINO === "seu-email@exemplo.com") {
    status.textContent = "Configure o e-mail de destino no arquivo script.js antes de publicar.";
    return;
  }
  const subject = encodeURIComponent(`Contato pelo portfólio — ${form.get("name")}`);
  const message = encodeURIComponent(`Nome: ${form.get("name")}\nE-mail: ${form.get("email")}\n\n${form.get("message")}`);
  window.location.href = `mailto:${EMAIL_DESTINO}?subject=${subject}&body=${message}`;
  status.textContent = "Abrindo seu aplicativo de e-mail...";
});
