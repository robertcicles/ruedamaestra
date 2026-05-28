"use strict";

const rouletteOrder = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
  5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const redNumbers = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const blackNumbers = new Set([2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35]);

const state = {
  balance: 1000,
  selectedChip: 1,
  draggedChip: null,
  bets: new Map(),
  lastBets: new Map(),
  undoStack: [],
  spinning: false,
  rotation: 0,
  lastNet: null,
  history: []
};

const payouts = {
  straight: 35,
  street: 11,
  sixline: 5,
  dozen: 2,
  column: 2,
  even: 1,
  odd: 1,
  red: 1,
  black: 1,
  low: 1,
  high: 1
};

const el = {
  wheel: document.getElementById("wheel"),
  numberRing: document.getElementById("numberRing"),
  ball: document.getElementById("ball"),
  resultNumber: document.getElementById("resultNumber"),
  resultText: document.getElementById("resultText"),
  balance: document.getElementById("balance"),
  currentBet: document.getElementById("currentBet"),
  lastNet: document.getElementById("lastNet"),
  board: document.getElementById("board"),
  boardScroll: document.querySelector(".board-scroll"),
  boardShell: document.querySelector(".board-shell"),
  chips: document.getElementById("chips"),
  betsList: document.getElementById("betsList"),
  history: document.getElementById("history"),
  spinBtn: document.getElementById("spinBtn"),
  repeatBtn: document.getElementById("repeatBtn"),
  doubleBtn: document.getElementById("doubleBtn"),
  undoBtn: document.getElementById("undoBtn"),
  clearBtn: document.getElementById("clearBtn"),
  resetBtn: document.getElementById("resetBtn")
};

function money(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2
  }).format(value);
}

function getNumberColor(n) {
  if (n === 0) return "green";
  if (redNumbers.has(n)) return "red";
  return "black";
}

function wheelColorForNumber(n) {
  if (n === 0) return "#087a43";
  return redNumbers.has(n) ? "#c93636" : "#141414";
}

function buildWheelGradient() {
  const step = 360 / rouletteOrder.length;
  return "conic-gradient(" + rouletteOrder.map((num, i) => {
    const a = (i * step).toFixed(4);
    const b = ((i + 1) * step).toFixed(4);
    return `${wheelColorForNumber(num)} ${a}deg ${b}deg`;
  }).join(", ") + ")";
}

function colorLabel(n) {
  if (n === 0) return "verde";
  return redNumbers.has(n) ? "rojo" : "negro";
}

function secureRandomInt(min, max) {
  const range = max - min + 1;
  if (range <= 0 || range > 0xFFFFFFFF) {
    throw new Error("Rango no válido para el generador aleatorio.");
  }

  const maxUint = 0xFFFFFFFF;
  const limit = maxUint - (maxUint % range);
  const buffer = new Uint32Array(1);

  let x;
  do {
    crypto.getRandomValues(buffer);
    x = buffer[0];
  } while (x >= limit);

  return min + (x % range);
}

function spinRouletteNumber() {
  return secureRandomInt(0, 36);
}

function createWheelNumbers() {
  if (!el.wheel || !el.numberRing) return;

  el.wheel.style.background = buildWheelGradient();
  const radius = 153;
  const step = 360 / rouletteOrder.length;
  el.numberRing.innerHTML = "";

  rouletteOrder.forEach((num, i) => {
    const angle = i * step + step / 2;
    const node = document.createElement("div");
    node.className = "ring-num";
    node.textContent = num;
    node.style.transform = `rotate(${angle}deg) translateY(-${radius}px) rotate(90deg)`;
    el.numberRing.appendChild(node);
  });
}

function betName(bet) {
  if (bet.type === "straight") return `Pleno al ${bet.value}`;
  if (bet.type === "street") return `Calle ${((bet.value - 1) * 3) + 1}-${((bet.value - 1) * 3) + 3}`;
  if (bet.type === "sixline") return `Seisena ${bet.value}`;
  if (bet.type === "dozen") return `${bet.value}ª docena`;
  if (bet.type === "column") return `${bet.value}ª columna`;
  if (bet.type === "red") return "Rojo";
  if (bet.type === "black") return "Negro";
  if (bet.type === "even") return "Par";
  if (bet.type === "odd") return "Impar";
  if (bet.type === "low") return "1–18";
  if (bet.type === "high") return "19–36";
  return bet.id;
}

