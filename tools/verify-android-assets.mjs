import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = path.join(projectRoot, "dist");
const androidWebRoot = path.join(projectRoot, "android", "app", "src", "main", "assets", "public");
const manifestPath = path.join(webRoot, "data", "decks", "rally-cars.json");

async function requireFile(root, relativePath) {
  const normalized = relativePath.replace(/^\.\//, "");
  await access(path.join(root, normalized));
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
if (!Array.isArray(manifest.cards) || manifest.cards.length !== 32) {
  throw new Error(`La baraja debe contener 32 cartas; contiene ${manifest.cards?.length ?? 0}.`);
}

const required = new Set([
  "index.html",
  "app.js",
  "styles.css",
  "modules/deck.js",
  "modules/game-engine.js",
  "data/decks/rally-cars.json",
  manifest.cover,
  manifest.back,
  manifest.rulesImage,
  ...manifest.cards.map((card) => card.image),
]);

for (const relativePath of required) {
  await requireFile(webRoot, relativePath);
  await requireFile(androidWebRoot, relativePath);
}

console.log(`Verificados ${required.size} recursos y ${manifest.cards.length} cartas en dist/ y Android.`);
