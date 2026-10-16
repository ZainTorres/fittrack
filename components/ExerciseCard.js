"use client";
import { useState } from "react";

export default function ExerciseCard({ ex, sets, last, onChange, onDone }) {
  const [open, setOpen] = useState(false);
  const [gif, setGif] = useState(null);
  const [loading, setLoading] = useState(false);
  const rows = [...Array(ex.sets)].map((_, i) => sets[i] || {});

  const set = (i, k, v) => {
    const n = rows.map((r) => ({ ...r }));
    n[i][k] = v;
    onChange(n);
    if (k === "done" && v) onDone();
  };

  async function toggle() {
    setOpen(!open);
    if (open || gif) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/gif?q=${encodeURIComponent(ex.en)}`);
      const j = await r.json();
      setGif(j.gifUrl || null);
    } catch (e) {}
    setLoading(false);
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold">{ex.name}</h3>
          <p className="text-xs text-zinc-400">{ex.sets} series × {ex.reps} reps</p>
        </div>
        <button onClick={toggle} className="text-xs bg-zinc-800 rounded-lg px-3 py-2">
          {open ? "Ocultar" : "▶ Técnica"}
        </button>
      </div>

      {open && (
        <div className="mt-3 text-center">
          {loading && <p className="text-sm text-zinc-400">Cargando animación…</p>}
          {gif && <img src={gif} alt={ex.name} className="mx-auto rounded-xl bg-white max-h-56" />}
          {!loading && !gif && (
            <p className="text-xs text-zinc-500 mb-1">No encontré animación para este ejercicio.</p>
          )}
          <a
            className="text-lime-400 text-sm underline"
            target="_blank"
            rel="noreferrer"
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + " técnica correcta")}`}
          >
            Ver video de la técnica
          </a>
        </div>
      )}

      <div className="mt-3 space-y-2">
        <div className="grid grid-cols-[2rem_1fr_1fr_3rem] gap-2 text-[11px] text-zinc-500 px-1">
          <span>#</span><span>Reps</span><span>Kg</span><span></span>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[2rem_1fr_1fr_3rem] gap-2 items-center">
            <span className="text-zinc-400 text-sm pl-1">{i + 1}</span>
            <input type="number" inputMode="numeric" placeholder="0" value={r.reps ?? ""}
              onChange={(e) => set(i, "reps", e.target.value)} />
            <input type="number" inputMode="decimal" placeholder={last || "0"} value={r.kg ?? ""}
              onChange={(e) => set(i, "kg", e.target.value)} />
            <button
              onClick={() => set(i, "done", !r.done)}
              className={`h-11 rounded-xl text-lg ${r.done ? "bg-lime-400 text-black" : "bg-zinc-800"}`}
            >✓</button>
          </div>
        ))}
      </div>
    </div>
  );
}