function isWinningBet(bet, number) {
  if (bet.type === "straight") return number === bet.value;
  if (number === 0) return false;

  if (bet.type === "street") {
    const start = (bet.value - 1) * 3 + 1;
    return number >= start && number <= start + 2;
  }

  if (bet.type === "sixline") {
    const start = (bet.value - 1) * 6 + 1;
    return number >= start && number <= start + 5;
  }

  if (bet.type === "dozen") {
    return (
      (bet.value === 1 && number >= 1 && number <= 12) ||
      (bet.value === 2 && number >= 13 && number <= 24) ||
      (bet.value === 3 && number >= 25 && number <= 36)
    );
  }

  if (bet.type === "column") return ((number - 1) % 3) + 1 === bet.value;
  if (bet.type === "red") return redNumbers.has(number);
  if (bet.type === "black") return blackNumbers.has(number);
  if (bet.type === "even") return number % 2 === 0;
  if (bet.type === "odd") return number % 2 === 1;
  if (bet.type === "low") return number >= 1 && number <= 18;
  if (bet.type === "high") return number >= 19 && number <= 36;

  return false;
}

function calculateOutcome(number) {
  let totalStake = 0;
  let totalReturn = 0;
  const details = [];

  for (const bet of state.bets.values()) {
    totalStake += bet.amount;
    const win = isWinningBet(bet, number);
    if (win) {
      const paid = bet.amount * (payouts[bet.type] + 1);
      totalReturn += paid;
      details.push({ name: betName(bet), amount: bet.amount, paid, win: true });
    } else {
      details.push({ name: betName(bet), amount: bet.amount, paid: 0, win: false });
    }
  }

  return {
    totalStake,
    totalReturn,
    net: totalReturn - totalStake,
    details
  };
}

function placeBet(bet) {
  placeBetWithAmount(bet, state.selectedChip);
}

function placeBetWithAmount(bet, amount) {
  if (state.spinning) return;
  if (state.balance < amount) {
    flashMessage("Saldo insuficiente para apostar esta ficha.", "lose");
    return;
  }

  saveUndoSnapshot();

  const current = state.bets.get(bet.id);
  if (current) {
    current.amount += amount;
    current.lastChip = amount;
  } else {
    state.bets.set(bet.id, { ...bet, amount, lastChip: amount });
  }

  state.balance -= amount;
  render();
}

function getBetDefinitionById(id) {
  const cell = document.querySelector(`[data-bet-id="${id}"]`);
  if (!cell || !cell.__betDefinition) return null;
  return { ...cell.__betDefinition };
}

function cloneBets(sourceMap) {
  return new Map([...sourceMap.entries()].map(([id, bet]) => [id, { ...bet }]));
}

function saveUndoSnapshot() {
  state.undoStack.push({
    balance: state.balance,
    bets: cloneBets(state.bets)
  });

  if (state.undoStack.length > 60) {
    state.undoStack.shift();
  }
}

function clearUndoHistory() {
  state.undoStack = [];
}

function undoLastAction() {
  if (state.spinning || state.undoStack.length === 0) return;

  const previous = state.undoStack.pop();
  state.balance = previous.balance;
  state.bets = cloneBets(previous.bets);
  render();

  flashMessage("Última acción deshecha.");
}

function totalAmount(map) {
  return [...map.values()].reduce((sum, bet) => sum + bet.amount, 0);
}

function setActiveBetsFromMap(sourceMap) {
  const needed = totalAmount(sourceMap);
  if (sourceMap.size === 0) {
    flashMessage("Todavía no hay ninguna apuesta anterior para repetir.", "lose");
    return false;
  }

  if (state.balance < needed) {
    flashMessage(`Saldo insuficiente. Necesitas ${money(needed)} para reapostar.`, "lose");
    return false;
  }

  saveUndoSnapshot();
  state.bets.clear();
  state.bets = cloneBets(sourceMap);
  state.balance -= needed;
  render();
  return true;
}

