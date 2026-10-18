const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const { resolveAssetPath } = require('../lib/resource-paths.cjs');

const root = path.resolve('fixture-dist');

test('resuelve la raíz, módulos y nombres codificados dentro de dist', () => {
  assert.equal(resolveAssetPath(root, 'rally://app/'), path.join(root, 'index.html'));
  assert.equal(resolveAssetPath(root, 'rally://app/modules/deck.js'), path.join(root, 'modules', 'deck.js'));
  assert.equal(resolveAssetPath(root, 'rally://app/assets/mi%20carta.jpg'), path.join(root, 'assets', 'mi carta.jpg'));
});

test('rechaza otros orígenes y escapes directos o codificados', () => {
  const attacks = [
    'https://app/index.html',
    'rally://evil/index.html',
    'rally://app/../secret.txt',
    'rally://app/%2e%2e/secret.txt',
    'rally://app/%252e%252e/secret.txt',
    'rally://app/assets%2f..%2fsecret.txt',
    'rally://app/assets%5c..%5csecret.txt',
    'rally://app/%00secret.txt'
  ];
  for (const attack of attacks) {
    assert.throws(() => resolveAssetPath(root, attack), undefined, attack);
  }
});

test('toda ruta aceptada permanece bajo la raíz canónica', () => {
  for (const url of ['rally://app/index.html?x=1', 'rally://app/data/decks/rally-cars.json#deck']) {
    const result = resolveAssetPath(root, url);
    assert.ok(result.startsWith(`${root}${path.sep}`));
  }
});

