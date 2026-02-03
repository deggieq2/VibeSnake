const GRID_SIZE = 20;
const TICK_MS = 140;
const MAX_QUEUE = 2;
const BONUS_SCORE = 5;
const BONUS_TTL = 35;
const BONUS_SPAWN_CHANCE = 0.06;
const HAZARD_TTL = 55;
const HAZARD_SPAWN_CHANCE = 0.05;
const MAX_HAZARDS = 3;
const HIGH_SCORE_KEY = "vibesnake_highscores";
const MAX_HIGH_SCORES = 10;
const GLOBAL_LEADERBOARD_URL = "https://vibesnake-leaderboard.daryl-e86.workers.dev/api/leaderboard";
const LOCAL_DEV_LEADERBOARD_URL = "http://localhost:8787/api/leaderboard";

const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const THEMES = [
  {
    id: "meadow",
    name: "Meadow",
    ui: {
      "--bg": "#eef7b2",
      "--panel": "#fff4d4",
      "--text": "#2a241a",
      "--muted": "#7c6a4d",
      "--panel-border": "#e6c78d",
      "--panel-shadow": "#e6c78d",
      "--button-border": "#e3b861",
      "--button-shadow": "#e3b861",
      "--button-bg": "#fff2c7",
      "--canvas-bg": "#f9f1c6",
      "--overlay-bg": "rgba(255, 247, 216, 0.78)",
    },
    palette: {
      canvas: "#f9f1c6",
      grid: "#e5d2a3",
      snake: "#63d36d",
      snakeHead: "#56c95f",
      snakeStroke: "#2f7a3c",
      food: "#ff6b6b",
      foodLeaf: "#4acb6b",
      foodStem: "#6b4f2a",
      bonus: "#ffdf4d",
      bonusStroke: "#c58a1a",
      hazard: "#8c5a2b",
      hazardStroke: "#5b3719",
      eyeWhite: "#ffffff",
      eyePupil: "#2a241a",
    },
    fruits: [
      { id: "apple", color: "#ff4242" },
      { id: "berry", color: "#7c3aed" },
      { id: "peach", color: "#ff9f5a" },
    ],
    bonusItems: [
      { id: "star", color: "#ffdf4d" },
      { id: "coin", color: "#ffe07a" },
    ],
    hazards: [
      { id: "thorns", color: "#8c5a2b" },
      { id: "rock", color: "#6b5a4a" },
    ],
  },
  {
    id: "jungle",
    name: "Jungle",
    ui: {
      "--bg": "#1d3a2a",
      "--panel": "#1f3d2e",
      "--text": "#f1f7ea",
      "--muted": "#b8c8b1",
      "--panel-border": "#2b5b41",
      "--panel-shadow": "#173025",
      "--button-border": "#2b5b41",
      "--button-shadow": "#173025",
      "--button-bg": "#244737",
      "--canvas-bg": "#1d3a2a",
      "--overlay-bg": "rgba(25, 44, 33, 0.78)",
    },
    palette: {
      canvas: "#1d3a2a",
      grid: "#2a4f3a",
      snake: "#2fb66b",
      snakeHead: "#3ed07c",
      snakeStroke: "#0f4f2a",
      food: "#ffb347",
      foodLeaf: "#4acb6b",
      foodStem: "#7a5b2b",
      bonus: "#ffd24a",
      bonusStroke: "#b87812",
      hazard: "#b6412f",
      hazardStroke: "#5e1f14",
      eyeWhite: "#f9f7ef",
      eyePupil: "#1a1a1a",
    },
    fruits: [
      { id: "banana", color: "#ffd24a" },
      { id: "mango", color: "#ff9f1a" },
      { id: "papaya", color: "#ff7b54" },
    ],
    bonusItems: [
      { id: "totem", color: "#ffd24a" },
      { id: "gem", color: "#4ae7c0" },
    ],
    hazards: [
      { id: "vines", color: "#b6412f" },
      { id: "spikes", color: "#8b1c1c" },
    ],
  },
  {
    id: "desert",
    name: "Desert",
    ui: {
      "--bg": "#f5d59a",
      "--panel": "#fff0cf",
      "--text": "#5a3f21",
      "--muted": "#8c6c46",
      "--panel-border": "#e6c28b",
      "--panel-shadow": "#d7b176",
      "--button-border": "#e0b071",
      "--button-shadow": "#c89458",
      "--button-bg": "#ffe5b4",
      "--canvas-bg": "#f4e2b9",
      "--overlay-bg": "rgba(255, 244, 216, 0.82)",
    },
    palette: {
      canvas: "#f4e2b9",
      grid: "#e5c98e",
      snake: "#d9a166",
      snakeHead: "#e6b57a",
      snakeStroke: "#9b6a37",
      food: "#ff7a59",
      foodLeaf: "#5bbd74",
      foodStem: "#8a5a2b",
      bonus: "#ffc93a",
      bonusStroke: "#b87512",
      hazard: "#7b4f24",
      hazardStroke: "#4d2f12",
      eyeWhite: "#fff7ef",
      eyePupil: "#3b2b1a",
    },
    fruits: [
      { id: "cactus", color: "#ff5aa5" },
      { id: "date", color: "#c2652f" },
      { id: "orange", color: "#ff9b1a" },
    ],
    bonusItems: [
      { id: "relic", color: "#ffc93a" },
      { id: "sun", color: "#ffcc55" },
    ],
    hazards: [
      { id: "bones", color: "#7b4f24" },
      { id: "cactus-spike", color: "#8a5a2b" },
    ],
  },
];

