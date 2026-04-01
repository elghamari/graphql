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

  const isMobile = window.innerWidth <= 768;
  const width = isMobile ? 380 : 800;
  const startX = isMobile ? 85 : 120;
  const barHeight = isMobile ? 14 : 12;
  const gap = isMobile ? 28 : 24;

  const barMaxWidth = width - startX - (isMobile ? 35 : 40);

  const svgRows = skillEntries
    .map(([name, amount], index) => {
      const y = index * (barHeight + gap) + 10;
      const barWidth = (amount / 100) * barMaxWidth;

      const hue = (index / totalSkills) * 360;
      const color = `hsl(${hue}, 70%, 55%)`;

      return `
            <g class="skill-row">
                <text x="0" y="${y + barHeight / 2}" class="skill-label" dominant-baseline="middle">${name}</text>
                <rect x="${startX}" y="${y}" width="${barMaxWidth}" height="${barHeight}" rx="${barHeight / 2}" class="bar-bg" />
                <rect x="${startX}" y="${y}" width="${barWidth}" height="${barHeight}" rx="${barHeight / 2}" style="fill: ${color}" class="bar-fill" />
                <text x="${width}" y="${y + barHeight / 2}" class="skill-value" text-anchor="end" dominant-baseline="middle">${amount}</text>
            </g>
        `;
    })
    .join("");

  const totalHeight = totalSkills * (barHeight + gap) + 20;

  return `
        <div class="skills-card">
            <h2 class="section-title">Skill Levels</h2>
            <div class="svg-container">
                <svg viewBox="0 0 ${width} ${totalHeight}" width="100%" height="100%">
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
