import "./globals.css";
export const metadata = { title: "FitTrack", manifest: "/manifest.json", appleWebApp: { capable: true, title: "FitTrack" }, icons: { icon: "/icon.svg", apple: "/icon.svg" } };
export const viewport = { themeColor: "#09090b", width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({ children }) {
  return <html lang="es"><body className="bg-zinc-950 text-zinc-100 min-h-screen">{children}</body></html>;
}
