import { loadDeck } from "./modules/deck.js";
import { advanceRound, chooseCpuStat, createGame, PHASES, resolveRound, restartGame, startGame, statRanges } from "./modules/game-engine.js";

const deckUrl = "data/decks/rally-cars.json";
let deck = null;
let game = null;
let ranges = null;
let cpuTimer = null;

const $ = (id) => document.getElementById(id);
const els = {
  startScreen: $("startScreen"), gameScreen: $("gameScreen"), startButton: $("startButton"), homeButton: $("homeButton"),
  rulesButton: $("rulesButton"), rulesDialog: $("rulesDialog"), closeRulesButton: $("closeRulesButton"), rulesImage: $("rulesImage"),
  coverImage: $("coverImage"), deckSize: $("deckSize"), deckStatus: $("deckStatus"), playerCard: $("playerCard"), cpuCard: $("cpuCard"),
  playerCount: $("playerCount"), cpuCount: $("cpuCount"), turnPill: $("turnPill"), roundTitle: $("roundTitle"),
  roundSubtitle: $("roundSubtitle"), actionHint: $("actionHint"), nextButton: $("nextButton"), endDialog: $("endDialog"),
  endTitle: $("endTitle"), endCopy: $("endCopy"), restartButton: $("restartButton"), cardTemplate: $("cardTemplate")
};

const format = (value) => new Intl.NumberFormat("es-ES").format(value);
const statByKey = (key) => deck.stats.find((stat) => stat.key === key);

function renderCard(container, card, interactive = false) {
  container.innerHTML = "";
  container.classList.remove("card-back");
  container.style.backgroundImage = "";
  const fragment = els.cardTemplate.content.cloneNode(true);
  const image = fragment.querySelector(".card-image");
  image.src = card.image;
  image.alt = `${card.id}: ${card.name}`;
  const stats = fragment.querySelector(".digital-stats");
  deck.stats.forEach((stat) => {
    const value = card.values[stat.key];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "stat-button";
    button.dataset.stat = stat.key;
    button.disabled = !interactive;
    button.setAttribute("aria-label", `${stat.label}: ${format(value)}${stat.unit ? ` ${stat.unit}` : ""}`);
    button.innerHTML = `<span>${stat.label}</span><strong>${format(value)}${stat.unit ? ` ${stat.unit}` : ""}</strong>`;
    if (interactive) button.addEventListener("click", () => playStat(stat.key));
    stats.appendChild(button);
  });
  container.appendChild(fragment);
  container.setAttribute("aria-label", interactive ? `${card.name}. Elige una característica.` : card.name);
}

function renderBack() {
  els.cpuCard.innerHTML = "";
  els.cpuCard.classList.add("card-back");
  els.cpuCard.style.backgroundImage = `url("${deck.back}")`;
  els.cpuCard.setAttribute("aria-label", "Carta rival boca abajo");
}

function updateCounts() {
  els.playerCount.textContent = game.player.length;
  els.cpuCount.textContent = game.cpu.length;
}

function scheduleCpu() {
  window.clearTimeout(cpuTimer);
  cpuTimer = window.setTimeout(() => {
    if (game?.phase !== PHASES.CHOOSING || game.chooser !== "cpu") return;
    playStat(chooseCpuStat(game.cpu[0], deck.stats, ranges));
  }, 650);
}

function renderChoosing() {
  updateCounts();
  els.nextButton.hidden = true;
  els.turnPill.textContent = game.chooser === "player" ? "Tu turno" : "Turno rival";
  els.roundTitle.textContent = game.chooser === "player" ? "Elige una característica" : "El rival está eligiendo";
  els.roundSubtitle.textContent = game.pot.length ? `${game.pot.length} cartas en el bote` : "Sigue la dirección indicada por la baraja";
  els.actionHint.textContent = game.chooser === "player" ? "Selecciona una característica de tu carta" : "La máquina estudia su carta…";
  renderCard(els.playerCard, game.player[0], game.chooser === "player");
  renderBack();
  if (game.chooser === "cpu") scheduleCpu();
}

function highlightBattle() {
  const { statKey, winner } = game.lastBattle;
  const playerButton = els.playerCard.querySelector(`[data-stat="${statKey}"]`);
  const cpuButton = els.cpuCard.querySelector(`[data-stat="${statKey}"]`);
  playerButton?.classList.add("selected");
  cpuButton?.classList.add("selected");
  if (winner === "player") { playerButton?.classList.add("winner"); cpuButton?.classList.add("loser"); }
  if (winner === "cpu") { cpuButton?.classList.add("winner"); playerButton?.classList.add("loser"); }
}