function repeatBets() {
  if (state.spinning) return;
  setActiveBetsFromMap(state.lastBets);
}

function doubleBets() {
  if (state.spinning) return;

  if (state.bets.size === 0) {
    if (!setActiveBetsFromMap(state.lastBets)) return;
  }

  const needed = totalAmount(state.bets);
  if (needed === 0) {
    flashMessage("No hay apuestas para doblar.", "lose");
    return;
  }

  if (state.balance < needed) {
    flashMessage(`Saldo insuficiente. Necesitas ${money(needed)} para doblar.`, "lose");
    return;
  }

  saveUndoSnapshot();

  for (const bet of state.bets.values()) {
    bet.amount *= 2;
  }

  state.balance -= needed;
  render();
}

function getBetCellFromPoint(x, y) {
  const target = document.elementFromPoint(x, y);
  return target ? target.closest(".bet-cell") : null;
}

function startChipDrag(event, value, sourceChip) {
  if (state.spinning) return;

  event.preventDefault();

  state.draggedChip = value;
  state.selectedChip = value;
  renderChips();

  sourceChip.classList.add("dragging");
  sourceChip.setPointerCapture?.(event.pointerId);

  const ghost = document.createElement("div");
  ghost.className = "ghost-chip";
  ghost.textContent = formatChipValue(value);
  ghost.style.setProperty("--chip-bg", chipColor(value).bg);
  ghost.style.setProperty("--chip-border", chipColor(value).border);
  ghost.style.setProperty("--chip-text", chipColor(value).text);
  document.body.appendChild(ghost);

  const moveGhost = (clientX, clientY) => {
    ghost.style.left = `${clientX}px`;
    ghost.style.top = `${clientY}px`;
  };

  const clearDragOver = () => {
    document.querySelectorAll(".bet-cell.drag-over").forEach(cell => {
      cell.classList.remove("drag-over");
    });
  };

  const onMove = moveEvent => {
    moveGhost(moveEvent.clientX, moveEvent.clientY);
    clearDragOver();

    const cell = getBetCellFromPoint(moveEvent.clientX, moveEvent.clientY);
    if (cell) cell.classList.add("drag-over");
  };

  const onUp = upEvent => {
    sourceChip.classList.remove("dragging");
    sourceChip.releasePointerCapture?.(event.pointerId);

    const cell = getBetCellFromPoint(upEvent.clientX, upEvent.clientY);
    if (cell?.dataset?.betId) {
      const bet = getBetDefinitionById(cell.dataset.betId);
      if (bet) placeBetWithAmount(bet, value);
    }

    clearDragOver();
    ghost.remove();
    state.draggedChip = null;

    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
  };

  moveGhost(event.clientX, event.clientY);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
}

function formatChipValue(value) {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: value < 1 ? 1 : 0,
    maximumFractionDigits: 1
  }).format(value);
}

function chipColor(value) {
  const colors = {
    0.1: { bg: "#f6f8ff", border: "#6b8cff", text: "#10152b" },
    0.5: { bg: "#fff3d8", border: "#d99b23", text: "#241600" },
    1: { bg: "#f8f4e8", border: "#b94848", text: "#171717" },
    5: { bg: "#e9fff1", border: "#1f9f63", text: "#062515" },
    10: { bg: "#eef5ff", border: "#2667c9", text: "#06162e" },
    25: { bg: "#fff0f5", border: "#cf3d74", text: "#310719" },
    50: { bg: "#f4efff", border: "#7a4ed8", text: "#170930" },
    100: { bg: "#111827", border: "#d8b46a", text: "#fff7db" }
  };
  return colors[value] || colors[1];
}

