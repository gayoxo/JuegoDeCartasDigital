import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const androidRoot = path.join(projectRoot, "android");
const wrapper = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
const tasks = process.argv.slice(2);

if (tasks.length === 0) {
  console.error("Uso: node tools/run-android-gradle.mjs <tarea-gradle> [...]");
  process.exit(2);
}

const result = spawnSync(wrapper, tasks, {
  cwd: androidRoot,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(`No se pudo ejecutar ${wrapper}: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
