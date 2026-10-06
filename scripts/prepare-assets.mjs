import { readFile, writeFile, mkdir } from "node:fs/promises";
// Download the same stylesheet served by Google Fonts and make fonts device-local.
const stylesheet = await fetch(
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap",
  { headers: { "User-Agent": "Mozilla/5.0" } },
).then((r) => {
  if (!r.ok) throw new Error("Font stylesheet unavailable");
  return r.text();
});
await mkdir("public/fonts", { recursive: true });
let index = 0;
let local = stylesheet;
for (const match of stylesheet.matchAll(/url\((https:\/\/[^)]+)\)/g)) {
  const url = match[1];
  const name = `font-${++index}.${url.endsWith(".ttf") ? "ttf" : "woff2"}`;
  const bytes = await fetch(url).then((r) => {
    if (!r.ok) throw new Error("Font unavailable");
    return r.arrayBuffer();
  });
  await writeFile(`public/fonts/${name}`, Buffer.from(bytes));
  local = local.replace(url, `/fonts/${name}`);
}
await writeFile("app/fonts.css", local);
console.log(`Saved ${index} local font files.`);