function createInitialState(rng = Math.random, theme = currentTheme) {
  const start = {
    snake: [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 },
    ],
    direction: "right",
    nextDirection: "right",
    food: null,
    bonus: null,
    hazards: [],
    score: 0,
    status: "running",
  };

  start.food = spawnFood(start.snake, rng, theme, null, []);
  return start;
}

function spawnFood(snake, rng, theme, bonus, hazards) {
  const occupied = buildOccupied(snake, null, bonus, hazards);
  const point = spawnAtEmpty(occupied, rng);
  if (!point) return null;
  return { ...point, type: pickOne(theme.fruits, rng) };
}

function spawnBonus(snake, food, hazards, rng, theme) {
  const occupied = buildOccupied(snake, food, null, hazards);
  const point = spawnAtEmpty(occupied, rng);
  if (!point) return null;
  return { ...point, ttl: BONUS_TTL, type: pickOne(theme.bonusItems, rng) };
}

function spawnHazard(snake, food, bonus, hazards, rng, theme) {
  const occupied = buildOccupied(snake, food, bonus, hazards);
  const sizeOrder = rng() < 0.5 ? [2, 3] : [3, 2];
  for (const size of sizeOrder) {
    const point = spawnAreaAtEmpty(occupied, rng, size);
    if (point) {
      return { ...point, size, ttl: HAZARD_TTL, type: pickOne(theme.hazards, rng) };
    }
  }
  return null;
}

function buildOccupied(snake, food, bonus, hazards) {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  if (food) occupied.add(`${food.x},${food.y}`);
  if (bonus) occupied.add(`${bonus.x},${bonus.y}`);
  hazards.forEach((hazard) => {
    const size = hazard.size || 1;
    for (let dy = 0; dy < size; dy += 1) {
      for (let dx = 0; dx < size; dx += 1) {
        occupied.add(`${hazard.x + dx},${hazard.y + dy}`);
      }
    }
  });
  return occupied;
}

function spawnAtEmpty(occupied, rng) {
  const empty = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        empty.push({ x, y });
      }
    }
  }
  if (empty.length === 0) {
    return null;
  }
  const idx = Math.floor(rng() * empty.length);
  return empty[idx];
}

