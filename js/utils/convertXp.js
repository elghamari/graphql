export function convertXP(xp) {
  const absXp = Math.abs(xp);
  const sign = xp < 0 ? "-" : "";
  if (absXp < 1000000) {
    return `${sign}${(absXp / 1000).toFixed(2)} KB`;
  }

  return `${sign}${(absXp / 1000000).toFixed(2)} MB`;
}
