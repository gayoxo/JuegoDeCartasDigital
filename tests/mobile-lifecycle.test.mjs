import test from "node:test";
import assert from "node:assert/strict";
import { createListenerRegistration, createSnapshot, decideBackAction, loadSnapshot, restoreSnapshot, saveSnapshot, SNAPSHOT_KEY } from "../dist/modules/mobile-lifecycle.js";

const cards = ["a", "b", "c", "d"].map((id) => ({ id, name: id, values: { power: 1 } }));
const deck = { id: "deck", schemaVersion: 1, cards };
const game = {
  deck, phase: "resolved", player: [cards[2], cards[0], cards[1]], cpu: [cards[3]], pot: [], chooser: "player",
  selected: "power", round: 2, outcome: null,
  lastBattle: { statKey: "power", playerCard: cards[0], cpuCard: cards[1], playerValue: 1, cpuValue: 1, winner: "player", cardsWon: 2 }
};

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
}

test("snapshot round-trips ordered piles, initiative, pot and revealed battle", () => {
  const snapshot = createSnapshot(game);
  const restored = restoreSnapshot(snapshot, deck);
  assert.deepEqual(restored.player.map(({ id }) => id), ["c", "a", "b"]);
  assert.equal(restored.chooser, "player");
  assert.equal(restored.lastBattle.playerCard.id, "a");
  assert.equal(restored.selected, "power");
});

test("snapshot rejects corrupt, foreign-deck and incompatible data", () => {
  const snapshot = createSnapshot(game);
  assert.throws(() => restoreSnapshot({ ...snapshot, version: 99 }, deck), /incompatible/);
  assert.throws(() => restoreSnapshot({ ...snapshot, deckId: "other" }, deck), /incompatible/);
  assert.throws(() => restoreSnapshot({ ...snapshot, player: ["missing", ...snapshot.player.slice(1)] }, deck), /unknown/);
});

test("invalid stored state is discarded and reported", () => {
  const storage = memoryStorage({ [SNAPSHOT_KEY]: "not json" });
  assert.deepEqual(loadSnapshot(storage, deck), { game: null, discarded: true });
  assert.equal(storage.getItem(SNAPSHOT_KEY), null);
  saveSnapshot(storage, game);
  assert.equal(loadSnapshot(storage, deck).game.round, 2);
});

test("back policy closes layers before confirming or exiting", () => {
  assert.equal(decideBackAction({ rulesOpen: true, exitConfirmationOpen: true, endOpen: true, gameActive: true }), "close-rules");
  assert.equal(decideBackAction({ rulesOpen: false, exitConfirmationOpen: true, endOpen: true, gameActive: true }), "close-confirmation");
  assert.equal(decideBackAction({ rulesOpen: false, exitConfirmationOpen: false, endOpen: true, gameActive: true }), "close-end");
  assert.equal(decideBackAction({ rulesOpen: false, exitConfirmationOpen: false, endOpen: false, gameActive: true }), "confirm-exit");
  assert.equal(decideBackAction({ rulesOpen: false, exitConfirmationOpen: false, endOpen: false, gameActive: false }), "exit-app");
});

test("native listener registration is idempotent across repeated resumes", async () => {
  let adds = 0;
  let removes = 0;
  const registration = createListenerRegistration(async () => ({ remove: async () => { removes += 1; } }));
  const register = async () => { adds += 1; return { remove: async () => { removes += 1; } }; };
  const managed = createListenerRegistration(register);
  await managed.attach(() => {});
  await managed.attach(() => {});
  assert.equal(adds, 1);
  await managed.detach();
  await managed.detach();
  assert.equal(removes, 1);
  assert.ok(registration);
});
