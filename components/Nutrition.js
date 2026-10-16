"use client";
import { useEffect, useState } from "react";
import { RECIPES, TIPS } from "@/lib/data";
import { today, sugarTarget, currentStreak } from "@/lib/game";

const FILTERS = [["todas", "Todas"], ["proteina", "Alta proteína"], ["bajo-azucar", "Baja en azúcar"], ["rapida", "Rápidas"]];

export default function Nutrition({ data, update }) {
  const [f, setF] = useState("todas");
  useEffect(() => { if (!data.sugarStart) update((d) => { d.sugarStart = today(); }); }, []);
  const target = sugarTarget(data), t = today(), g = data.sugar[t];
  const okDays = Object.keys(data.sugar).filter((d) => data.sugar[d] <= target);
  const zeroDays = Object.keys(data.sugar).filter((d) => data.sugar[d] === 0);
  const tip = TIPS[Math.floor(new Date() / 864e5) % TIPS.length];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Nutrición</h1>
      <div className="card space-y-3">
        <div className="flex justify-between">
          <div><p className="text-xs text-zinc-400">Meta de hoy (azúcar añadida)</p><p className="text-3xl font-bold text-lime-400">{target} g</p></div>
          <div className="text-right"><p className="text-xs text-zinc-400">Racha en meta</p><p className="text-3xl font-bold">{currentStreak(okDays)} 🔥</p></div>
        </div>
        <p className="text-xs text-zinc-500">La meta baja 10 g cada semana hasta llegar a 0 g. Días en cero: {zeroDays.length}</p>
        <div className="flex gap-2">
          <input type="number" inputMode="numeric" placeholder="Gramos de azúcar hoy" value={g ?? ""}
            onChange={(e) => update((d) => { d.sugar[t] = e.target.value === "" ? undefined : +e.target.value; if (d.sugar[t] === undefined) delete d.sugar[t]; })} />
          <button className="btn whitespace-nowrap" onClick={() => update((d) => { d.sugar[t] = 0; })}>Cero 🍬✕</button>
        </div>
        {g !== undefined && <p className={g <= target ? "text-lime-400 text-sm" : "text-amber-400 text-sm"}>{g === 0 ? "¡Día sin azúcar!" : g <= target ? "Dentro de tu meta 👏" : "Te pasaste hoy; mañana seguimos."}</p>}
      </div>
      <div className="card bg-lime-400/10 border-lime-400/30"><p className="text-xs text-lime-400">💡 Tip del día</p><p className="text-sm mt-1">{tip}</p></div>

      <h2 className="text-lg font-semibold pt-2">Recetas</h2>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(([k, l]) => (
          <button key={k} onClick={() => setF(k)} className={`px-3 py-2 rounded-full text-sm whitespace-nowrap ${f === k ? "bg-lime-400 text-black font-bold" : "bg-zinc-900"}`}>{l}</button>
        ))}
      </div>
      {RECIPES.filter((r) => f === "todas" || r.t.includes(f)).map((r) => (
        <div key={r.n} className="card"><h3 className="font-semibold">{r.n}</h3><p className="text-xs text-lime-400">{r.m}</p><p className="text-sm text-zinc-400 mt-1">{r.i}</p></div>
      ))}
    </div>
  );
}
