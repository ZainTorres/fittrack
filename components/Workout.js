"use client";
import { useState } from "react";
import { ROUTINES, WEEK } from "@/lib/data";
import { iso, dayVol, lastKg } from "@/lib/game";
import ExerciseCard from "./ExerciseCard";
import RestTimer from "./RestTimer";

export default function Workout({ data, update }) {
  const [sel, setSel] = useState(iso(new Date()));
  const [trig, setTrig] = useState(0);
  const mon = new Date(); mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));
  const days = [...Array(7)].map((_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return d; });
  const wd = (new Date(sel + "T00:00").getDay() + 6) % 7;
  const routine = ROUTINES[data.plan[wd] || "descanso"];
  const log = data.logs[sel] || {};

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Rutinas</h1>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const k = iso(d), on = k === sel, rest = (data.plan[i] || "descanso") === "descanso";
          return (
            <button key={k} onClick={() => setSel(k)}
              className={`rounded-xl py-2 text-center ${on ? "bg-lime-400 text-black font-bold" : "bg-zinc-900"} ${rest && !on ? "opacity-50" : ""}`}>
              <div className="text-[11px]">{WEEK[i]}</div><div>{d.getDate()}</div>
            </button>
          );
        })}
      </div>
      <div className="card flex justify-between items-center">
        <div><p className="text-xs text-zinc-400">Rutina del día</p><p className="font-semibold">{routine.name}</p></div>
        <div className="text-right"><p className="text-xs text-zinc-400">Volumen</p><p className="font-semibold text-lime-400">{Math.round(dayVol(log))} kg</p></div>
      </div>
      {routine.ex.length === 0 && <p className="text-zinc-400 text-center py-8">Día de descanso 😴 Camina, estira y duerme bien.</p>}
      {routine.ex.map((ex) => (
        <ExerciseCard key={ex.id} ex={ex} sets={log[ex.id] || []} last={lastKg(data.logs, ex.id)}
          onChange={(s) => update((d) => { d.logs[sel] = { ...(d.logs[sel] || {}), [ex.id]: s }; })}
          onDone={() => setTrig((t) => t + 1)} />
      ))}
      <RestTimer trig={trig} />
    </div>
  );
}
