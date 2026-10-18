const path = require('node:path');
const { app, BrowserWindow, net, protocol, session } = require('electron');
const { createProtocolHandler } = require('./lib/resource-paths.cjs');
const { WINDOW_OPTIONS, applySessionSecurity, applyWindowSecurity } = require('./lib/window-security.cjs');

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'rally',
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true }
  }
]);

let mainWindow = null;

function getDistRoot() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'dist')
    : path.resolve(__dirname, '..', 'dist');
}

function createMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) return mainWindow;

  mainWindow = new BrowserWindow(WINDOW_OPTIONS);
  applyWindowSecurity(mainWindow);
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('closed', () => { mainWindow = null; });
  mainWindow.loadURL('rally://app/index.html');

  if (process.env.RALLY_SMOKE_TEST === '1') {
    const timeout = setTimeout(() => {
      console.error('RALLY_SMOKE_ERROR: timeout al cargar la baraja');
      app.exit(1);
    }, 20000);
    mainWindow.webContents.once('did-finish-load', async () => {
      try {
        const result = await mainWindow.webContents.executeJavaScript(`
          new Promise((resolve, reject) => {
            const deadline = Date.now() + 10000;
            const poll = () => {
              const size = document.querySelector('#deckSize')?.textContent;
              const status = document.querySelector('#deckStatus')?.textContent || '';
              if (size === '32' && status.includes('preparada')) {
                resolve({ title: document.title, size: Number(size), status });
              } else if (Date.now() > deadline) {
                reject(new Error('La baraja no quedó preparada: ' + status));
              } else {
                setTimeout(poll, 100);
              }
            };
            poll();
          })
        `);
        clearTimeout(timeout);
        console.log(`RALLY_SMOKE_OK:${JSON.stringify(result)}`);
        mainWindow.close();
      } catch (error) {
        clearTimeout(timeout);
        console.error(`RALLY_SMOKE_ERROR:${error.message}`);
        app.exit(1);
      }
    });
  }
  return mainWindow;
}

app.whenReady().then(async () => {
  await protocol.handle('rally', createProtocolHandler(getDistRoot(), net));
  applySessionSecurity(session.defaultSession);
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

module.exports = { createMainWindow, getDistRoot };

