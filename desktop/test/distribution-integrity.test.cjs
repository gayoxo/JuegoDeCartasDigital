const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..', '..');
const desktopPackage = JSON.parse(fs.readFileSync(path.join(repoRoot, 'desktop', 'package.json'), 'utf8'));
const deck = JSON.parse(fs.readFileSync(path.join(repoRoot, 'dist', 'data', 'decks', 'rally-cars.json'), 'utf8'));

test('Electron empaqueta el mismo dist de 32 cartas usado por la web', () => {
  assert.equal(deck.cards.length, 32);
  assert.deepEqual(desktopPackage.build.extraResources, [{
    from: '../dist',
    to: 'dist',
    filter: ['**/*']
  }]);
});

test('Docker y Electron reutilizan los módulos canónicos del motor', () => {
  const dockerfile = fs.readFileSync(path.join(repoRoot, 'Dockerfile'), 'utf8');
  assert.match(dockerfile, /COPY --chown=1001:1001 dist\/ \/srv\//);
  for (const modulePath of ['modules/deck.js', 'modules/game-engine.js']) {
    assert.ok(fs.existsSync(path.join(repoRoot, 'dist', modulePath)), modulePath);
  }
});

