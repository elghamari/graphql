import { fetchAllData } from "../api/graphql.js";
import { initApp } from "../main.js";
import { convertXP } from "../utils/convertXp.js";
import { formatDate } from "../utils/formatDate.js";
import { getRank } from "../utils/getRank.js";
import { renderAuditDonut, renderSkillsGraph } from "./graphsUI.js";

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
    const user = data.user[0];

    const fullName = `${user.firstName} ${user.lastName}`;
    const rawXP = data.xp.aggregate.sum.amount;
    const xpFormatted = convertXP(rawXP);
    const level = data.level.aggregate.max.amount;
    const rank = getRank(level);
    const cohort = user.events[0]?.cohorts[0]?.labelName.split("_")[0] || "N/A";

    const rawUp = user.totalUp || 0;
    const rawDown = user.totalDown || 0;
    const userRatio = user.auditRatio || 0;
    const auditCount = user.audits_aggregate?.aggregate?.count || 0;
    const ratioFixed3 = userRatio.toFixed(3);

    const auditDonutHTML = renderAuditDonut(rawUp, rawDown, auditCount);

    const projectRows = data.projects
      .map((proj) => {
        const pName = proj.object.name;
        const pXP = convertXP(proj.amount);
        const pDate = formatDate(proj.createdAt);
        let team = "N/A";
        const progresses = proj.object.progresses;
        if (progresses && progresses.length > 0 && progresses[0].group) {
          team = progresses[0].group.members.map((m) => m.userLogin).join(", ");
        }
        return `
                <tr>
                    <td class="proj-name">${pName}</td>
                    <td class="proj-xp">${pXP}</td>
                    <td class="proj-date">${pDate}</td>
                    <td class="proj-team">${team}</td>
                </tr>
            `;
      })
      .join("");

    const skillsHTML = renderSkillsGraph(data.skills);

    app.innerHTML = `
            <header class="profile-header">
                <h1>Welcome, <span class="highlight-name">${fullName}</span>!</h1>
                <button id="logout-btn" class="logout-btn">LOGOUT</button>
            </header>

            <section class="dashboard-content">
                <div class="stats-grid">
                    <div class="stat-card">
                        <p class="card-title">Level</p>
                        <h2 class="card-value">${level}</h2>
                        <span class="card-icon">⭐</span>
                    </div>
                    <div class="stat-card">
                        <p class="card-title">Total XP</p>
                        <h2 class="card-value">${xpFormatted}</h2>
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

                <div class="projects-container">
                    <h2 class="section-title">Transactions (${data.projects.length})</h2>
                    <div class="table-wrapper">
                        <table class="projects-table">
                            <thead>
                                <tr>
                                    <th>Project</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Team</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${projectRows}
                            </tbody>
                        </table>
                    </div>
                </div>

                ${skillsHTML}

                <div class="audit-master-card">
                    <div class="audit-header">
                        <div class="blue-accent"></div>
                        <h2 class="audit-title">Audit Ratio: ${ratioFixed3}</h2>
                    </div>
                    ${auditDonutHTML}
                </div>
                
            </section>
        `;

    document
      .getElementById("logout-btn")
      .addEventListener("click", handleLogout);
  } catch (error) {
    console.error("Profile Error:", error);
    handleLogout();
  }
}
