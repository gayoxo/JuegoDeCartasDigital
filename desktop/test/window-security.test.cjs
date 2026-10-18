const assert = require('node:assert/strict');
const test = require('node:test');
const {
  WINDOW_OPTIONS,
  applySessionSecurity,
  applyWindowSecurity,
  isLocalUrl
} = require('../lib/window-security.cjs');

test('la ventana aísla el renderizador y deshabilita Node', () => {
  assert.equal(WINDOW_OPTIONS.webPreferences.contextIsolation, true);
  assert.equal(WINDOW_OPTIONS.webPreferences.nodeIntegration, false);
  assert.equal(WINDOW_OPTIONS.webPreferences.sandbox, true);
  assert.equal(WINDOW_OPTIONS.webPreferences.webSecurity, true);
  assert.equal('preload' in WINDOW_OPTIONS.webPreferences, false);
  assert.ok(WINDOW_OPTIONS.minWidth > 0 && WINDOW_OPTIONS.minHeight > 0);
});

test('solo considera local el origen rally://app', () => {
  assert.equal(isLocalUrl('rally://app/index.html'), true);
  assert.equal(isLocalUrl('rally://evil/index.html'), false);
  assert.equal(isLocalUrl('https://example.com'), false);
});

test('deniega ventanas nuevas y navegaciones externas', () => {
  const listeners = new Map();
  let openHandler;
  const fakeWindow = { webContents: {
    setWindowOpenHandler(handler) { openHandler = handler; },
    on(name, handler) { listeners.set(name, handler); }
  } };
  applyWindowSecurity(fakeWindow);
  assert.deepEqual(openHandler({ url: 'https://example.com' }), { action: 'deny' });

  const externalEvent = { prevented: false, preventDefault() { this.prevented = true; } };
  listeners.get('will-navigate')(externalEvent, 'https://example.com');
  assert.equal(externalEvent.prevented, true);

  const localEvent = { prevented: false, preventDefault() { this.prevented = true; } };
  listeners.get('will-navigate')(localEvent, 'rally://app/index.html');
  assert.equal(localEvent.prevented, false);
});

test('deniega comprobaciones y solicitudes de permisos', () => {
  let checkHandler;
  let requestHandler;
  const fakeSession = {
    setPermissionCheckHandler(handler) { checkHandler = handler; },
    setPermissionRequestHandler(handler) { requestHandler = handler; }
  };
  applySessionSecurity(fakeSession);
  assert.equal(checkHandler(), false);
  let result = true;
  requestHandler(null, 'camera', (allowed) => { result = allowed; });
  assert.equal(result, false);
});