function spawnAreaAtEmpty(occupied, rng, size) {
  const empty = [];
  for (let y = 0; y <= GRID_SIZE - size; y += 1) {
    for (let x = 0; x <= GRID_SIZE - size; x += 1) {
      let open = true;
      for (let dy = 0; dy < size && open; dy += 1) {
        for (let dx = 0; dx < size; dx += 1) {
          if (occupied.has(`${x + dx},${y + dy}`)) {
            open = false;
            break;
          }
        }
      }
      if (open) empty.push({ x, y });
    }
  }
  if (empty.length === 0) return null;
  const idx = Math.floor(rng() * empty.length);
  return empty[idx];
}

function pickOne(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

function step(state, inputDirection, rng = Math.random, theme = currentTheme) {
  if (state.status !== "running") {
    return state;
  }

  const nextDirection = isValidTurn(state.direction, inputDirection)
    ? inputDirection
    : state.direction;

  const dirVector = DIRECTIONS[nextDirection];
  const head = state.snake[0];
  const newHead = { x: head.x + dirVector.x, y: head.y + dirVector.y };

  if (!isInside(newHead)) {
    return { ...state, status: "game-over", direction: nextDirection };
  }

  const willEat = state.food && newHead.x === state.food.x && newHead.y === state.food.y;
  const hitsBonus = state.bonus && newHead.x === state.bonus.x && newHead.y === state.bonus.y;
  const hitsHazard = state.hazards.some((hazard) => isPointInHazard(newHead, hazard));
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  if (bodyToCheck.some((part) => part.x === newHead.x && part.y === newHead.y)) {
    return { ...state, status: "game-over", direction: nextDirection };
  }
  if (hitsHazard) {
    return { ...state, status: "game-over", direction: nextDirection };
  }

  const newSnake = [newHead, ...state.snake];
  if (!willEat) {
    newSnake.pop();
  }

  const remainingBonus = hitsBonus ? null : state.bonus;
  const nextFood = willEat
    ? spawnFood(newSnake, rng, theme, remainingBonus, state.hazards)
    : state.food;
  const nextScore =
    state.score + (willEat ? 1 : 0) + (hitsBonus ? BONUS_SCORE : 0);

  let nextBonus = remainingBonus ? { ...remainingBonus, ttl: remainingBonus.ttl - 1 } : null;
  if (nextBonus && nextBonus.ttl <= 0) {
    nextBonus = null;
  }

  let nextHazards = state.hazards
    .map((hazard) => ({ ...hazard, ttl: hazard.ttl - 1 }))
    .filter((hazard) => hazard.ttl > 0);

  if (!nextBonus && rng() < BONUS_SPAWN_CHANCE) {
    const spawnedBonus = spawnBonus(newSnake, nextFood, nextHazards, rng, theme);
    if (spawnedBonus) {
      nextBonus = spawnedBonus;
    }
  }

  if (nextHazards.length < MAX_HAZARDS && rng() < HAZARD_SPAWN_CHANCE) {
    const spawnedHazard = spawnHazard(
      newSnake,
      nextFood,
      nextBonus,
      nextHazards,
      rng,
      theme
    );
    if (spawnedHazard) {
      nextHazards = [...nextHazards, spawnedHazard];
    }
  }
  const status = nextFood ? "running" : "won";

  return {
    ...state,
    snake: newSnake,
    direction: nextDirection,
    nextDirection,
    food: nextFood,
    bonus: nextBonus,
    hazards: nextHazards,
    score: nextScore,
    status,
  };
}

function isValidTurn(current, next) {
  if (!next) return false;
  return OPPOSITES[current] !== next;
}

function isInside(point) {
  return point.x >= 0 && point.x < GRID_SIZE && point.y >= 0 && point.y < GRID_SIZE;
}

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreValueEl = document.getElementById("highScoreValue");
const highScoreNameEl = document.getElementById("highScoreName");
const overlay = document.getElementById("overlay");
const themeNameEl = document.getElementById("themeName");
const highscorePrompt = document.getElementById("highscorePrompt");
const highscoreForm = document.getElementById("highscoreForm");
const highscoreInput = document.getElementById("highScoreInput");
const highscoreSkip = document.getElementById("highScoreSkip");
const leaderboardList = document.getElementById("leaderboardList");

let cellSize = 20;
let currentTheme = THEMES[0];
let colors = { ...currentTheme.palette };
let highScores = loadLocalHighScores();
let leaderboardMode = "local";

let state = createInitialState(Math.random, currentTheme);
let directionQueue = [];
let timer = null;
let paused = false;
let awaitingName = false;

function start() {
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(tick, TICK_MS);
}

function tick() {
  if (paused) {
    return;
  }
  const prevStatus = state.status;
  const inputDirection = directionQueue.shift();
  state = step(state, inputDirection, Math.random, currentTheme);
  render();
  if (prevStatus === "running" && state.status !== "running") {
    handleGameEnd();
  }
  if (state.status === "game-over" || state.status === "won") {
    stop();
  }
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function reset(options = {}) {
  const { keepTheme = false } = options;
  if (!keepTheme) {
    applyTheme(pickRandomTheme());
  }
  state = createInitialState(Math.random, currentTheme);
  directionQueue = [];
  paused = false;
  awaitingName = false;
  highscorePrompt.classList.remove("show");
  overlay.classList.remove("show");
  overlay.textContent = "";
  start();
  render();
}

function togglePause() {
  if (state.status !== "running") {
    return;
  }
  paused = !paused;
  overlay.textContent = paused ? "Paused" : "";
  overlay.classList.toggle("show", paused);
}

function render() {
  const boardSize = cellSize * GRID_SIZE;
  ctx.fillStyle = colors.canvas;
  ctx.fillRect(0, 0, boardSize, boardSize);

  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = Math.max(1, cellSize * 0.05);
  for (let i = 0; i <= GRID_SIZE; i += 1) {
    const pos = i * cellSize + 0.5;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, boardSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(boardSize, pos);
    ctx.stroke();
  }

  state.hazards.forEach((hazard) => {
    drawHazard(hazard);
  });

  if (state.food) {
    drawFood(state.food, state.food.type);
  }

  if (state.bonus) {
    drawBonus(state.bonus);
  }

  state.snake.forEach((segment, index) => {
    const fill = index === 0 ? colors.snakeHead : colors.snake;
    drawRoundedCell(segment, fill, colors.snakeStroke);
    if (index === 0) {
      drawEyes(segment, state.direction);
    }
  });

  scoreEl.textContent = String(state.score);

  if (state.status === "game-over") {
    if (!awaitingName) {
      overlay.textContent = `Game over. Score ${state.score}. Press Enter to restart.`;
      overlay.classList.add("show");
    }
  }

  if (state.status === "won") {
    if (!awaitingName) {
      overlay.textContent = `You win! Score ${state.score}. Press Enter to restart.`;
      overlay.classList.add("show");
    }
  }
}

function drawRoundedCell(point, fill, stroke) {
  const padding = Math.max(1, cellSize * 0.1);
  const size = cellSize - padding * 2;
  const x = point.x * cellSize + padding;
  const y = point.y * cellSize + padding;
  const radius = Math.min(size * 0.35, cellSize * 0.45);
  ctx.fillStyle = fill;
  roundRect(x, y, size, size, radius);
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(1, cellSize * 0.08);
    ctx.stroke();
  }
}

function roundRect(x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawFood(point, fruit) {
  const type = fruit || { id: "apple", color: colors.food };
  switch (type.id) {
    case "berry":
      drawBerry(point, type.color);
      break;
    case "peach":
      drawPeach(point, type.color);
      break;
    case "banana":
      drawBanana(point, type.color);
      break;
    case "mango":
      drawMango(point, type.color);
      break;
    case "papaya":
      drawPapaya(point, type.color);
      break;
    case "cactus":
      drawCactusFruit(point, type.color);
      break;
    case "date":
      drawDate(point, type.color);
      break;
    case "orange":
      drawOrange(point, type.color);
      break;
    default:
      drawApple(point, type.color);
  }
}

function drawApple(point, color) {
  const { centerX, centerY, radius } = fruitMetrics(point, 0.32);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY + 1, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = colors.foodStem;
  ctx.lineWidth = Math.max(1.5, cellSize * 0.08);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius);
  ctx.lineTo(centerX, centerY - radius - cellSize * 0.2);
  ctx.stroke();

  ctx.fillStyle = colors.foodLeaf;
  ctx.beginPath();
  ctx.ellipse(
    centerX + cellSize * 0.18,
    centerY - radius,
    cellSize * 0.2,
    cellSize * 0.12,
    -0.6,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function drawBerry(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.28);
  const r = cellSize * 0.18;
  ctx.fillStyle = color;
  [
    { x: centerX - r * 0.6, y: centerY },
    { x: centerX + r * 0.6, y: centerY },
    { x: centerX, y: centerY - r * 0.7 },
  ].forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPeach(point, color) {
  const { centerX, centerY, radius } = fruitMetrics(point, 0.34);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY + 1, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.foodStem;
  ctx.lineWidth = Math.max(1, cellSize * 0.05);
  ctx.beginPath();
  ctx.arc(centerX, centerY + 2, radius * 0.7, -1.2, 1.2);
  ctx.stroke();
}

function drawBanana(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.3);
  const prevCap = ctx.lineCap;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, cellSize * 0.18);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(centerX, centerY + cellSize * 0.1, cellSize * 0.34, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
  ctx.lineCap = prevCap;
}

function drawMango(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.3);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 1, cellSize * 0.3, cellSize * 0.22, -0.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawPapaya(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.3);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 2, cellSize * 0.28, cellSize * 0.2, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.foodStem;
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.arc(centerX + i * cellSize * 0.08, centerY + 2, cellSize * 0.03, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCactusFruit(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.28);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + 2, cellSize * 0.22, cellSize * 0.16, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.foodStem;
  ctx.lineWidth = Math.max(1, cellSize * 0.04);
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.moveTo(centerX + i * cellSize * 0.1, centerY - cellSize * 0.02);
    ctx.lineTo(centerX + i * cellSize * 0.12, centerY + cellSize * 0.05);
    ctx.stroke();
  }
}

function drawDate(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.26);
  const width = cellSize * 0.3;
  const height = cellSize * 0.2;
  ctx.fillStyle = color;
  roundRect(centerX - width / 2, centerY - height / 2, width, height, height / 2);
  ctx.fill();
}

