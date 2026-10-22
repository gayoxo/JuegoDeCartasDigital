export const SNAPSHOT_VERSION = 1;
export const SNAPSHOT_KEY = "baraja-rally.game.v1";

const phases = new Set(["choosing", "resolved", "finished"]);

export function createSnapshot(game) {
  if (!game || !phases.has(game.phase)) return null;
  const cardId = (card) => card?.id ?? null;
  return {
    version: SNAPSHOT_VERSION,
    deckId: game.deck.id,
    deckSchemaVersion: game.deck.schemaVersion,
    phase: game.phase,
    player: game.player.map(cardId),
    cpu: game.cpu.map(cardId),
    pot: game.pot.map(cardId),
    chooser: game.chooser,
    selected: game.selected,
    round: game.round,
    outcome: game.outcome,
    lastBattle: game.lastBattle ? {
      ...game.lastBattle,
      playerCard: cardId(game.lastBattle.playerCard),
      cpuCard: cardId(game.lastBattle.cpuCard)
    } : null
  };
}

export function restoreSnapshot(value, deck) {
  if (!value || value.version !== SNAPSHOT_VERSION || value.deckId !== deck.id || value.deckSchemaVersion !== deck.schemaVersion) throw new Error("incompatible snapshot");
  if (!phases.has(value.phase) || !Number.isInteger(value.round) || value.round < 1) throw new Error("invalid snapshot state");
  if (!Array.isArray(value.player) || !Array.isArray(value.cpu) || !Array.isArray(value.pot)) throw new Error("invalid snapshot piles");
  const cards = new Map(deck.cards.map((card) => [card.id, card]));
  const hydrate = (ids) => ids.map((id) => {
    if (!cards.has(id)) throw new Error("unknown snapshot card");
    return cards.get(id);
  });
  const allIds = [...value.player, ...value.cpu, ...value.pot];
  if (allIds.length !== deck.cards.length || new Set(allIds).size !== allIds.length) throw new Error("invalid snapshot card set");
  if (!new Set(["player", "cpu"]).has(value.chooser)) throw new Error("invalid snapshot chooser");
  const lastBattle = value.lastBattle ? {
    ...value.lastBattle,
    playerCard: cards.get(value.lastBattle.playerCard),
    cpuCard: cards.get(value.lastBattle.cpuCard)
  } : null;
  if (value.lastBattle && (!lastBattle.playerCard || !lastBattle.cpuCard)) throw new Error("invalid snapshot battle");
  return { ...value, deck, player: hydrate(value.player), cpu: hydrate(value.cpu), pot: hydrate(value.pot), lastBattle };
}

export function saveSnapshot(storage, game) {
  const snapshot = createSnapshot(game);
  if (snapshot) storage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
}

export function loadSnapshot(storage, deck) {
  const raw = storage.getItem(SNAPSHOT_KEY);
  if (!raw) return { game: null, discarded: false };
  try {
    return { game: restoreSnapshot(JSON.parse(raw), deck), discarded: false };
  } catch {
    storage.removeItem(SNAPSHOT_KEY);
    return { game: null, discarded: true };
  }
}

export function clearSnapshot(storage) { storage.removeItem(SNAPSHOT_KEY); }

export function decideBackAction({ rulesOpen, exitConfirmationOpen, endOpen, gameActive }) {
  if (rulesOpen) return "close-rules";
  if (exitConfirmationOpen) return "close-confirmation";
  if (endOpen) return "close-end";
  if (gameActive) return "confirm-exit";
  return "exit-app";
}

export function createListenerRegistration(register) {
  let handle = null;
  return {
    async attach(callback) {
      if (!handle) handle = await register(callback);
      return handle;
    },
    async detach() {
      if (!handle) return;
      const current = handle;
      handle = null;
      await current.remove();
    }
  };
}
