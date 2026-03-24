import { loginUser } from "../api/auth.js";
import { showToast } from "../utils/toast.js";
import { initApp } from "../main.js";

export const FormLogin = `
    <div class="login-container">
        <div class="login-card">
            <div class="login-logo">
                <div class="inner-square"></div>
            </div>
            <h1 class="login-title">SIGN IN</h1>
            <p class="login-subtitle">ENTER YOUR ZONE01 CREDENTIALS</p>
            
            <form id="zone-login-form" class="login-form">
                <div class="input-group">
                    <label for="username">username</label>
                    <input type="text" id="username" required>
                </div>
                
                <div class="input-group">
                    <label for="password">password</label>
                    <div class="password-wrapper">
                        <input type="password" id="password" required>
                        <button type="button" id="show-btn" class="show-btn">SHOW</button>
                    </div>
                </div>

                <div class="options-group">
                    <label class="remember-label">
                        <input type="checkbox" id="remember">
                        <span class="custom-checkbox"></span>
                        Remember me
                    </label>
                </div>

                <button type="submit" class="submit-btn">SIGN IN</button>
                
                <p id="error-message" class="error-text"></p>
            </form>
        </div>
    </div>
`;

export function renderLogin() {
  const app = document.getElementById("app");
  app.innerHTML = FormLogin;
  const passwordInput = document.getElementById("password");
  const showBtn = document.getElementById("show-btn");

  showBtn.addEventListener("click", () => {
    if (passwordInput.type == "password") {
      passwordInput.type = "text";
      showBtn.textContent = "HIDE";
    } else {
      passwordInput.type = "password";
      showBtn.textContent = "SHOW";
    }
  });
  const form = document.getElementById("zone-login-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const submitBtn = document.querySelector(".submit-btn");

    submitBtn.textContent = "LOADING...";
    submitBtn.disabled = true;

    try {
      const token = await loginUser(user, pass);
      localStorage.setItem("jwt", token);
      showToast("Login Successful! Welcome.", "success");
      console.log("Token hidden:", token);
      initApp();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      submitBtn.textContent = "SIGN IN";
      submitBtn.disabled = false;
    }
  });
}
