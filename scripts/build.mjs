// Construit le site dans dist/ :
//  - copie les fichiers de src/ et le dossier photos/
//  - génère dist/manifest.json à partir des dossiers photos/01 … photos/100 et de prix.json
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "src");
const PHOTOS = join(ROOT, "photos");
const DIST = join(ROOT, "dist");
const TOTAL = 100;
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|svg)$/i;

const pad = (n) => String(n).padStart(2, "0");
const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(SRC, DIST, { recursive: true });

const prix = existsSync(join(ROOT, "prix.json"))
  ? JSON.parse(readFileSync(join(ROOT, "prix.json"), "utf8"))
  : {};

const manifest = {};
for (let i = 1; i <= TOTAL; i++) {
  const id = pad(i);
  const dir = join(PHOTOS, id);
  const photos = existsSync(dir) && statSync(dir).isDirectory()
    ? readdirSync(dir).filter((f) => IMAGE_EXT.test(f)).sort(naturalSort)
    : [];
  if (photos.length === 0) continue;

  cpSync(dir, join(DIST, "photos", id), { recursive: true });
  manifest[id] = {
    photos: photos.map((f) => `photos/${id}/${encodeURIComponent(f)}`),
    prix: prix[id] ?? null,
  };
}

writeFileSync(join(DIST, "manifest.json"), JSON.stringify({ total: TOTAL, bonnets: manifest }));
console.log(`✔ ${Object.keys(manifest).length} bonnet(s) avec photos sur ${TOTAL} → dist/`);
