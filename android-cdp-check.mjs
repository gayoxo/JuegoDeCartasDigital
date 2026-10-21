import WebSocket from "/tmp/cdp/node_modules/ws/index.js";
import http from "node:http";

const cdpHost = process.env.CDP_HOST || "127.0.0.1";
const endpoint = await new Promise((resolve, reject) => {
  http.get({ hostname: cdpHost, port: 9222, path: "/json", headers: { Host: "localhost" } }, (response) => {
    let body = "";
    response.setEncoding("utf8");
    response.on("data", (chunk) => { body += chunk; });
    response.on("end", () => resolve(JSON.parse(body)));
  }).on("error", reject);
});
const debuggerUrl = new URL(endpoint[0].webSocketDebuggerUrl);
debuggerUrl.hostname = cdpHost;
debuggerUrl.port = "9222";
endpoint[0].webSocketDebuggerUrl = debuggerUrl.href;
const socket = new WebSocket(endpoint[0].webSocketDebuggerUrl, { headers: { Host: "localhost" } });
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  message.error ? reject(new Error(message.error.message)) : resolve(message.result);
});

function command(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await command("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

const initial = await evaluate(`({
  title: document.title,
  deckSize: document.querySelector('#deckSize')?.textContent,
  deckStatus: document.querySelector('#deckStatus')?.textContent,
  coverLoaded: document.querySelector('#coverImage')?.complete && document.querySelector('#coverImage')?.naturalWidth > 0,
  startEnabled: !document.querySelector('#startButton')?.disabled
})`);

if (initial.deckSize !== "32" || !initial.coverLoaded || !initial.startEnabled) {
  throw new Error(`Invalid initial screen: ${JSON.stringify(initial)}`);
}

await evaluate("document.querySelector('#startButton').click()");
let finalState;
for (let attempt = 0; attempt < 3000; attempt += 1) {
  finalState = await evaluate(`(() => {
    const end = document.querySelector('#endDialog');
    if (end?.open) return { done: true, title: document.querySelector('#endTitle')?.textContent, copy: document.querySelector('#endCopy')?.textContent };
    const next = document.querySelector('#nextButton');
    if (next && !next.hidden) { next.click(); return { done: false, action: 'next' }; }
    const stat = document.querySelector('#playerCard .stat-button:not([disabled])');
    if (stat) { stat.click(); return { done: false, action: 'stat' }; }
    return { done: false, action: 'wait' };
  })()`);
  if (finalState.done) break;
  await new Promise((resolve) => setTimeout(resolve, 100));
}

if (!finalState?.done) throw new Error("Game did not finish within the verification limit");
console.log(JSON.stringify({ initial, final: finalState }));
socket.close();