function buildChips() {
  if (!el.chips) return;
  [0.1, 0.5, 1, 5, 10, 25, 50, 100].forEach(value => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = formatChipValue(value);
    chip.setAttribute("aria-label", `Ficha de ${formatChipValue(value)} euros`);
    chip.dataset.value = value;
    chip.style.setProperty("--chip-bg", chipColor(value).bg);
    chip.style.setProperty("--chip-border", chipColor(value).border);
    chip.style.setProperty("--chip-text", chipColor(value).text);

    chip.addEventListener("click", () => {
      if (state.draggedChip !== null) return;
      state.selectedChip = value;
      renderChips();
    });

    chip.addEventListener("pointerdown", event => startChipDrag(event, value, chip));

    el.chips.appendChild(chip);
  });
  renderChips();
  requestAnimationFrame(resizeBoardToContainer);
}

function renderChips() {
  if (!el.chips) return;
  [...el.chips.children].forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.value) === state.selectedChip);
  });
}

function makeCell(text, bet, className = "") {
  const cell = document.createElement("button");
  cell.className = `bet-cell ${className}`.trim();
  cell.textContent = text;
  cell.addEventListener("click", () => placeBet(bet));
  cell.dataset.betId = bet.id;
  cell.__betDefinition = { ...bet };
  return cell;
}

function buildBoard() {
  if (!el.board) return;
  el.board.innerHTML = "";

  const zero = makeCell("0", { id: "n-0", type: "straight", value: 0 }, "green zero");
  el.board.appendChild(zero);

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 12; col++) {
      const number = 3 * (col + 1) - row;
      const color = getNumberColor(number);
      const street = Math.ceil(number / 3);
      const mobileCol = ((number - 1) % 3) + 1;
      const numberCell = makeCell(String(number), { id: `n-${number}`, type: "straight", value: number }, `${color} num-cell`);
      numberCell.style.setProperty("--m-row", street);
      numberCell.style.setProperty("--m-col", mobileCol);
      el.board.appendChild(numberCell);
    }

    const columnValue = row === 0 ? 3 : row === 1 ? 2 : 1;
    const colCell = makeCell(`2:1`, { id: `c-${columnValue}`, type: "column", value: columnValue }, `outside-zone col-bet col-${row + 1}`);
    colCell.style.setProperty("--m-col", columnValue);
    el.board.appendChild(colCell);
  }

  const dozen1 = makeCell("1ª docena", { id: "d-1", type: "dozen", value: 1 }, "outside-zone dozen-1");
  const dozen2 = makeCell("2ª docena", { id: "d-2", type: "dozen", value: 2 }, "outside-zone dozen-2");
  const dozen3 = makeCell("3ª docena", { id: "d-3", type: "dozen", value: 3 }, "outside-zone dozen-3");

  const streetBets = Array.from({ length: 12 }, (_, i) => {
    const start = i * 3 + 1;
    return [`${start}-${start + 2}`, { id: `st-${i + 1}`, type: "street", value: i + 1 }, `street street-${i + 1}`];
  });

  streetBets.forEach(([label, bet, cls], index) => {
    const streetCell = makeCell(label, bet, cls);
    streetCell.style.setProperty("--m-row", index + 1);
    el.board.appendChild(streetCell);
  });

  el.board.appendChild(dozen1);
  el.board.appendChild(dozen2);
  el.board.appendChild(dozen3);

  const sixlineBets = [
    ["1–6", { id: "s-1", type: "sixline", value: 1 }, "six-1"],
    ["7–12", { id: "s-2", type: "sixline", value: 2 }, "six-2"],
    ["13–18", { id: "s-3", type: "sixline", value: 3 }, "six-3"],
    ["19–24", { id: "s-4", type: "sixline", value: 4 }, "six-4"],
    ["25–30", { id: "s-5", type: "sixline", value: 5 }, "six-5"],
    ["31–36", { id: "s-6", type: "sixline", value: 6 }, "six-6"]
  ];

  sixlineBets.forEach(([label, bet, cls]) => {
    el.board.appendChild(makeCell(label, bet, `${cls} sixline outside-zone`));
  });

  const outsideBets = [
    ["1–18", { id: "low", type: "low" }, "outside-zone low"],
    ["Par", { id: "even", type: "even" }, "outside-zone even"],
    ["Rojo", { id: "red", type: "red" }, "outside-zone red red-out"],
    ["Negro", { id: "black", type: "black" }, "outside-zone black black-out"],
    ["Impar", { id: "odd", type: "odd" }, "outside-zone odd"],
    ["19–36", { id: "high", type: "high" }, "outside-zone high"]
  ];

  outsideBets.forEach(([label, bet, cls]) => {
    el.board.appendChild(makeCell(label, bet, cls));
  });
}

