const BASE = process.env.EXERCISEDB_URL || "https://oss.exercisedb.dev/api/v1";

export async function GET(req) {
  const q = new URL(req.url).searchParams.get("q");
  if (!q) return Response.json({ gifUrl: null }, { status: 400 });
  try {
    const r = await fetch(
      `${BASE}/exercises/search?q=${encodeURIComponent(q)}&search=${encodeURIComponent(q)}&limit=5`,
      { next: { revalidate: 86400 } }
    );
    const j = await r.json();
    const list = Array.isArray(j) ? j : j.data?.exercises || j.data || j.exercises || [];
    const hit = Array.isArray(list) ? list.find((e) => e.gifUrl) : null;
    return Response.json(
      { gifUrl: hit?.gifUrl || null },
      { headers: { "Cache-Control": "public, s-maxage=86400" } }
    );
  } catch (e) {
    return Response.json({ gifUrl: null });
  }
}