function renderResolved() {
  const battle = game.lastBattle;
  const stat = statByKey(battle.statKey);
  renderCard(els.playerCard, battle.playerCard);
  renderCard(els.cpuCard, battle.cpuCard);
  highlightBattle();
  updateCounts();
  if (!battle.winner) {
    els.turnPill.textContent = "Empate";
    els.roundTitle.textContent = "El bote crece";
    els.roundSubtitle.textContent = `${stat.label}: ${format(battle.playerValue)} ${stat.unit} frente a ${format(battle.cpuValue)} ${stat.unit}`;
    els.actionHint.textContent = `${game.pot.length} cartas esperan ganador. La iniciativa no cambia.`;
  } else {
    const playerWon = battle.winner === "player";
    els.turnPill.textContent = playerWon ? "Ganas la mano" : "Gana el rival";
    els.roundTitle.textContent = playerWon ? "¡Buen adelantamiento!" : "Te ha pasado por delante";
    els.roundSubtitle.textContent = `${stat.label}: ${format(battle.playerValue)} ${stat.unit} frente a ${format(battle.cpuValue)} ${stat.unit}`;
    els.actionHint.textContent = `${playerWon ? "Recibes" : "El rival recibe"} ${battle.cardsWon} cartas y ${playerWon ? "conservas" : "conserva"} la iniciativa.`;
  }
  els.nextButton.textContent = game.phase === PHASES.FINISHED ? "Ver resultado →" : "Siguiente mano →";
  els.nextButton.hidden = false;
}

function playStat(statKey) {
  if (game?.phase !== PHASES.CHOOSING) return;
  game = resolveRound(game, statKey);
  renderResolved();
}

function showEnd() {
  const messages = {
    player: ["¡El garaje es tuyo!", `Has ganado después de ${game.round} manos.`],
    cpu: ["Fin de trayecto", `El rival ha ganado después de ${game.round} manos. ¿Revancha?`],
    draw: ["Empate total", `Nadie conservó una carta para continuar después de ${game.round} manos.`]
  };
  const [title, copy] = messages[game.outcome];
  els.endTitle.textContent = title;
  els.endCopy.textContent = copy;
  if (!els.endDialog.open) els.endDialog.showModal();
}

function nextRound() {
  if (game.phase === PHASES.FINISHED) return showEnd();
  game = advanceRound(game);
  game.phase === PHASES.FINISHED ? showEnd() : renderChoosing();
}

function beginGame(restart = false) {
  game = restart && game ? restartGame(game) : startGame(createGame(deck));
  els.startScreen.hidden = true;
  els.gameScreen.hidden = false;
  if (els.endDialog.open) els.endDialog.close();
  renderChoosing();
}

function goHome() {
  window.clearTimeout(cpuTimer);
  game = deck ? createGame(deck) : null;
  els.gameScreen.hidden = true;
  els.startScreen.hidden = false;
  if (els.endDialog.open) els.endDialog.close();
}

async function initialize() {
  els.startButton.disabled = true;
  try {
    deck = await loadDeck(deckUrl);
    ranges = statRanges(deck);
    game = createGame(deck);
    els.coverImage.src = deck.cover;
    els.coverImage.alt = `Portada de la baraja ${deck.name}`;
    els.rulesImage.src = deck.rulesImage;
    els.deckSize.textContent = deck.cards.length;
    els.deckStatus.textContent = `${deck.name} preparada.`;
    els.startButton.disabled = false;
  } catch (error) {
    els.deckStatus.textContent = `No se pudo cargar la baraja: ${error.message}`;
    els.startButton.firstElementChild.textContent = "Baraja no disponible";
    console.error(error);
  }
}

els.startButton.addEventListener("click", () => beginGame(false));
els.restartButton.addEventListener("click", () => beginGame(true));
els.nextButton.addEventListener("click", nextRound);
els.homeButton.addEventListener("click", goHome);
els.rulesButton.addEventListener("click", () => els.rulesDialog.showModal());
els.closeRulesButton.addEventListener("click", () => els.rulesDialog.close());
els.rulesDialog.addEventListener("click", (event) => { if (event.target === els.rulesDialog) els.rulesDialog.close(); });

initialize();