function drawOrange(point, color) {
  const { centerX, centerY, radius } = fruitMetrics(point, 0.28);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY + 1, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.foodStem;
  ctx.beginPath();
  ctx.arc(centerX + radius * 0.35, centerY - radius * 0.2, radius * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawBonus(point) {
  const type = point.type || { id: "star", color: colors.bonus };
  switch (type.id) {
    case "coin":
      drawCoin(point, type.color);
      break;
    case "gem":
      drawGem(point, type.color);
      break;
    case "sun":
      drawSun(point, type.color);
      break;
    case "totem":
      drawTotem(point, type.color);
      break;
    case "relic":
      drawRelic(point, type.color);
      break;
    default:
      drawStar(point, type.color);
  }
}

function drawCoin(point, color) {
  const { centerX, centerY, radius } = fruitMetrics(point, 0.3);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.bonusStroke;
  ctx.lineWidth = Math.max(1.5, cellSize * 0.08);
  ctx.stroke();
}

function drawGem(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.3);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - cellSize * 0.22);
  ctx.lineTo(centerX + cellSize * 0.2, centerY);
  ctx.lineTo(centerX, centerY + cellSize * 0.24);
  ctx.lineTo(centerX - cellSize * 0.2, centerY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = colors.bonusStroke;
  ctx.lineWidth = Math.max(1, cellSize * 0.05);
  ctx.stroke();
}

function drawSun(point, color) {
  const { centerX, centerY, radius } = fruitMetrics(point, 0.24);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.bonusStroke;
  ctx.lineWidth = Math.max(1, cellSize * 0.06);
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * 2 * i) / 8;
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
    ctx.lineTo(
      centerX + Math.cos(angle) * radius * 1.6,
      centerY + Math.sin(angle) * radius * 1.6
    );
    ctx.stroke();
  }
}

