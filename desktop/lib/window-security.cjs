const WINDOW_OPTIONS = Object.freeze({
  width: 1280,
  height: 820,
  minWidth: 960,
  minHeight: 680,
  show: false,
  title: 'Baraja Rally',
  webPreferences: Object.freeze({
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,
    webSecurity: true
  })
});

function isLocalUrl(targetUrl) {
  try {
    const parsed = new URL(targetUrl);
    return parsed.protocol === 'rally:' && parsed.hostname === 'app';
  } catch {
    return false;
  }
}

function applyWindowSecurity(window) {
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  const blockExternalNavigation = (event, targetUrl) => {
    if (!isLocalUrl(targetUrl)) event.preventDefault();
  };
  window.webContents.on('will-navigate', blockExternalNavigation);
  window.webContents.on('will-redirect', blockExternalNavigation);
}

function applySessionSecurity(session) {
  session.setPermissionCheckHandler(() => false);
  session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
}

module.exports = { WINDOW_OPTIONS, applySessionSecurity, applyWindowSecurity, isLocalUrl };

