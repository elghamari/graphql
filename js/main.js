import { renderLogin } from "./components/loginUI.js";
import { renderProfile } from "./components/profileUI.js"; // 1. Zidna l-import d l-profile

export function initApp() {
  const app = document.getElementById("app");
  const token = localStorage.getItem("jwt");

  if (!token) {
    app.innerHTML = "";
    renderLogin();
  } else {
    app.innerHTML = "";
    renderProfile();
  }
}

document.addEventListener("DOMContentLoaded", initApp);
