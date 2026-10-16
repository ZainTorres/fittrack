"use client";
import { GOALS, ROUTINES, WEEK } from "@/lib/data";

export default function Profile({ data, update, email, onLogout }) {
  const p = data.profile;
  const set = (k, v) => update((d) => { d.profile[k] = v; });
  const imc = p.weight && p.height ? (p.weight / (p.height / 100) ** 2).toFixed(1) : "-";
  const F = ({ l, k, type = "number" }) => (
    <label className="block text-xs text-zinc-400">{l}
      <input className="mt-1" type={type} inputMode={type === "number" ? "decimal" : "text"} value={p[k]} onChange={(e) => set(k, type === "number" ? +e.target.value : e.target.value)} />
    </label>
  );
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Perfil</h1>
      <p className="text-sm text-zinc-400">{email}</p>
      <div className="card space-y-3">
        <F l="Nombre" k="name" type="text" />
        <div className="grid grid-cols-3 gap-2"><F l="Edad" k="age" /><F l="Altura (cm)" k="height" /><F l="Peso (kg)" k="weight" /></div>
        <p className="text-sm">IMC: <b className="text-lime-400">{imc}</b></p>
        <label className="block text-xs text-zinc-400">Objetivo principal
          <select className="mt-1" value={p.goal} onChange={(e) => set("goal", e.target.value)}>{GOALS.map((g) => <option key={g}>{g}</option>)}</select>
        </label>
      </div>
      <div className="card space-y-2">
        <h2 className="font-semibold">Plan semanal</h2>
        {WEEK.map((d, i) => (
          <div key={d} className="flex items-center gap-3"><span className="w-10 text-sm text-zinc-400">{d}</span>
            <select value={data.plan[i] || "descanso"} onChange={(e) => update((x) => { x.plan[i] = e.target.value; })}>
              {Object.entries(ROUTINES).map(([k, r]) => <option key={k} value={k}>{r.name}</option>)}
            </select>
          </div>
        ))}
      </div>
      <button onClick={onLogout} className="w-full bg-zinc-800 rounded-xl py-3 text-red-400 font-semibold">Cerrar sesión</button>
    </div>
  );
}