function drawTotem(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.3);
  ctx.fillStyle = color;
  roundRect(centerX - cellSize * 0.12, centerY - cellSize * 0.24, cellSize * 0.24, cellSize * 0.48, cellSize * 0.08);
  ctx.fill();
  ctx.fillStyle = colors.bonusStroke;
  ctx.fillRect(centerX - cellSize * 0.08, centerY - cellSize * 0.1, cellSize * 0.16, cellSize * 0.06);
}

function drawRelic(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.3);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, cellSize * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.bonusStroke;
  ctx.lineWidth = Math.max(1, cellSize * 0.05);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - cellSize * 0.24);
  ctx.lineTo(centerX, centerY + cellSize * 0.24);
  ctx.stroke();
}

function drawStar(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.3);
  const outer = cellSize * 0.26;
  const inner = cellSize * 0.12;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? outer : inner;
    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = colors.bonusStroke;
  ctx.lineWidth = Math.max(1, cellSize * 0.05);
  ctx.stroke();
}

function drawHazard(hazard) {
  const id = hazard.type?.id || "spikes";
  if (id.includes("rock") || id.includes("bones")) {
    drawRock(hazard);
  } else {
    drawSpikes(hazard);
  }
}

function drawRock(point) {
  const { centerX, centerY, sizePx } = hazardMetrics(point);
  ctx.fillStyle = colors.hazard;
  ctx.beginPath();
  ctx.moveTo(centerX - sizePx * 0.3, centerY + sizePx * 0.15);
  ctx.lineTo(centerX - sizePx * 0.2, centerY - sizePx * 0.25);
  ctx.lineTo(centerX + sizePx * 0.1, centerY - sizePx * 0.28);
  ctx.lineTo(centerX + sizePx * 0.3, centerY + sizePx * 0.05);
  ctx.lineTo(centerX + sizePx * 0.2, centerY + sizePx * 0.25);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = colors.hazardStroke;
  ctx.lineWidth = Math.max(1, sizePx * 0.06);
  ctx.stroke();
}

