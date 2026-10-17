import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadDeck, validateDeckAssets, validateDeckStructure } from "../dist/modules/deck.js";

const original = JSON.parse(await readFile(new URL("../dist/data/decks/rally-cars.json", import.meta.url), "utf8"));
const clone = () => structuredClone(original);

test("accepts the complete rally deck", () => {
  assert.equal(validateDeckStructure(clone()).cards.length, 32);
});

test("rejects unsupported schema versions", () => {
  const deck = clone(); deck.schemaVersion = 2;
  assert.throws(() => validateDeckStructure(deck), /schemaVersion/);
});

test("rejects missing metadata", () => {
  const deck = clone(); deck.name = "";
  assert.throws(() => validateDeckStructure(deck), /\$\.name/);
});

test("rejects duplicate stat keys", () => {
  const deck = clone(); deck.stats[1].key = deck.stats[0].key;
  assert.throws(() => validateDeckStructure(deck), /duplicate key/);
});

test("rejects invalid comparison directions", () => {
  const deck = clone(); deck.stats[0].direction = "fast";
  assert.throws(() => validateDeckStructure(deck), /direction/);
});

test("rejects duplicate card ids", () => {
  const deck = clone(); deck.cards[1].id = deck.cards[0].id;
  assert.throws(() => validateDeckStructure(deck), /duplicate id/);
});

test("rejects missing card values", () => {
  const deck = clone(); delete deck.cards[0].values.engine;
  assert.throws(() => validateDeckStructure(deck), /values\.engine/);
});

test("rejects non-numeric card values", () => {
  const deck = clone(); deck.cards[0].values.engine = "4973";
  assert.throws(() => validateDeckStructure(deck), /finite number/);
});

test("rejects missing image references", () => {
  const deck = clone(); deck.cards[0].image = "";
  assert.throws(() => validateDeckStructure(deck), /image/);
});

test("checks every referenced asset", async () => {
  const deck = clone();
  await assert.rejects(validateDeckAssets(deck, async (path) => path !== deck.cards[4].image), /asset:/);
  assert.equal(await validateDeckAssets(deck, async () => true), deck);
});

test("loads a second compatible deck without game-engine changes", async () => {
  const mini = JSON.parse(await readFile(new URL("fixtures/mini-deck.json", import.meta.url), "utf8"));
  const requests = [];
  const fetchMock = async (url) => {
    requests.push(String(url));
    return requests.length === 1
      ? { ok: true, status: 200, json: async () => mini }
      : { ok: true, status: 200 };
  };
  const loaded = await loadDeck("http://example.test/data/decks/mini.json", fetchMock);
  assert.equal(loaded.id, "mini-space");
  assert.equal(loaded.stats[1].direction, "low");
  assert.equal(requests.length, 6);
});
