import { convertXP } from "../utils/convertXp.js";

export function renderSkillsGraph(skills) {
  const skillMap = {};
  skills.forEach((s) => {
    const cleanName = s.type.replace("skill_", "");
    const name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    if (!skillMap[name] || s.amount > skillMap[name]) {
      skillMap[name] = s.amount;
    }
  });

  const skillEntries = Object.entries(skillMap).sort((a, b) => b[1] - a[1]);
  const totalSkills = skillEntries.length;

  const barHeight = 14; 
  const gap = 24;

  const svgRows = skillEntries
    .map(([name, amount], index) => {
      const y = index * (barHeight + gap) + 15;
      const hue = (index / totalSkills) * 360;
      const color = `hsl(${hue}, 70%, 55%)`;

      return `
            <g class="skill-row">
                <text x="0" y="${y + barHeight / 2}" fill="#f8fafc" font-size="14px" font-weight="600" dominant-baseline="middle">${name}</text>
                
                <rect x="95" y="${y}" height="${barHeight}" rx="${barHeight / 2}" fill="#334155" style="width: calc(100% - 135px);" />
                
                <rect x="95" y="${y}" height="${barHeight}" rx="${barHeight / 2}" fill="${color}" style="width: calc((100% - 135px) * ${amount / 100});" class="bar-fill" />
                
                <text x="100%" y="${y + barHeight / 2}" fill="#f8fafc" font-size="14px" font-weight="600" text-anchor="end" dominant-baseline="middle">${amount}</text>
            </g>
        `;
    })
    .join("");

  const totalHeight = totalSkills * (barHeight + gap) + 30;

  return `
        <div class="skills-card">
            <div class="audit-header" style="margin-bottom: 2rem;">
                <div class="blue-accent"></div>
                <h2 class="audit-title">Skill Levels</h2>
            </div>
            <div class="svg-container" style="max-height: 350px; overflow-y: auto; overflow-x: hidden; padding-right: 1rem;">
                <svg width="100%" height="${totalHeight}" style="display: block;">
                    ${svgRows}
                </svg>
            </div>
        </div>
    `;
}

export function renderAuditDonut(upAmount, downAmount, auditCount) {
  const total = upAmount + downAmount;
  const upPercent = total === 0 ? 0 : ((upAmount / total) * 100).toFixed(1);

  const upFormatted = convertXP(upAmount);
  const downFormatted = convertXP(downAmount);

  return `
        <div class="audit-donut-container">
            <div class="donut-wrapper">
                <svg viewBox="0 0 200 200" width="180" height="180">
                    <circle cx="100" cy="100" r="75" fill="none" stroke="#ef4444" stroke-width="20" />
                    <circle cx="100" cy="100" r="75" fill="none" stroke="#22c55e" stroke-width="20" 
                            pathLength="100" stroke-dasharray="${upPercent} 100" 
                            transform="rotate(-90 100 100)" class="donut-fill" />
                </svg>
                <div class="donut-center">
                    <span class="donut-audit-count">${auditCount}</span>
                    <span class="donut-label">Audits</span>
                </div>
            </div>

            <div class="donut-legend">
                <div class="legend-item">
                    <span class="color-box box-up"></span>
                    <span>Done (${upFormatted} - ${upPercent}%)</span>
                </div>
                <div class="legend-item">
                    <span class="color-box box-down"></span>
                    <span>Received (${downFormatted} - ${(100 - upPercent).toFixed(1)}%)</span>
                </div>
            </div>
        </div>
    `;
}
