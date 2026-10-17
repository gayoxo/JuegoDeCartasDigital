const SUPPORTED_SCHEMA_VERSION = 1;

function assert(condition, path, message) {
  if (!condition) throw new Error(`${path}: ${message}`);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateDeckStructure(deck) {
  assert(deck && typeof deck === "object" && !Array.isArray(deck), "$", "must be an object");
  assert(deck.schemaVersion === SUPPORTED_SCHEMA_VERSION, "$.schemaVersion", `must equal ${SUPPORTED_SCHEMA_VERSION}`);
  for (const field of ["id", "name", "cover", "back", "rulesImage"]) {
    assert(isNonEmptyString(deck[field]), `$.${field}`, "must be a non-empty string");
  }
  assert(Array.isArray(deck.stats) && deck.stats.length > 0, "$.stats", "must contain at least one stat");
  assert(Array.isArray(deck.cards) && deck.cards.length >= 2, "$.cards", "must contain at least two cards");

  const statKeys = new Set();
  deck.stats.forEach((stat, index) => {
    const path = `$.stats[${index}]`;
    assert(stat && typeof stat === "object", path, "must be an object");
    assert(isNonEmptyString(stat.key), `${path}.key`, "must be a non-empty string");
    assert(!statKeys.has(stat.key), `${path}.key`, `duplicate key '${stat.key}'`);
    statKeys.add(stat.key);
    assert(isNonEmptyString(stat.label), `${path}.label`, "must be a non-empty string");
    assert(typeof stat.unit === "string", `${path}.unit`, "must be a string");
    assert(stat.direction === "high" || stat.direction === "low", `${path}.direction`, "must be 'high' or 'low'");
  });

  const cardIds = new Set();
  deck.cards.forEach((card, index) => {
    const path = `$.cards[${index}]`;
    assert(card && typeof card === "object", path, "must be an object");
    assert(isNonEmptyString(card.id), `${path}.id`, "must be a non-empty string");
    assert(!cardIds.has(card.id), `${path}.id`, `duplicate id '${card.id}'`);
    cardIds.add(card.id);
    assert(isNonEmptyString(card.name), `${path}.name`, "must be a non-empty string");
    assert(isNonEmptyString(card.image), `${path}.image`, "must be a non-empty string");
    assert(card.values && typeof card.values === "object", `${path}.values`, "must be an object");
    for (const key of statKeys) {
      assert(Object.hasOwn(card.values, key), `${path}.values.${key}`, "is required");
      assert(Number.isFinite(card.values[key]), `${path}.values.${key}`, "must be a finite number");
    }
  });
  return deck;
}

export function deckAssetPaths(deck) {
  return [...new Set([deck.cover, deck.back, deck.rulesImage, ...deck.cards.map((card) => card.image)])];
}

export async function validateDeckAssets(deck, assetExists) {
  for (const path of deckAssetPaths(deck)) {
    const exists = await assetExists(path);
    assert(exists, `asset:${path}`, "could not be loaded");
  }
  return deck;
}

export async function loadDeck(url, fetchImpl = globalThis.fetch) {
  assert(typeof fetchImpl === "function", "$fetch", "fetch implementation is required");
  const response = await fetchImpl(url);
  assert(response && response.ok, url, `request failed${response ? ` (${response.status})` : ""}`);
  const deck = validateDeckStructure(await response.json());
  const baseUrl = new URL(url, globalThis.location?.href || "file:///");
  await validateDeckAssets(deck, async (path) => {
    const assetUrl = new URL(path, new URL("../../", baseUrl));
    try {
      const assetResponse = await fetchImpl(assetUrl.href, { method: "GET", cache: "force-cache" });
      return Boolean(assetResponse?.ok);
    } catch {
      return false;
    }
  });
  return deck;
}
