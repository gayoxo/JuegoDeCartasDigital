export const PHASES = Object.freeze({ IDLE: "idle", CHOOSING: "choosing", RESOLVED: "resolved", FINISHED: "finished" });

function copyState(state, changes = {}) {
  return { ...state, player: [...state.player], cpu: [...state.cpu], pot: [...state.pot], ...changes };
}

function randomIndex(length, rng) {
  return Math.min(length - 1, Math.max(0, Math.floor(rng() * length)));
}

export function shuffle(cards, rng = Math.random) {
  const result = [...cards];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1, rng);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function createGame(deck) {
  return {
    phase: PHASES.IDLE,
    deck,
    player: [],
    cpu: [],
    pot: [],
    chooser: null,
    selected: null,
    round: 0,
    lastBattle: null,
    outcome: null
  };
}

export function startGame(game, rng = Math.random) {
  const cards = shuffle(game.deck.cards, rng);
  const half = Math.ceil(cards.length / 2);
  return {
    ...createGame(game.deck),
    phase: PHASES.CHOOSING,
    player: cards.slice(0, half),
    cpu: cards.slice(half),
    chooser: rng() < 0.5 ? "player" : "cpu",
    round: 1
  };
}

export function statRanges(deck) {
  return Object.fromEntries(deck.stats.map((stat) => {
    const values = deck.cards.map((card) => card.values[stat.key]);
    return [stat.key, { min: Math.min(...values), max: Math.max(...values) }];
  }));
}

export function chooseCpuStat(cpuCard, stats, ranges, rng = Math.random) {
  const ranked = stats.map((stat) => {
    const range = ranges[stat.key];
    const span = range.max - range.min;
    const position = span === 0 ? 1 : (cpuCard.values[stat.key] - range.min) / span;
    return { key: stat.key, score: stat.direction === "low" ? 1 - position : position };
  }).sort((a, b) => b.score - a.score);
  const pool = ranked.slice(0, Math.min(2, ranked.length));
  return pool[randomIndex(pool.length, rng)].key;
}

function finishAfterTie(state, battle) {
  const playerHasCard = state.player.length > 0;
  const cpuHasCard = state.cpu.length > 0;
  if (playerHasCard && cpuHasCard) return null;
  if (!playerHasCard && !cpuHasCard) {
    return copyState(state, { phase: PHASES.FINISHED, outcome: "draw", lastBattle: battle });
  }
  const winner = playerHasCard ? "player" : "cpu";
  const winnerCards = [...state[winner], ...state.pot];
  return copyState(state, { [winner]: winnerCards, pot: [], phase: PHASES.FINISHED, outcome: winner, lastBattle: { ...battle, winner } });
}

export function resolveRound(state, statKey) {
  if (state.phase === PHASES.FINISHED) return state;
  if (state.phase !== PHASES.CHOOSING) throw new Error(`Cannot resolve a round in phase '${state.phase}'`);
  const stat = state.deck.stats.find((candidate) => candidate.key === statKey);
  if (!stat) throw new Error(`Unknown stat '${statKey}'`);
  if (!state.player.length || !state.cpu.length) return finishUnavailable(state);

  const playerCard = state.player[0];
  const cpuCard = state.cpu[0];
  const player = state.player.slice(1);
  const cpu = state.cpu.slice(1);
  const pot = [...state.pot, playerCard, cpuCard];
  const playerValue = playerCard.values[statKey];
  const cpuValue = cpuCard.values[statKey];
  const raw = playerValue - cpuValue;
  const comparison = stat.direction === "low" ? -raw : raw;
  const battle = { statKey, playerCard, cpuCard, playerValue, cpuValue, winner: null, cardsWon: 0 };
  let next = copyState(state, { player, cpu, pot, selected: statKey, lastBattle: battle });

  if (comparison === 0) {
    const finished = finishAfterTie(next, battle);
    return finished || copyState(next, { phase: PHASES.RESOLVED });
  }

  const winner = comparison > 0 ? "player" : "cpu";
  const loser = winner === "player" ? "cpu" : "player";
  const cardsWon = pot.length;
  next = copyState(next, {
    [winner]: [...next[winner], ...pot],
    pot: [],
    chooser: winner,
    lastBattle: { ...battle, winner, cardsWon }
  });
  if (next[loser].length === 0) return copyState(next, { phase: PHASES.FINISHED, outcome: winner });
  return copyState(next, { phase: PHASES.RESOLVED });
}

function finishUnavailable(state) {
  const outcome = state.player.length === state.cpu.length ? "draw" : state.player.length ? "player" : "cpu";
  return copyState(state, { phase: PHASES.FINISHED, outcome });
}

export function advanceRound(state) {
  if (state.phase === PHASES.FINISHED) return state;
  if (state.phase !== PHASES.RESOLVED) throw new Error(`Cannot advance a round in phase '${state.phase}'`);
  if (!state.player.length || !state.cpu.length) return finishUnavailable(state);
  return copyState(state, { phase: PHASES.CHOOSING, selected: null, lastBattle: null, round: state.round + 1 });
}

export function restartGame(state, rng = Math.random) {
  return startGame(createGame(state.deck), rng);
}