function drawSpikes(point) {
  const { centerX, centerY, sizePx } = hazardMetrics(point);
  ctx.fillStyle = colors.hazard;
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI * 2 * i) / 6;
    ctx.lineTo(
      centerX + Math.cos(angle) * sizePx * 0.35,
      centerY + Math.sin(angle) * sizePx * 0.35
    );
    ctx.lineTo(
      centerX + Math.cos(angle + Math.PI / 6) * sizePx * 0.12,
      centerY + Math.sin(angle + Math.PI / 6) * sizePx * 0.12
    );
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = colors.hazardStroke;
  ctx.lineWidth = Math.max(1, sizePx * 0.05);
  ctx.stroke();
}

function fruitMetrics(point, scale) {
  const centerX = point.x * cellSize + cellSize / 2;
  const centerY = point.y * cellSize + cellSize / 2;
  return { centerX, centerY, radius: cellSize * scale };
}

function hazardMetrics(hazard) {
  const size = hazard.size || 1;
  const sizePx = size * cellSize;
  const centerX = hazard.x * cellSize + sizePx / 2;
  const centerY = hazard.y * cellSize + sizePx / 2;
  return { centerX, centerY, sizePx };
}

function isPointInHazard(point, hazard) {
  const size = hazard.size || 1;
  return (
    point.x >= hazard.x &&
    point.x < hazard.x + size &&
    point.y >= hazard.y &&
    point.y < hazard.y + size
  );
}

