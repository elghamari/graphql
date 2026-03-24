import { fetchAllData } from "../api/graphql.js";
import { initApp } from "../main.js";
import { getRank } from "../utils/getRank.js";
import { convertXP } from "../utils/convertXp.js";

function handleLogout() {
  localStorage.removeItem("jwt");
  initApp();
}

export async function renderProfile() {
  const app = document.getElementById("app");

  app.innerHTML = `
      <div class="profile-loader-container">
          <div class="loader-spinner"></div>
          <h1 class="loader-text">LOADING PROFILE...</h1>
      </div>
  `;

  try {
    const data = await fetchAllData();
    console.log(data);

    const user = data.user[0];
    const fullName = `${user.firstName} ${user.lastName}`;

    const rawXP = data.xp.aggregate.sum.amount;
    const Xp = convertXP(rawXP);

    const currentLevel = data.level.aggregate.max.amount;
    const rank = getRank(currentLevel);

    const cohort = user.events[0].cohorts[0].labelName.split("_")[0];

    const profileHTML = `
        <header class="profile-header">
          <h1>Welcome, <span class="highlight-name">${fullName}</span>!</h1>
          <button id="logout-btn" class="logout-btn">LOGOUT</button>
        </header>

        <section class="dashboard-content">
            <div class="stats-grid">
                
                <div class="stat-card">
                    <p class="card-title">Level</p>
                    <h2 class="card-value">${currentLevel}</h2>
                    <span class="card-icon">⭐</span>
                </div>

                <div class="stat-card">
                    <p class="card-title">Total XP</p>
                    <h2 class="card-value">${Xp}</h2>
                    <span class="card-icon">⚡</span>
                </div>

                <div class="stat-card">
                    <p class="card-title">Rank</p>
                    <h2 class="card-value">${rank}</h2>
                    <span class="card-icon">🏅</span>
                </div>

                <div class="stat-card">
                    <p class="card-title">Cohort</p>
                    <h2 class="card-value">${cohort}</h2>
                    <span class="card-icon">👥</span>
                </div>

            </div>
        </section>
    `;

    app.innerHTML = profileHTML;

    document
      .getElementById("logout-btn")
      .addEventListener("click", handleLogout);
  } catch (error) {
    console.error("Profile Error:", error);
    handleLogout();
  }
}
