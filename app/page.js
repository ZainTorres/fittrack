"use client";
import { useEffect, useState } from "react";
import { auth, enabled } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useUserData } from "@/lib/store";
import Workout from "@/components/Workout";
import Nutrition from "@/components/Nutrition";
import Progress from "@/components/Progress";
import Profile from "@/components/Profile";

function Auth({ onLocal }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  async function submit(e) {
    e.preventDefault(); setErr("");
    try {
      if (enabled) {
        if (mode === "login") await signInWithEmailAndPassword(auth, email, pw);
        else await createUserWithEmailAndPassword(auth, email, pw);
      } else { // Modo local (sin Firebase): solo para pruebas en este dispositivo
        const u = { uid: email.toLowerCase(), email };
        localStorage.setItem("fit_user", JSON.stringify(u)); onLocal(u);
      }
    } catch (x) { setErr(x.message); }
  }
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <div className="text-center"><div className="text-5xl">🏋️</div><h1 className="text-3xl font-bold mt-2">Fit<span className="text-lime-400">Track</span></h1>
          <p className="text-zinc-400 text-sm mt-1">Entrena, come bien y mide tu progreso</p></div>
        <input type="email" required placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required minLength={6} placeholder="Contraseña (mín. 6)" value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p className="text-red-400 text-xs">{err}</p>}
        <button className="btn w-full">{mode === "login" ? "Entrar" : "Crear cuenta"}</button>
        <button type="button" className="w-full text-sm text-zinc-400" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}</button>
        {!enabled && <p className="text-[11px] text-amber-400 text-center">Firebase no configurado: modo local en este dispositivo.</p>}
      </form>
    </main>
  );
}

const TABS = [["rutinas", "🏋️", "Rutinas"], ["nutricion", "🥗", "Nutrición"], ["progreso", "📈", "Progreso"], ["perfil", "👤", "Perfil"]];

function App({ user, onLogout }) {
  const [tab, setTab] = useState("rutinas");
  const [data, update] = useUserData(user.uid);
  if (!data) return <p className="p-8 text-center text-zinc-400">Cargando…</p>;
  return (
    <>
      <main className="max-w-md mx-auto p-4 pb-44">
        {tab === "rutinas" && <Workout data={data} update={update} />}
        {tab === "nutricion" && <Nutrition data={data} update={update} />}
        {tab === "progreso" && <Progress data={data} update={update} />}
        {tab === "perfil" && <Profile data={data} update={update} email={user.email} onLogout={onLogout} />}
      </main>
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-zinc-950/95 backdrop-blur border-t border-zinc-800 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto grid grid-cols-4">
          {TABS.map(([k, ic, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`py-2.5 flex flex-col items-center text-[11px] ${tab === k ? "text-lime-400" : "text-zinc-500"}`}>
              <span className="text-xl">{ic}</span>{l}</button>
          ))}
        </div>
      </nav>
    </>
  );
}

export default function Home() {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (enabled) return onAuthStateChanged(auth, (u) => setUser(u ? { uid: u.uid, email: u.email } : null));
    const l = localStorage.getItem("fit_user"); setUser(l ? JSON.parse(l) : null);
  }, []);
  const logout = () => { if (enabled) signOut(auth); else { localStorage.removeItem("fit_user"); setUser(null); } };
  if (user === undefined) return <p className="p-8 text-center text-zinc-400">Cargando…</p>;
  return user ? <App user={user} onLogout={logout} /> : <Auth onLocal={setUser} />;
}