function drawEyes(head, direction) {
  const baseX = head.x * cellSize;
  const baseY = head.y * cellSize;
  const eyeRadius = cellSize * 0.13;
  const pupilRadius = eyeRadius * 0.5;
  const map = {
    right: [
      { x: 0.72, y: 0.3 },
      { x: 0.72, y: 0.7 },
    ],
    left: [
      { x: 0.28, y: 0.3 },
      { x: 0.28, y: 0.7 },
    ],
    up: [
      { x: 0.3, y: 0.28 },
      { x: 0.7, y: 0.28 },
    ],
    down: [
      { x: 0.3, y: 0.72 },
      { x: 0.7, y: 0.72 },
    ],
  };
  const offset = {
    right: { x: 0.05, y: 0 },
    left: { x: -0.05, y: 0 },
    up: { x: 0, y: -0.05 },
    down: { x: 0, y: 0.05 },
  };

  map[direction].forEach((eye) => {
    const eyeX = baseX + eye.x * cellSize;
    const eyeY = baseY + eye.y * cellSize;
    ctx.fillStyle = colors.eyeWhite;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors.eyePupil;
    ctx.beginPath();
    ctx.arc(
      eyeX + offset[direction].x * cellSize,
      eyeY + offset[direction].y * cellSize,
      pupilRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
}

function handleDirectionInput(dir) {
  if (!DIRECTIONS[dir]) {
    return;
  }
  if (state.status !== "running") {
    return;
  }
  const lastDir = directionQueue.length
    ? directionQueue[directionQueue.length - 1]
    : state.direction;
  if (!isValidTurn(lastDir, dir)) {
    return;
  }
  if (directionQueue.length < MAX_QUEUE) {
    directionQueue.push(dir);
  }
}

function handleKey(event) {
  const key = event.key.toLowerCase();
  if (awaitingName && isTypingTarget(event.target)) {
    return;
  }
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "w", "a", "s", "d"].includes(key)) {
    event.preventDefault();
  }
  if (key === "arrowup" || key === "w") handleDirectionInput("up");
  if (key === "arrowdown" || key === "s") handleDirectionInput("down");
  if (key === "arrowleft" || key === "a") handleDirectionInput("left");
  if (key === "arrowright" || key === "d") handleDirectionInput("right");

  if (key === " ") togglePause();
  if (key === "enter") {
    if (awaitingName) {
      void submitHighScore();
    } else {
      reset();
    }
  }
}

function handleButton(event) {
  const dir = event.currentTarget.dataset.dir;
  const action = event.currentTarget.dataset.action;
  if (dir) {
    handleDirectionInput(dir);
  }
  if (action === "pause") togglePause();
  if (action === "restart") {
    if (awaitingName) {
      skipHighScore();
    }
    reset();
  }
}

document.addEventListener("keydown", handleKey);
window.addEventListener("resize", () => {
  resizeCanvas();
  render();
});
highscoreForm.addEventListener("submit", (event) => {
  event.preventDefault();
  void submitHighScore();
});
highscoreSkip.addEventListener("click", () => {
  skipHighScore();
});

document.querySelectorAll("button[data-dir], button[data-action]").forEach((btn) => {
  btn.addEventListener("click", handleButton);
  btn.addEventListener("touchstart", (event) => {
    event.preventDefault();
    handleButton(event);
  });
});

applyTheme(pickRandomTheme());
resizeCanvas();
reset({ keepTheme: true });
void refreshGlobalLeaderboard();

// Expose pure logic for potential tests.
window.__snake = {
  createInitialState,
  spawnFood,
  spawnBonus,
  spawnHazard,
  step,
  isValidTurn,
  isInside,
  THEMES,
};

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height);
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  cellSize = size / GRID_SIZE;
}

function pickRandomTheme() {
  if (THEMES.length === 1) return THEMES[0];
  let next = THEMES[Math.floor(Math.random() * THEMES.length)];
  if (next.id === currentTheme.id) {
    next = THEMES[(THEMES.indexOf(currentTheme) + 1) % THEMES.length];
  }
  return next;
}

function applyTheme(theme) {
  currentTheme = theme;
  colors = { ...theme.palette };
  document.body.dataset.theme = theme.id;
  Object.entries(theme.ui).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  if (themeNameEl) {
    themeNameEl.textContent = theme.name;
  }
}

function handleGameEnd() {
  if (isTopScore(state.score)) {
    awaitingName = true;
    overlay.textContent = "Top 10 score!";
    overlay.classList.add("show");
    highscorePrompt.classList.add("show");
    highscoreInput.value = "";
    highscoreInput.focus();
  } else {
    awaitingName = false;
    highscorePrompt.classList.remove("show");
  }
}

