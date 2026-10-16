export const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
export const today = () => iso(new Date());
export const vol = (sets = []) => sets.reduce((a, s) => a + (+s.reps || 0) * (+s.kg || 0), 0);
export const dayVol = (log = {}) => Object.values(log).reduce((a, s) => a + vol(s), 0);
export const trained = (logs) => Object.keys(logs).filter((d) => Object.values(logs[d]).some((s) => s.some((x) => x.done)));

export function bestStreak(dates) {
  const s = [...new Set(dates)].sort(); let best = 0, cur = 0, prev = null;
  for (const d of s) {
    cur = prev && (new Date(d) - new Date(prev)) / 864e5 === 1 ? cur + 1 : 1;
    best = Math.max(best, cur); prev = d;
  }
  return best;
}
export function currentStreak(dates) {
  const set = new Set(dates); let n = 0; const d = new Date();
  if (!set.has(iso(d))) d.setDate(d.getDate() - 1);
  while (set.has(iso(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
export function sugarTarget(data) {
  const start = data.sugarStart || today();
  const w = Math.floor((new Date(today()) - new Date(start)) / 864e5 / 7);
  return Math.max(0, 50 - 10 * w); // gramos/día: baja 10 g cada semana
}
export const lastKg = (logs, id) => {
  const d = Object.keys(logs).sort().reverse().find((k) => logs[k][id]?.some((s) => s.kg));
  return d ? logs[d][id].filter((s) => s.kg).slice(-1)[0].kg : "";
};

export function achievements(data) {
  const tr = trained(data.logs);
  const total = Object.values(data.logs).reduce((a, l) => a + dayVol(l), 0);
  const target = sugarTarget(data);
  const okDays = Object.keys(data.sugar).filter((d) => data.sugar[d] <= target);
  const zeroDays = Object.keys(data.sugar).filter((d) => data.sugar[d] === 0);
  let pr = false; const byEx = {};
  Object.keys(data.logs).sort().forEach((d) => Object.entries(data.logs[d]).forEach(([id, s]) => {
    const m = Math.max(0, ...s.filter((x) => x.done).map((x) => +x.kg || 0));
    if (m > 0) { if (byEx[id] && m > byEx[id]) pr = true; byEx[id] = Math.max(byEx[id] || 0, m); }
  }));
  return [
    { icon: "🔥", title: "Primer entrenamiento", ok: tr.length >= 1 },
    { icon: "⚡", title: "3 días seguidos entrenando", ok: bestStreak(tr) >= 3 },
    { icon: "🏆", title: "Nuevo récord de peso", ok: pr },
    { icon: "💪", title: "5.000 kg de volumen total", ok: total >= 5000 },
    { icon: "🍬", title: "3 días bajo tu meta de azúcar", ok: bestStreak(okDays) >= 3 },
    { icon: "🥇", title: "Primera semana sin azúcar", ok: bestStreak(zeroDays) >= 7 },
    { icon: "⚖️", title: "4 registros de peso", ok: data.weights.length >= 4 },
    { icon: "📅", title: "10 entrenamientos", ok: tr.length >= 10 },
  ];
}