function renderBoardTokens() {
  document.querySelectorAll(".token").forEach(t => t.remove());

  for (const bet of state.bets.values()) {
    const cell = document.querySelector(`[data-bet-id="${bet.id}"]`);
    if (!cell) continue;

    const token = document.createElement("span");
    token.className = "token";
    token.textContent = money(bet.amount).replace(/\s?€/g, "");
    const colors = chipColor(bet.lastChip || 1);
    token.style.setProperty("--chip-bg", colors.bg);
    token.style.setProperty("--chip-border", colors.border);
    token.style.setProperty("--chip-text", colors.text);
    cell.appendChild(token);
  }
}

function renderBetsList() {
  if (!el.betsList) return;
  el.betsList.innerHTML = "";

  if (state.bets.size === 0) {
    const empty = document.createElement("div");
    empty.className = "row";
    empty.innerHTML = `<span>No hay apuestas activas.</span><strong>—</strong>`;
    el.betsList.appendChild(empty);
    return;
  }

  for (const bet of state.bets.values()) {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<span>${betName(bet)}</span><strong>${money(bet.amount)}</strong>`;
    el.betsList.appendChild(row);
  }
}

function renderHistory() {
  if (!el.history) return;
  el.history.innerHTML = "";

  state.history.slice(0, 18).forEach(num => {
    const ball = document.createElement("div");
    ball.className = `mini-ball ${getNumberColor(num)}`;
    ball.textContent = num;
    ball.style.background = getComputedStyle(document.documentElement).getPropertyValue(`--${getNumberColor(num)}`).trim();
    el.history.appendChild(ball);
  });
}

function render() {
  const totalBet = [...state.bets.values()].reduce((sum, bet) => sum + bet.amount, 0);

  if (el.balance) el.balance.textContent = money(state.balance);
  if (el.currentBet) el.currentBet.textContent = money(totalBet);
  if (el.lastNet) {
    el.lastNet.textContent = state.lastNet === null ? "—" : `${state.lastNet >= 0 ? "+" : ""}${money(state.lastNet)}`;
    el.lastNet.className = state.lastNet === null ? "" : state.lastNet >= 0 ? "win" : "lose";
  }

  renderBoardTokens();
  renderBetsList();
  renderHistory();

  if (el.spinBtn) el.spinBtn.disabled = state.spinning;
  if (el.repeatBtn) el.repeatBtn.disabled = state.spinning || state.lastBets.size === 0;
  if (el.doubleBtn) el.doubleBtn.disabled = state.spinning || (state.bets.size === 0 && state.lastBets.size === 0);
  if (el.undoBtn) el.undoBtn.disabled = state.spinning || state.undoStack.length === 0;
  if (el.clearBtn) el.clearBtn.disabled = state.spinning || state.bets.size === 0;
  if (el.resetBtn) el.resetBtn.disabled = state.spinning;

  renderChips();
}

function flashMessage(text, cls = "") {
  if (!el.resultText) return;
  el.resultText.className = cls;
  el.resultText.textContent = text;
  setTimeout(() => {
    if (el.resultText) el.resultText.className = "";
  }, 1200);
}

function setResultVisual(number) {
  if (!el.resultNumber) return;
  const color = getNumberColor(number);
  el.resultNumber.textContent = number;
  el.resultNumber.style.background = `var(--${color})`;
  if (el.resultText) el.resultText.innerHTML = `Ha salido el <strong>${number}</strong> (${colorLabel(number)}).`;
}

function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

function animateWheelToNumber(number) {
  const index = rouletteOrder.indexOf(number);
  const step = 360 / rouletteOrder.length;
  const targetAngle = index * step + step / 2;

  const currentAngle = normalizeDegrees(state.rotation);
  const desiredAngle = normalizeDegrees(360 - targetAngle);
  const deltaToWinner = normalizeDegrees(desiredAngle - currentAngle);

  const extraSpins = secureRandomInt(7, 11) * 360;
  const finalRotation = state.rotation + extraSpins + deltaToWinner;

  state.rotation = finalRotation;

  if (el.wheel) el.wheel.style.transform = `rotate(${finalRotation}deg)`;
  if (el.numberRing) el.numberRing.style.transform = `rotate(${finalRotation}deg)`;
  if (el.ball) el.ball.style.transform = `rotate(0deg) translateY(0)`;
}

function spin() {
  if (state.spinning) return;

  state.spinning = true;
  render();

  const number = spinRouletteNumber();
  animateWheelToNumber(number);

  if (el.resultText) {
    el.resultText.textContent = "La bola está girando...";
    el.resultText.className = "";
  }

  window.setTimeout(() => {
    const outcome = calculateOutcome(number);
    const hadBets = state.bets.size > 0;

    if (hadBets) {
      state.lastBets = cloneBets(state.bets);
    }

    state.balance += outcome.totalReturn;
    state.lastNet = hadBets ? outcome.net : null;
    state.history.unshift(number);

    setResultVisual(number);

    if (el.resultText) {
      if (hadBets) {
        const detail = outcome.net >= 0
          ? `<span class="win">Ganancia neta: ${money(outcome.net)}</span>`
          : `<span class="lose">Pérdida neta: ${money(Math.abs(outcome.net))}</span>`;

        el.resultText.innerHTML += `<br>${detail}`;
        state.bets.clear();
        clearUndoHistory();
      } else {
        el.resultText.innerHTML += `<br><span>Giro sin apuesta.</span>`;
      }
    }

    state.spinning = false;
    render();
  }, 4500);
}

function clearBets(refund = true) {
  if (state.spinning) return;

  if (refund && state.bets.size > 0) {
    saveUndoSnapshot();
    const refundAmount = totalAmount(state.bets);
    state.balance += refundAmount;
  }

  state.bets.clear();
  render();
}

function resetGame() {
  if (state.spinning) return;

  state.balance = 1000;
  state.bets.clear();
  state.lastBets.clear();
  clearUndoHistory();
  state.history = [];
  state.lastNet = null;
  if (el.resultNumber) {
    el.resultNumber.textContent = "—";
    el.resultNumber.style.background = "var(--green)";
  }
  if (el.resultText) {
    el.resultText.className = "";
    el.resultText.textContent = "Haz tus apuestas y gira la ruleta.";
  }
  render();
}

function resizeBoardToContainer() {
  if (!el.boardShell || !el.boardScroll) return;

  const portraitMobile = window.matchMedia("(max-width: 700px) and (orientation: portrait)").matches;

  el.boardShell.style.transform = "scale(1)";
  el.boardScroll.style.height = "auto";

  if (portraitMobile) {
    return;
  }

  const available = el.boardScroll.clientWidth;
  const naturalWidth = el.boardShell.offsetWidth;
  const naturalHeight = el.boardShell.offsetHeight;

  if (!available || !naturalWidth) return;

  const scale = Math.min(1, available / naturalWidth);
  el.boardShell.style.transform = `scale(${scale})`;
  el.boardScroll.style.height = `${Math.ceil(naturalHeight * scale) + 6}px`;
}

function initSimulator() {
  if (!el.wheel || !el.numberRing || !el.board || !el.chips) return;

  createWheelNumbers();
  buildChips();
  buildBoard();
  render();
  resizeBoardToContainer();

  window.addEventListener("resize", resizeBoardToContainer);
  if (el.spinBtn) el.spinBtn.addEventListener("click", spin);
  if (el.repeatBtn) el.repeatBtn.addEventListener("click", repeatBets);
  if (el.doubleBtn) el.doubleBtn.addEventListener("click", doubleBets);
  if (el.undoBtn) el.undoBtn.addEventListener("click", undoLastAction);
  if (el.clearBtn) el.clearBtn.addEventListener("click", () => clearBets(true));
  if (el.resetBtn) el.resetBtn.addEventListener("click", resetGame);
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initSimulator);
} else {
  initSimulator();
}
