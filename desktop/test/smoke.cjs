const assert = require('node:assert/strict');
const path = require('node:path');
const { spawn } = require('node:child_process');

const electron = require('electron');
const appDir = path.resolve(__dirname, '..');
const child = spawn(electron, [appDir], {
  cwd: appDir,
  detached: process.platform !== 'win32',
  env: { ...process.env, RALLY_SMOKE_TEST: '1' },
  stdio: ['ignore', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';
child.stdout.on('data', (chunk) => { stdout += chunk; process.stdout.write(chunk); });
child.stderr.on('data', (chunk) => { stderr += chunk; process.stderr.write(chunk); });

const timer = setTimeout(() => {
  if (process.platform === 'win32') child.kill();
  else process.kill(-child.pid, 'SIGKILL');
}, 30000);

child.on('close', (code) => {
  clearTimeout(timer);
  assert.equal(code, 0, `Electron terminó con ${code}: ${stderr}`);
  const marker = stdout.split(/\r?\n/).find((line) => line.startsWith('RALLY_SMOKE_OK:'));
  assert.ok(marker, 'No se recibió el resultado del renderizador');
  const result = JSON.parse(marker.slice('RALLY_SMOKE_OK:'.length));
  assert.match(result.title, /Coches Rally/);
  assert.equal(result.size, 32);

  if (process.platform !== 'win32') {
    assert.throws(() => process.kill(-child.pid, 0), { code: 'ESRCH' }, 'Quedaron procesos Electron en el grupo');
  }
  console.log('Electron smoke passed: offline, title and 32-card deck verified; process group closed.');
});