async function submitHighScore() {
  if (!awaitingName) return;
  const name = highscoreInput.value.trim() || "Player";
  awaitingName = false;
  highscorePrompt.classList.remove("show");
  overlay.textContent = "Saving score...";
  overlay.classList.add("show");

  try {
    const scores = await saveGlobalScore(name, state.score);
    if (scores) {
      highScores = scores;
      leaderboardMode = "global";
      updateHighScoreDisplay();
      overlay.textContent = "Global score saved! Press Enter to restart.";
      overlay.classList.add("show");
      return;
    }
  } catch (error) {
    // Fall back to local if global fails.
  }

  highScores = saveLocalHighScore(name, state.score);
  leaderboardMode = "local";
  updateHighScoreDisplay();
  overlay.textContent = "Saved locally. Press Enter to restart.";
  overlay.classList.add("show");
}

function skipHighScore() {
  if (!awaitingName) return;
  awaitingName = false;
  highscorePrompt.classList.remove("show");
  overlay.textContent = `Game over. Score ${state.score}. Press Enter to restart.`;
  overlay.classList.add("show");
}

function loadLocalHighScores() {
  try {
    const stored = JSON.parse(localStorage.getItem(HIGH_SCORE_KEY));
    if (Array.isArray(stored)) {
      return stored
        .filter((entry) => entry && typeof entry.score === "number")
        .map((entry) => ({
          name: entry.name ? String(entry.name) : "Player",
          score: entry.score,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_HIGH_SCORES);
    }
    if (stored && typeof stored.score === "number") {
      return [
        {
          name: stored.name ? String(stored.name) : "Player",
          score: stored.score,
        },
      ];
    }
  } catch (error) {
    return [];
  }
  return [];
}

function saveLocalHighScore(name, score) {
  const record = { name, score };
  const next = [...highScores, record].sort((a, b) => b.score - a.score).slice(0, MAX_HIGH_SCORES);
  localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(next));
  return next;
}

function updateHighScoreDisplay() {
  const top = highScores[0] || { name: "---", score: 0 };
  highScoreValueEl.textContent = String(top.score);
  highScoreNameEl.textContent = top.name || "---";
  renderLeaderboard();
}

function renderLeaderboard() {
  if (!leaderboardList) return;
  leaderboardList.innerHTML = "";
  if (highScores.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No scores yet.";
    leaderboardList.appendChild(empty);
    return;
  }
  highScores.forEach((entry) => {
    const row = document.createElement("li");
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = entry.name;
    const score = document.createElement("span");
    score.className = "score score-badge";
    score.textContent = String(entry.score);
    row.appendChild(name);
    row.appendChild(score);
    leaderboardList.appendChild(row);
  });
}

function isTopScore(score) {
  if (highScores.length < MAX_HIGH_SCORES) return score > 0;
  const lowest = highScores[highScores.length - 1]?.score ?? 0;
  return score > lowest;
}

function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA";
}

function getLeaderboardUrl() {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return LOCAL_DEV_LEADERBOARD_URL;
  }
  return GLOBAL_LEADERBOARD_URL;
}

async function refreshGlobalLeaderboard() {
  const url = getLeaderboardUrl();
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard.");
    }
    const data = await response.json();
    const normalized = normalizeScores(data?.scores);
    highScores = normalized;
    leaderboardMode = "global";
    updateHighScoreDisplay();
  } catch (error) {
    leaderboardMode = "local";
  }
}

async function saveGlobalScore(name, score) {
  const url = getLeaderboardUrl();
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, score }),
  });
  if (!response.ok) {
    throw new Error("Failed to save global score.");
  }
  const data = await response.json();
  return normalizeScores(data?.scores);
}

function normalizeScores(scores) {
  if (!Array.isArray(scores)) return [];
  return scores
    .filter((entry) => entry && typeof entry.score === "number")
    .map((entry) => ({
      name: entry.name ? String(entry.name) : "Player",
      score: entry.score,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_HIGH_SCORES);
}

updateHighScoreDisplay();
