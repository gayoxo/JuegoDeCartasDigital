import test from "node:test";
import assert from "node:assert/strict";
import { advanceRound, chooseCpuStat, createGame, PHASES, resolveRound, restartGame, startGame, statRanges } from "../dist/modules/game-engine.js";

const stats = [
  { key: "power", label: "Potencia", unit: "CV", direction: "high" },
  { key: "weight", label: "Peso", unit: "kg", direction: "low" }
];
const card = (id, power, weight) => ({ id, name: id, image: `${id}.jpg`, values: { power, weight } });
const deck = { stats, cards: [card("a", 10, 8), card("b", 20, 7), card("c", 30, 6), card("d", 40, 5)] };
const state = (overrides = {}) => ({ ...createGame(deck), phase: PHASES.CHOOSING, chooser: "player", round: 1, ...overrides });

test("transitions through idle, choosing, resolved and finished", () => {
  const idle = createGame(deck);
  assert.equal(idle.phase, PHASES.IDLE);
  const choosing = startGame(idle, () => 0);
  assert.equal(choosing.phase, PHASES.CHOOSING);
  const resolved = resolveRound(state({ player: [card("p", 20, 5), card("p2", 1, 1)], cpu: [card("c", 10, 9), card("c2", 1, 1)] }), "power");
  assert.equal(resolved.phase, PHASES.RESOLVED);
  assert.equal(advanceRound(resolved).phase, PHASES.CHOOSING);
  const finished = resolveRound(state({ player: [card("p", 20, 5)], cpu: [card("c", 10, 9)] }), "power");
  assert.equal(finished.phase, PHASES.FINISHED);
});

test("deals 32 unique cards into two deterministic piles of 16", () => {
  const bigDeck = { stats, cards: Array.from({ length: 32 }, (_, i) => card(String(i), i, 32 - i)) };
  const game = startGame(createGame(bigDeck), () => 0);
  assert.equal(game.player.length, 16);
  assert.equal(game.cpu.length, 16);
  assert.equal(new Set([...game.player, ...game.cpu].map((item) => item.id)).size, 32);
  assert.equal(game.chooser, "player");
});

test("cpu strategy only needs its card, public stats and public ranges", () => {
  const cpuCard = card("cpu", 40, 8);
  const choice = chooseCpuStat(cpuCard, stats, statRanges(deck), () => 0);
  assert.ok(stats.some((stat) => stat.key === choice));
  assert.equal(choice, "power");
  assert.throws(() => resolveRound(state({ player: [card("p", 1, 1)], cpu: [cpuCard] }), "unknown"), /Unknown stat/);
});

test("high and low comparisons transfer cards in order and preserve winner initiative", () => {
  const high = resolveRound(state({ player: [card("p", 30, 9), card("p2", 1, 1)], cpu: [card("c", 20, 8), card("c2", 1, 1)] }), "power");
  assert.deepEqual(high.player.map((item) => item.id), ["p2", "p", "c"]);
  assert.equal(high.chooser, "player");
  const low = resolveRound(state({ player: [card("p", 30, 9), card("p2", 1, 1)], cpu: [card("c", 20, 8), card("c2", 1, 1)] }), "weight");
  assert.deepEqual(low.cpu.map((item) => item.id), ["c2", "p", "c"]);
  assert.equal(low.chooser, "cpu");
});

test("ties accumulate a pot and the next winner takes all cards", () => {
  const tied = resolveRound(state({ player: [card("p", 10, 5), card("p2", 30, 5)], cpu: [card("c", 10, 6), card("c2", 20, 6)] }), "power");
  assert.equal(tied.pot.length, 2);
  assert.equal(tied.chooser, "player");
  const won = resolveRound(advanceRound(tied), "power");
  assert.equal(won.lastBattle.cardsWon, 4);
  assert.deepEqual(won.player.map((item) => item.id), ["p", "c", "p2", "c2"]);
});

test("tie exhaustion produces a winner or a draw", () => {
  const playerWins = resolveRound(state({ player: [card("p", 10, 5), card("next", 1, 1)], cpu: [card("c", 10, 6)] }), "power");
  assert.equal(playerWins.outcome, "player");
  assert.equal(playerWins.player.length, 3);
  const draw = resolveRound(state({ player: [card("p", 10, 5)], cpu: [card("c", 10, 6)] }), "power");
  assert.equal(draw.outcome, "draw");
});

test("finished games are immutable and restart creates independent state", () => {
  const finished = resolveRound(state({ player: [card("p", 20, 5)], cpu: [card("c", 10, 9)] }), "power");
  assert.equal(resolveRound(finished, "power"), finished);
  assert.equal(advanceRound(finished), finished);
  const restarted = restartGame(finished, () => 0.75);
  assert.equal(restarted.phase, PHASES.CHOOSING);
  assert.equal(restarted.pot.length, 0);
  assert.equal(restarted.outcome, null);
  assert.notDeepEqual(restarted.player.map((item) => item.id), finished.player.map((item) => item.id));
});
