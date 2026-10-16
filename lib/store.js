"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, enabled } from "./firebase";
import { DEFAULT_PLAN } from "./data";

const empty = {
  profile: { name: "", age: 28, height: 166, weight: 64.5, goal: "Perder grasa abdominal" },
  plan: DEFAULT_PLAN, logs: {}, weights: [], sugar: {}, sugarStart: null,
};

// Un documento por usuario: users/{uid}. Se guarda en localStorage siempre y en Firestore si está configurado.
export function useUserData(uid) {
  const [data, setData] = useState(null);
  const dirty = useRef(false);

  useEffect(() => {
    let off = false;
    (async () => {
      let d = null;
      try { if (enabled) { const s = await getDoc(doc(db, "users", uid)); if (s.exists()) d = s.data(); } } catch (e) {}
      if (!d) { try { d = JSON.parse(localStorage.getItem("fit_" + uid)); } catch (e) {} }
      if (!off) setData({ ...empty, ...d, profile: { ...empty.profile, ...(d?.profile || {}) } });
    })();
    return () => { off = true; };
  }, [uid]);

  useEffect(() => {
    if (!data || !dirty.current) return;
    const t = setTimeout(async () => {
      localStorage.setItem("fit_" + uid, JSON.stringify(data));
      try { if (enabled) await setDoc(doc(db, "users", uid), data); } catch (e) { console.error(e); }
    }, 700);
    return () => clearTimeout(t);
  }, [data, uid]);

  const update = useCallback((fn) => {
    dirty.current = true;
    setData((p) => { const n = structuredClone(p); fn(n); return n; });
  }, []);
  return [data, update];
}
