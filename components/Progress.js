"use client";
import { useState } from "react";
import { today, iso, dayVol, achievements, trained, currentStreak } from "@/lib/game";

function Line({ pts }) {
  if (pts.length < 2) return <p className="text-sm text-zinc-500">Registra al menos 2 pesos para ver la gráfica.</p>;
  const ys = pts.map((p) => p.y), min = Math.min(...ys) - 1, max = Math.max(...ys) + 1;
  const P = pts.map((p, i) => `${(i / (pts.length - 1)) * 300 + 10},${90 - ((p.y - min) / (max - min)) * 80}`).join(" ");
  return <svg viewBox="0 0 320 100" className="w-full"><polyline points={P} fill="none" stroke="#a3e635" strokeWidth="2.5" strokeLinejoin="round" /></svg>;
}

export default function Progress({ data, update }) {
  const [w, setW] = useState("");
  const last7 = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); const k = iso(d); return { k, v: dayVol(data.logs[k]) }; });
  const maxV = Math.max(1, ...last7.map((x) => x.v));
  const ach = achievements(data);
  const addW = () => { if (!w) return; update((d) => { d.weights = d.weights.filter((x) => x.d !== today()); d.weights.push({ d: today(), kg: +w }); d.weights.sort((a, b) => a.d.localeCompare(b.d)); }); setW(""); };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Progreso</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="card"><p className="text-xs text-zinc-400">Racha entrenando</p><p className="text-3xl font-bold">{currentStreak(trained(data.logs))} 🔥</p></div>
        <div className="card"><p className="text-xs text-zinc-400">Entrenamientos</p><p className="text-3xl font-bold">{trained(data.logs).length}</p></div>
      </div>
      <div className="card space-y-3">
        <h2 className="font-semibold">Peso corporal</h2>
        <div className="flex gap-2"><input type="number" inputMode="decimal" placeholder="kg de hoy" value={w} onChange={(e) => setW(e.target.value)} /><button className="btn" onClick={addW}>Guardar</button></div>
        <Line pts={data.weights.map((x) => ({ y: x.kg }))} />
        {data.weights.length > 0 && <p className="text-xs text-zinc-400">Último: {data.weights.slice(-1)[0].kg} kg</p>}
      </div>
      <div className="card">
        <h2 className="font-semibold mb-3">Volumen levantado (7 días)</h2>
        <div className="flex items-end gap-2 h-28">
          {last7.map((x) => (
            <div key={x.k} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
              <div className="w-full bg-lime-400 rounded-t" style={{ height: `${(x.v / maxV) * 100}%`, minHeight: x.v ? 4 : 2, opacity: x.v ? 1 : 0.2 }} />
              <span className="text-[10px] text-zinc-500">{x.k.slice(8)}</span>
            </div>
          ))}
        </div>
      </div>
      <h2 className="font-semibold pt-1">Logros ({ach.filter((a) => a.ok).length}/{ach.length})</h2>
      <div className="grid grid-cols-2 gap-3">
        {ach.map((a) => (
          <div key={a.title} className={`card text-center ${a.ok ? "border-lime-400/60" : "opacity-40"}`}>
            <div className="text-3xl">{a.icon}</div><p className="text-xs mt-1">{a.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
