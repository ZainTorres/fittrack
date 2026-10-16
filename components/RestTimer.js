"use client";
import { useEffect, useState } from "react";

export default function RestTimer({ trig }) {
  const [dur, setDur] = useState(60);
  const [left, setLeft] = useState(0);
  useEffect(() => { if (trig) setLeft(dur); }, [trig]);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => {
      setLeft(left - 1);
      if (left === 1) navigator.vibrate?.([200, 100, 200]);
    }, 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <div className="fixed bottom-16 inset-x-0 z-20 px-3 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-700 rounded-2xl p-2 flex items-center gap-2">
        <div className={`w-20 text-center text-2xl font-bold tabular-nums ${left > 0 ? "text-lime-400" : "text-zinc-500"}`}>
          {left > 0 ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : "⏱ 0:00"}
        </div>
        <div className="flex gap-1 flex-1 justify-end">
          {[30, 60, 90, 120].map((s) => (
            <button key={s} onClick={() => { setDur(s); setLeft(s); }}
              className={`px-2.5 py-2 rounded-lg text-sm ${dur === s ? "bg-lime-400 text-black font-bold" : "bg-zinc-800"}`}>{s}s</button>
          ))}
          {left > 0 && <button onClick={() => setLeft(0)} className="px-2.5 py-2 rounded-lg bg-zinc-800 text-sm">✕</button>}
        </div>
      </div>
    </div>
  );
}
