import { requireLogin, requireAdmin } from "./auth.js";

async function loadView(file) {
  const res = await fetch(file);
  return await res.text();
}

export async function router() {
  const route = window.location.hash || "#/login";
  const app = document.getElementById("app");

  switch (route) {

    case "#/login":
      app.innerHTML = await loadView("./views/login.html");
      break;

    case "#/home":
      requireLogin();
      app.innerHTML = await loadView("./views/home.html");
      break;

    case "#/admin":
      requireLogin();
      requireAdmin();
      app.innerHTML = await loadView("./views/admin.html");
      break;

    default:
      app.innerHTML = "<h2>404 - Halaman tidak ditemukan</h2>";
  }
}

// router on load + on hash change
window.addEventListener("hashchange", router);
window.addEventListener("load", router);
