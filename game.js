const GRID_SIZE = 20;
const BASE_SNAKE_MS = 140;
const FRAME_MS = 16;
const MAX_QUEUE = 2;
const BONUS_SCORE = 5;
const BONUS_TTL = 35;
const BONUS_SPAWN_CHANCE = 0.06;
const HAZARD_TTL = 55;
const HAZARD_SPAWN_CHANCE = 0.03;
const MAX_HAZARDS = 2;
const MOVING_HAZARD_START_SCORE = 20;
const MOVING_HAZARD_SECOND_SCORE = 200;
const MOVING_HAZARD_BASE_MS = 720;
const MOVING_HAZARD_MIN_MS = 176;
const HIGH_SCORE_KEY = "vibesnake_highscores";
const MAX_HIGH_SCORES = 10;
const GLOBAL_LEADERBOARD_URL = "https://vibesnake-leaderboard.daryl-e86.workers.dev/api/leaderboard";
const LOCAL_DEV_LEADERBOARD_URL = "http://localhost:8787/api/leaderboard";
const HAZARD_IMAGE_SRC = "assets/hazard.png";

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
    id: "candy",
    name: "One in the Pink",
    title: "Dave's Snake",
    ui: {
      "--bg": "#ffd6f3",
      "--panel": "#ffe7f7",
      "--text": "#5a2b4f",
      "--muted": "#9c6a8b",
      "--panel-border": "#f7b8db",
      "--panel-shadow": "#e89fc9",
      "--button-border": "#f2a3ce",
      "--button-shadow": "#e08bbb",
      "--button-bg": "#ffe3f2",
      "--canvas-bg": "#ffe9f6",
      "--overlay-bg": "rgba(255, 233, 246, 0.9)",
    },
    palette: {
      canvas: "#ffe9f6",
      grid: "#f6c8e3",
      snake: "#f5a7c0",
      snakeHead: "#f09ab7",
      snakeStroke: "#b5677c",
      food: "#ff7ac8",
      foodLeaf: "#7bdff6",
      foodStem: "#ffb3d9",
      bonus: "#ffdf4d",
      bonusStroke: "#d28a18",
      hazard: "#ffffff",
      hazardStroke: "#cfd8e6",
      eyeWhite: "#ffffff",
      eyePupil: "#5a2b4f",
    },
    fruits: [
      { id: "candy", color: "#ff7ac8" },
      { id: "lollipop", color: "#ff6b9e" },
      { id: "donut", color: "#ff9ad5" },
      { id: "gummy", color: "#ff5ac1" },
    ],
    bonusItems: [
      { id: "star", color: "#ffdf4d" },
      { id: "gem", color: "#6ee7ff" },
    ],
    hazards: [
      {
        id: "cloud",
        color: "#ffffff",
        sizeOptions: [
          { w: 3, h: 2 },
          { w: 4, h: 3 },
          { w: 2, h: 3 },
          { w: 4, h: 2 },
        ],
      },
      {
        id: "cloud-dark",
        color: "#f1f5ff",
        sizeOptions: [
          { w: 3, h: 2 },
          { w: 4, h: 3 },
          { w: 2, h: 3 },
          { w: 4, h: 2 },
        ],
      },
    ],
  },
  {
    id: "stink",
    name: "One in the Stink",
    title: "Dave's Snake",
    ui: {
      "--bg": "#6b4b3a",
      "--panel": "#f5d9c6",
      "--text": "#2a160f",
      "--muted": "#4a2c21",
      "--panel-border": "#d8b59f",
      "--panel-shadow": "#b88f78",
      "--button-border": "#caa287",
      "--button-shadow": "#9d725b",
      "--button-bg": "#f1cbb3",
      "--canvas-bg": "#e9c7b2",
      "--overlay-bg": "rgba(245, 217, 198, 0.9)",
    },
    palette: {
      canvas: "#e9c7b2",
      grid: "#cfae98",
      snake: "#f5a7c0",
      snakeHead: "#f09ab7",
      snakeStroke: "#b5677c",
      food: "#ff7ac8",
      foodLeaf: "#7bdff6",
      foodStem: "#ffb3d9",
      bonus: "#ffdf4d",
      bonusStroke: "#d28a18",
      hazard: "#6b4b3a",
      hazardStroke: "#3a2318",
      eyeWhite: "#ffffff",
      eyePupil: "#3a2318",
    },
    fruits: [
      { id: "candy", color: "#ff7ac8" },
      { id: "lollipop", color: "#ff6b9e" },
      { id: "donut", color: "#ff9ad5" },
      { id: "gummy", color: "#ff5ac1" },
    ],
    bonusItems: [
      { id: "star", color: "#ffdf4d" },
      { id: "gem", color: "#6ee7ff" },
    ],
    hazards: [
      { id: "cloud", color: "#ffffff" },
      { id: "cloud-dark", color: "#f1f5ff" },
      {
        id: "log",
        color: "#6b4b3a",
        sizeOptions: [
          { w: 4, h: 2 },
          { w: 3, h: 1 },
        ],
      },
    ],
  },
  {
    id: "pipe",
    name: "Pipe Dreams",
    title: "Dave's Pipe",
    rarity: 0.1,
    ui: {
      "--bg": "#8fc2ff",
      "--panel": "#e6f2ff",
      "--text": "#163055",
      "--muted": "#3f5f8a",
      "--panel-border": "#9fc3ea",
      "--panel-shadow": "#6f9bcf",
      "--button-border": "#8eb5e4",
      "--button-shadow": "#5e88bf",
      "--button-bg": "#d6e9ff",
      "--canvas-bg": "#d7ebff",
      "--overlay-bg": "rgba(214, 233, 255, 0.95)",
    },
    palette: {
      canvas: "#d7ebff",
      grid: "#b7d4f4",
      snake: "#c47b4a",
      snakeHead: "#d08955",
      snakeStroke: "#8a4f2c",
      food: "#4aa3ff",
      foodLeaf: "#8cd2ff",
      foodStem: "#bde2ff",
      bonus: "#ffd24a",
      bonusStroke: "#c58a1a",
      hazard: "#5a88b8",
      hazardStroke: "#345a85",
      eyeWhite: "#ffffff",
      eyePupil: "#163055",
    },
    fruits: [
      { id: "tap", color: "#4aa3ff" },
      { id: "connector", color: "#6bb6ff" },
      { id: "elbow", color: "#5aa8ff" },
      { id: "coupling", color: "#7ac0ff" },
    ],
    bonusItems: [
      { id: "star", color: "#ffd24a" },
      { id: "gem", color: "#6ee7ff" },
    ],
    hazards: [
      {
        id: "valve",
        color: "#5a88b8",
        sizeOptions: [
          { w: 2, h: 2 },
          { w: 3, h: 3 },
        ],
      },
      {
        id: "water",
        color: "#ffffff",
        sizeOptions: [
          { w: 2, h: 2 },
          { w: 3, h: 2 },
          { w: 4, h: 3 },
          { w: 4, h: 4 },
        ],
      },
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
    movingHazards: [],
    grow: 0,
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
  const point = spawnAtEmpty(occupied, rng, snake);
  if (!point) return null;
  return { ...point, ttl: BONUS_TTL, type: pickOne(theme.bonusItems, rng) };
}

function spawnHazard(snake, food, bonus, hazards, rng, theme) {
  const occupied = buildOccupied(snake, food, bonus, hazards);
  const hazardType = pickOne(theme.hazards, rng);
  const sizeOptions = hazardType.sizeOptions
    ? [pickOne(hazardType.sizeOptions, rng)]
    : hazardType.size
      ? [hazardType.size]
      : rng() < 0.5
        ? [{ w: 2, h: 2 }, { w: 3, h: 3 }]
        : [{ w: 3, h: 3 }, { w: 2, h: 2 }];
  for (const size of sizeOptions) {
    const dims = normalizeSize(size);
    const point = spawnAreaAtEmpty(occupied, rng, dims.w, dims.h, snake);
    if (point) {
      return {
        ...point,
        size: dims,
        ttl: HAZARD_TTL,
        type: hazardType,
        flip: hazardType.image ? rng() < 0.5 : false,
      };
    }
  }
  return null;
}

function buildOccupied(snake, food, bonus, hazards) {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  if (food) occupied.add(`${food.x},${food.y}`);
  if (bonus) occupied.add(`${bonus.x},${bonus.y}`);
  hazards.forEach((hazard) => {
    const { w, h } = normalizeSize(hazard.size || 1);
    for (let dy = 0; dy < h; dy += 1) {
      for (let dx = 0; dx < w; dx += 1) {
        occupied.add(`${hazard.x + dx},${hazard.y + dy}`);
      }
    }
  });
  return occupied;
}

function spawnAtEmpty(occupied, rng, snake = null) {
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
  if (!snake || snake.length === 0) {
    const idx = Math.floor(rng() * empty.length);
    return empty[idx];
  }
  const head = snake[0];
  const sorted = empty
    .map((point) => ({
      point,
      dist: Math.abs(point.x - head.x) + Math.abs(point.y - head.y),
    }))
    .sort((a, b) => b.dist - a.dist);
  const topCount = Math.max(1, Math.floor(sorted.length * 0.35));
  const pick = sorted[Math.floor(rng() * topCount)];
  return pick.point;
}

function spawnAreaAtEmpty(occupied, rng, width, height, snake = null) {
  const empty = [];
  for (let y = 0; y <= GRID_SIZE - height; y += 1) {
    for (let x = 0; x <= GRID_SIZE - width; x += 1) {
      let open = true;
      for (let dy = 0; dy < height && open; dy += 1) {
        for (let dx = 0; dx < width; dx += 1) {
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
  if (!snake || snake.length === 0) {
    const idx = Math.floor(rng() * empty.length);
    return empty[idx];
  }
  const head = snake[0];
  const sorted = empty
    .map((point) => ({
      point,
      dist: Math.abs(point.x - head.x) + Math.abs(point.y - head.y),
    }))
    .sort((a, b) => b.dist - a.dist);
  const topCount = Math.max(1, Math.floor(sorted.length * 0.35));
  const pick = sorted[Math.floor(rng() * topCount)];
  return pick.point;
}

function pickOne(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

function normalizeSize(size) {
  if (typeof size === "number") {
    return { w: size, h: size };
  }
  if (size && typeof size.w === "number" && typeof size.h === "number") {
    return { w: size.w, h: size.h };
  }
  return { w: 1, h: 1 };
}

function isAreaClear(occupied, x, y, w, h) {
  for (let dy = 0; dy < h; dy += 1) {
    for (let dx = 0; dx < w; dx += 1) {
      if (occupied.has(`${x + dx},${y + dy}`)) {
        return false;
      }
    }
  }
  return true;
}

function randomDirection() {
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: -1 },
  ];
  return dirs[Math.floor(Math.random() * dirs.length)];
}

function directionWithBounce(dx, dy, w, h, x, y) {
  let nextDx = dx;
  let nextDy = dy;
  if (x + nextDx < 0 || x + w + nextDx > GRID_SIZE) {
    nextDx *= -1;
  }
  if (y + nextDy < 0 || y + h + nextDy > GRID_SIZE) {
    nextDy *= -1;
  }
  return { dx: nextDx, dy: nextDy };
}

function getAllHazards(currentState) {
  const moving = currentState.movingHazards || [];
  if (moving.length > 0) {
    return [...currentState.hazards, ...moving];
  }
  return currentState.hazards;
}

function getMovingHazardInterval(score) {
  const adjusted = MOVING_HAZARD_BASE_MS - Math.max(0, score - MOVING_HAZARD_START_SCORE) * 8;
  return Math.max(MOVING_HAZARD_MIN_MS, adjusted);
}

function getSnakeInterval(score) {
  if (score >= 350) return 108;
  if (score >= 250) return 118;
  if (score >= 150) return 128;
  return BASE_SNAKE_MS;
}

function getDesiredMovingHazardCount(score) {
  if (score >= MOVING_HAZARD_SECOND_SCORE) return 2;
  if (score >= MOVING_HAZARD_START_SCORE) return 1;
  return 0;
}

function spawnMovingHazard(currentState, occupied) {
  const point = spawnAreaAtEmpty(occupied, Math.random, 2, 2, currentState.snake);
  if (!point) return null;
  return {
    x: point.x,
    y: point.y,
    size: { w: 2, h: 2 },
    type: { id: "image", image: true },
    dir: randomDirection(),
    flip: Math.random() < 0.5,
  };
}

function ensureMovingHazards(currentState) {
  const desired = getDesiredMovingHazardCount(currentState.score);
  const existing = currentState.movingHazards || [];
  if (existing.length >= desired) {
    return currentState;
  }
  const next = [...existing];
  for (let i = next.length; i < desired; i += 1) {
    const occupied = buildOccupied(
      currentState.snake,
      currentState.food,
      currentState.bonus,
      [...currentState.hazards, ...next]
    );
    const spawned = spawnMovingHazard(currentState, occupied);
    if (!spawned) break;
    next.push(spawned);
  }
  return {
    ...currentState,
    movingHazards: next,
  };
}

function getBonusDirection(hazard, bonus) {
  if (!bonus) return null;
  const dx = Math.sign(bonus.x - hazard.x);
  const dy = Math.sign(bonus.y - hazard.y);
  if (dx === 0 && dy === 0) return null;
  return { dx, dy };
}

function moveSingleMovingHazard(currentState, hazard, index, hazardsList) {
  const { w, h } = normalizeSize(hazard.size || 2);
  const otherMoving = hazardsList.filter((_, idx) => idx !== index);
  const occupied = buildOccupied(
    currentState.snake,
    currentState.food,
    currentState.bonus,
    [...currentState.hazards, ...otherMoving]
  );
  const bonusDir = getBonusDirection(hazard, currentState.bonus);
  let { dx, dy } = hazard.dir || randomDirection();
  if (bonusDir && Math.random() < 0.45) {
    dx = bonusDir.dx;
    dy = bonusDir.dy;
  }
  let { dx: ndx, dy: ndy } = directionWithBounce(dx, dy, w, h, hazard.x, hazard.y);
  let nx = hazard.x + ndx;
  let ny = hazard.y + ndy;
  let bounced = ndx !== dx || ndy !== dy;

  if (nx < 0 || ny < 0 || nx + w > GRID_SIZE || ny + h > GRID_SIZE) {
    nx = hazard.x;
    ny = hazard.y;
  }

  let moved = false;
  if (isAreaClear(occupied, nx, ny, w, h)) {
    moved = nx !== hazard.x || ny !== hazard.y;
  } else {
    if (!bounced) {
      ndx *= -1;
      ndy *= -1;
      bounced = true;
    }
    nx = hazard.x + ndx;
    ny = hazard.y + ndy;
    if (
      nx >= 0 &&
      ny >= 0 &&
      nx + w <= GRID_SIZE &&
      ny + h <= GRID_SIZE &&
      isAreaClear(occupied, nx, ny, w, h)
    ) {
      moved = true;
    } else {
      nx = hazard.x;
      ny = hazard.y;
    }
  }

  if (bounced) {
    const newDir = randomDirection();
    ndx = newDir.dx;
    ndy = newDir.dy;
  } else if (bonusDir && Math.random() < 0.25) {
    ndx = bonusDir.dx;
    ndy = bonusDir.dy;
  }

  return {
    ...hazard,
    x: nx,
    y: ny,
    dir: { dx: ndx, dy: ndy },
    flip: moved ? !hazard.flip : hazard.flip,
  };
}

function moveMovingHazards(currentState) {
  const hazards = currentState.movingHazards || [];
  if (hazards.length === 0) return currentState;
  const next = hazards.map((hazard, index) =>
    moveSingleMovingHazard(currentState, hazard, index, hazards)
  );
  return {
    ...currentState,
    movingHazards: next,
  };
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
  const newHead = wrapPoint({
    x: head.x + dirVector.x,
    y: head.y + dirVector.y,
  });

  const allHazards = getAllHazards(state);
  const willEat = state.food && newHead.x === state.food.x && newHead.y === state.food.y;
  const hitsBonus = state.bonus && newHead.x === state.bonus.x && newHead.y === state.bonus.y;
  const bonusType = hitsBonus ? state.bonus?.type?.id : null;
  const hitsHazard = allHazards.some((hazard) => isPointInHazard(newHead, hazard));
  const bodyToCheck = willEat ? state.snake : state.snake.slice(0, -1);
  if (bodyToCheck.some((part) => part.x === newHead.x && part.y === newHead.y)) {
    return { ...state, status: "game-over", direction: nextDirection };
  }
  if (hitsHazard) {
    return { ...state, status: "game-over", direction: nextDirection };
  }

  const newSnake = [newHead, ...state.snake];
  let growBy = 0;
  if (willEat) {
    growBy += 1;
  }
  if (hitsBonus && bonusType === "coin") {
    growBy += 1;
  }
  let nextGrow = state.grow + growBy;
  if (nextGrow > 0) {
    nextGrow -= 1;
  } else {
    newSnake.pop();
  }

  const remainingBonus = hitsBonus ? null : state.bonus;
  const nextFood = willEat
    ? spawnFood(newSnake, rng, theme, remainingBonus, allHazards)
    : state.food;
  const scoreMultiplier = state.score >= 200 ? 2 : 1;
  const baseScore = (willEat ? 1 : 0) + (hitsBonus ? BONUS_SCORE : 0);
  const nextScore = state.score + baseScore * scoreMultiplier;

  let nextBonus = remainingBonus ? { ...remainingBonus, ttl: remainingBonus.ttl - 1 } : null;
  if (nextBonus && nextBonus.ttl <= 0) {
    nextBonus = null;
  }

  let nextHazards = state.hazards
    .map((hazard) => ({ ...hazard, ttl: hazard.ttl - 1 }))
    .filter((hazard) => hazard.ttl > 0);
  const hazardsForSpawns =
    state.movingHazards && state.movingHazards.length > 0
      ? [...nextHazards, ...state.movingHazards]
      : nextHazards;

  if (!nextBonus && rng() < BONUS_SPAWN_CHANCE) {
    const spawnedBonus = spawnBonus(newSnake, nextFood, hazardsForSpawns, rng, theme);
    if (spawnedBonus) {
      nextBonus = spawnedBonus;
    }
  }

  if (nextHazards.length < MAX_HAZARDS && rng() < HAZARD_SPAWN_CHANCE) {
    const spawnedHazard = spawnHazard(
      newSnake,
      nextFood,
      nextBonus,
      hazardsForSpawns,
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
    movingHazards: state.movingHazards,
    grow: nextGrow,
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

function wrapPoint(point) {
  const x = (point.x + GRID_SIZE) % GRID_SIZE;
  const y = (point.y + GRID_SIZE) % GRID_SIZE;
  return { x, y };
}

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreValueEl = document.getElementById("highScoreValue");
const highScoreNameEl = document.getElementById("highScoreName");
const overlay = document.getElementById("overlay");
const overlayRestart = document.getElementById("overlayRestart");
const overlayStart = document.getElementById("overlayStart");
const overlayMessage = document.getElementById("overlayMessage");
const overlayImage = document.getElementById("overlayImage");
const themeNameEl = document.getElementById("themeName");
const gameTitleEl = document.getElementById("gameTitle");
const highscorePrompt = document.getElementById("highscorePrompt");
const highscoreForm = document.getElementById("highscoreForm");
const highscoreInput = document.getElementById("highScoreInput");
const highscoreSkip = document.getElementById("highScoreSkip");
const leaderboardList = document.getElementById("leaderboardList");
const hazardImage = new Image();
hazardImage.src = HAZARD_IMAGE_SRC;
const touchState = {
  active: false,
  startX: 0,
  startY: 0,
  lastDir: null,
};

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
let snakeAccumulator = 0;
let movingHazardAccumulator = 0;
let themeMessageTimer = null;
let pipeIntroActive = false;

function start() {
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(tick, FRAME_MS);
}

function tick() {
  if (paused) {
    return;
  }
  updateGame(FRAME_MS);
  render();
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function updateGame(deltaMs) {
  if (state.status !== "running" || paused) {
    return;
  }
  snakeAccumulator += deltaMs;
  movingHazardAccumulator += deltaMs;

  const snakeInterval = getSnakeInterval(state.score);
  while (snakeAccumulator >= snakeInterval && state.status === "running") {
    const prevStatus = state.status;
    const inputDirection = directionQueue.shift();
    state = step(state, inputDirection, Math.random, currentTheme);
    snakeAccumulator -= snakeInterval;
    if (prevStatus === "running" && state.status !== "running") {
      handleGameEnd();
    }
  }

  state = ensureMovingHazards(state);
  const moveInterval = getMovingHazardInterval(state.score);
  while (
    state.status === "running" &&
    state.movingHazards &&
    state.movingHazards.length > 0 &&
    movingHazardAccumulator >= moveInterval
  ) {
    state = moveMovingHazards(state);
    movingHazardAccumulator -= moveInterval;
  }

  if (state.status === "game-over" || state.status === "won") {
    stop();
  }
}

function reset(options = {}) {
  const { keepTheme = false } = options;
  if (!keepTheme) {
    applyTheme(pickRandomTheme());
  }
  if (themeMessageTimer) {
    clearTimeout(themeMessageTimer);
    themeMessageTimer = null;
  }
  state = createInitialState(Math.random, currentTheme);
  directionQueue = [];
  paused = false;
  snakeAccumulator = 0;
  movingHazardAccumulator = 0;
  awaitingName = false;
  pipeIntroActive = false;
  highscorePrompt.classList.remove("show");
  overlay.classList.remove("show");
  overlayMessage.textContent = "";
  setOverlayImageVisible(false);
  setOverlayStartVisible(false);
  start();
  render();
}

function togglePause() {
  if (state.status !== "running") {
    return;
  }
  if (pipeIntroActive) {
    return;
  }
  paused = !paused;
  overlayMessage.textContent = paused ? "Paused" : "";
  overlay.classList.toggle("show", paused);
  setOverlayRestartVisible(false);
  setOverlayImageVisible(false);
  setOverlayStartVisible(false);
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

  getAllHazards(state).forEach((hazard) => {
    drawHazard(hazard);
  });

  if (state.food) {
    drawFood(state.food, state.food.type);
  }

  if (state.bonus) {
    drawBonus(state.bonus);
  }

  state.snake.forEach((segment, index) => {
    const isHead = index === 0;
    if (currentTheme.id === "pipe") {
      drawPipeSegment(segment, isHead, state.direction);
    } else {
      const fill = isHead ? colors.snakeHead : colors.snake;
      drawRoundedCell(segment, fill, colors.snakeStroke);
      if (isHead) {
        drawEyes(segment, state.direction);
      }
    }
  });

  scoreEl.textContent = String(state.score);

  if (state.status === "game-over") {
    if (!awaitingName) {
      overlayMessage.textContent = getGameOverMessage(state.score);
      overlay.classList.add("show");
      setOverlayRestartVisible(true);
      setOverlayImageVisible(true);
      setOverlayStartVisible(false);
    }
  }

  if (state.status === "won") {
    if (!awaitingName) {
      overlayMessage.textContent = `You win! Score ${state.score}. Press Enter to restart.`;
      overlay.classList.add("show");
      setOverlayRestartVisible(true);
      setOverlayImageVisible(false);
      setOverlayStartVisible(false);
    }
  }
  if (state.status === "running") {
    setOverlayRestartVisible(false);
    setOverlayImageVisible(false);
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

function drawPipeSegment(point, isHead, direction) {
  const padding = Math.max(1, cellSize * 0.08);
  const size = cellSize - padding * 2;
  const x = point.x * cellSize + padding;
  const y = point.y * cellSize + padding;
  const radius = size * 0.35;

  ctx.fillStyle = isHead ? colors.snakeHead : colors.snake;
  roundRect(x, y, size, size, radius);
  ctx.fill();

  ctx.strokeStyle = colors.snakeStroke;
  ctx.lineWidth = Math.max(1, cellSize * 0.1);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 220, 190, 0.6)";
  ctx.lineWidth = Math.max(1, cellSize * 0.06);
  ctx.beginPath();
  if (direction === "left" || direction === "right") {
    ctx.moveTo(x + size * 0.2, y + size * 0.35);
    ctx.lineTo(x + size * 0.8, y + size * 0.35);
  } else {
    ctx.moveTo(x + size * 0.35, y + size * 0.2);
    ctx.lineTo(x + size * 0.35, y + size * 0.8);
  }
  ctx.stroke();
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
    case "tap":
      drawTap(point, type.color);
      break;
    case "connector":
      drawConnector(point, type.color);
      break;
    case "elbow":
      drawElbow(point, type.color);
      break;
    case "coupling":
      drawCoupling(point, type.color);
      break;
    case "candy":
      drawCandy(point, type.color);
      break;
    case "lollipop":
      drawLollipop(point, type.color);
      break;
    case "donut":
      drawDonut(point, type.color);
      break;
    case "gummy":
      drawGummy(point, type.color);
      break;
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

function drawCandy(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.3);
  const width = cellSize * 0.36;
  const height = cellSize * 0.2;
  ctx.fillStyle = color;
  roundRect(centerX - width / 2, centerY - height / 2, width, height, height / 2);
  ctx.fill();
  ctx.fillStyle = colors.foodStem;
  ctx.beginPath();
  ctx.moveTo(centerX - width / 2, centerY - height / 2);
  ctx.lineTo(centerX - width / 2 - cellSize * 0.08, centerY);
  ctx.lineTo(centerX - width / 2, centerY + height / 2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(centerX + width / 2, centerY - height / 2);
  ctx.lineTo(centerX + width / 2 + cellSize * 0.08, centerY);
  ctx.lineTo(centerX + width / 2, centerY + height / 2);
  ctx.closePath();
  ctx.fill();
}

function drawLollipop(point, color) {
  const { centerX, centerY, radius } = fruitMetrics(point, 0.26);
  ctx.strokeStyle = colors.foodStem;
  ctx.lineWidth = Math.max(2, cellSize * 0.08);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + radius);
  ctx.lineTo(centerX, centerY + radius + cellSize * 0.2);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.bonusStroke;
  ctx.lineWidth = Math.max(1, cellSize * 0.05);
  ctx.stroke();
}

function drawDonut(point, color) {
  const { centerX, centerY, radius } = fruitMetrics(point, 0.28);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd6f3";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.45, 0, Math.PI * 2);
  ctx.fill();
}

function drawGummy(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.26);
  const size = cellSize * 0.26;
  ctx.fillStyle = color;
  roundRect(centerX - size, centerY - size, size * 2, size * 2, size * 0.6);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.arc(centerX - size * 0.3, centerY - size * 0.3, size * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

function drawTap(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.28);
  ctx.fillStyle = color;
  roundRect(centerX - cellSize * 0.2, centerY - cellSize * 0.06, cellSize * 0.4, cellSize * 0.12, cellSize * 0.06);
  ctx.fill();
  roundRect(centerX - cellSize * 0.06, centerY - cellSize * 0.2, cellSize * 0.12, cellSize * 0.14, cellSize * 0.04);
  ctx.fill();
}

function drawConnector(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.28);
  ctx.fillStyle = color;
  roundRect(centerX - cellSize * 0.18, centerY - cellSize * 0.08, cellSize * 0.36, cellSize * 0.16, cellSize * 0.08);
  ctx.fill();
}

function drawElbow(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.28);
  ctx.fillStyle = color;
  roundRect(centerX - cellSize * 0.18, centerY - cellSize * 0.08, cellSize * 0.36, cellSize * 0.16, cellSize * 0.08);
  ctx.fill();
  roundRect(centerX + cellSize * 0.04, centerY - cellSize * 0.18, cellSize * 0.16, cellSize * 0.36, cellSize * 0.08);
  ctx.fill();
}

function drawCoupling(point, color) {
  const { centerX, centerY } = fruitMetrics(point, 0.28);
  ctx.fillStyle = color;
  roundRect(centerX - cellSize * 0.16, centerY - cellSize * 0.1, cellSize * 0.32, cellSize * 0.2, cellSize * 0.08);
  ctx.fill();
  ctx.strokeStyle = colors.bonusStroke;
  ctx.lineWidth = Math.max(1, cellSize * 0.05);
  ctx.stroke();
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
  if (id === "image") {
    drawHazardImage(hazard);
    return;
  }
  if (id.includes("cloud")) {
    drawCloud(hazard);
    return;
  }
  if (id.includes("puddle")) {
    drawPuddle(hazard);
    return;
  }
  if (id.includes("flower")) {
    drawFlower(hazard);
    return;
  }
  if (id.includes("cactus")) {
    drawCactusHazard(hazard);
    return;
  }
  if (id.includes("scorpion")) {
    drawScorpion(hazard);
    return;
  }
  if (id.includes("beetle")) {
    drawBeetle(hazard);
    return;
  }
  if (id.includes("log")) {
    drawLog(hazard);
    return;
  }
  if (id.includes("valve")) {
    drawValve(hazard);
    return;
  }
  if (id.includes("water")) {
    drawWaterPuddle(hazard);
    return;
  }
  drawCloud(hazard);
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

function drawPuddle(hazard) {
  const { centerX, centerY, widthPx, heightPx, sizePx } = hazardMetrics(hazard);
  ctx.fillStyle = hazard.type?.color || colors.hazard;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + sizePx * 0.05, widthPx * 0.35, heightPx * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.hazardStroke;
  ctx.lineWidth = Math.max(1, sizePx * 0.04);
  ctx.stroke();
}

function drawFlower(hazard) {
  const { centerX, centerY, sizePx } = hazardMetrics(hazard);
  const petal = sizePx * 0.12;
  ctx.fillStyle = hazard.type?.color || colors.hazard;
  const petals = [
    { x: 0, y: -petal },
    { x: petal, y: 0 },
    { x: 0, y: petal },
    { x: -petal, y: 0 },
  ];
  petals.forEach((p) => {
    ctx.beginPath();
    ctx.ellipse(centerX + p.x, centerY + p.y, petal, petal * 0.7, 0.3, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(centerX, centerY, petal * 0.6, 0, Math.PI * 2);
  ctx.fill();
}

function drawCactusHazard(hazard) {
  const { centerX, centerY, sizePx } = hazardMetrics(hazard);
  ctx.fillStyle = hazard.type?.color || colors.hazard;
  roundRect(centerX - sizePx * 0.12, centerY - sizePx * 0.28, sizePx * 0.24, sizePx * 0.56, sizePx * 0.1);
  ctx.fill();
  roundRect(centerX - sizePx * 0.28, centerY - sizePx * 0.08, sizePx * 0.16, sizePx * 0.22, sizePx * 0.08);
  ctx.fill();
  roundRect(centerX + sizePx * 0.12, centerY - sizePx * 0.12, sizePx * 0.16, sizePx * 0.22, sizePx * 0.08);
  ctx.fill();
  ctx.strokeStyle = colors.hazardStroke;
  ctx.lineWidth = Math.max(1, sizePx * 0.04);
  ctx.stroke();
}

function drawScorpion(hazard) {
  const { centerX, centerY, sizePx } = hazardMetrics(hazard);
  ctx.fillStyle = hazard.type?.color || colors.hazard;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, sizePx * 0.22, sizePx * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(centerX + sizePx * 0.2, centerY - sizePx * 0.16, sizePx * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.hazardStroke;
  ctx.lineWidth = Math.max(1, sizePx * 0.05);
  ctx.beginPath();
  ctx.moveTo(centerX - sizePx * 0.2, centerY + sizePx * 0.08);
  ctx.lineTo(centerX - sizePx * 0.32, centerY + sizePx * 0.18);
  ctx.stroke();
}

function drawBeetle(hazard) {
  const { centerX, centerY, sizePx } = hazardMetrics(hazard);
  ctx.fillStyle = hazard.type?.color || colors.hazard;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, sizePx * 0.2, sizePx * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.hazardStroke;
  ctx.lineWidth = Math.max(1, sizePx * 0.05);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - sizePx * 0.16);
  ctx.lineTo(centerX, centerY + sizePx * 0.16);
  ctx.stroke();
}

function drawLog(hazard) {
  const { centerX, centerY, widthPx, heightPx } = hazardMetrics(hazard);
  const w = widthPx * 0.8;
  const h = heightPx * 0.5;
  ctx.fillStyle = hazard.type?.color || colors.hazard;
  roundRect(centerX - w / 2, centerY - h / 2, w, h, h * 0.4);
  ctx.fill();
  ctx.strokeStyle = colors.hazardStroke;
  ctx.lineWidth = Math.max(1, h * 0.2);
  ctx.stroke();
  ctx.strokeStyle = colors.hazardStroke;
  ctx.lineWidth = Math.max(1, h * 0.12);
  ctx.beginPath();
  ctx.moveTo(centerX - w * 0.25, centerY - h * 0.2);
  ctx.lineTo(centerX - w * 0.25, centerY + h * 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX + w * 0.15, centerY - h * 0.2);
  ctx.lineTo(centerX + w * 0.15, centerY + h * 0.2);
  ctx.stroke();
}

function drawValve(hazard) {
  const { centerX, centerY, sizePx } = hazardMetrics(hazard);
  const r = sizePx * 0.18;
  ctx.fillStyle = hazard.type?.color || colors.hazard;
  ctx.beginPath();
  ctx.arc(centerX, centerY, r * 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.hazardStroke;
  ctx.lineWidth = Math.max(1, sizePx * 0.06);
  ctx.beginPath();
  ctx.moveTo(centerX - r * 1.5, centerY);
  ctx.lineTo(centerX + r * 1.5, centerY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - r * 1.5);
  ctx.lineTo(centerX, centerY + r * 1.5);
  ctx.stroke();
}

function drawWaterPuddle(hazard) {
  const { centerX, centerY, widthPx, heightPx } = hazardMetrics(hazard);
  ctx.fillStyle = hazard.type?.color || "#ffffff";
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, widthPx * 0.35, heightPx * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = colors.hazardStroke;
  ctx.lineWidth = Math.max(1, Math.min(widthPx, heightPx) * 0.04);
  ctx.stroke();
}

function drawCloud(hazard) {
  const { centerX, centerY, widthPx, heightPx, sizePx } = hazardMetrics(hazard);
  const r = Math.min(widthPx, heightPx) * 0.18;
  ctx.fillStyle = hazard.type?.color || colors.hazard;
  const offsets = [
    { x: -r * 1.6, y: 0 },
    { x: -r * 0.6, y: -r * 0.8 },
    { x: r * 0.7, y: -r * 0.4 },
    { x: r * 1.6, y: 0 },
  ];
  offsets.forEach((o) => {
    ctx.beginPath();
    ctx.arc(centerX + o.x, centerY + o.y, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillRect(centerX - r * 2, centerY, r * 4, r * 1.3);
  ctx.strokeStyle = colors.hazardStroke;
  ctx.lineWidth = Math.max(1, sizePx * 0.04);
  ctx.strokeRect(centerX - r * 2, centerY - r * 0.2, r * 4, r * 1.5);
}

function fruitMetrics(point, scale) {
  const centerX = point.x * cellSize + cellSize / 2;
  const centerY = point.y * cellSize + cellSize / 2;
  return { centerX, centerY, radius: cellSize * scale };
}

function hazardMetrics(hazard) {
  const { w, h } = normalizeSize(hazard.size || 1);
  const widthPx = w * cellSize;
  const heightPx = h * cellSize;
  const sizePx = Math.min(widthPx, heightPx);
  const centerX = hazard.x * cellSize + widthPx / 2;
  const centerY = hazard.y * cellSize + heightPx / 2;
  return { centerX, centerY, sizePx, widthPx, heightPx };
}

function isPointInHazard(point, hazard) {
  const { w, h } = normalizeSize(hazard.size || 1);
  return (
    point.x >= hazard.x &&
    point.x < hazard.x + w &&
    point.y >= hazard.y &&
    point.y < hazard.y + h
  );
}

function drawHazardImage(hazard) {
  if (!hazardImage.complete || hazardImage.naturalWidth === 0) {
    drawRock(hazard);
    return;
  }
  const { w, h } = normalizeSize(hazard.size || 4);
  const widthPx = w * cellSize;
  const heightPx = h * cellSize;
  const x = hazard.x * cellSize;
  const y = hazard.y * cellSize;
  ctx.save();
  if (hazard.flip) {
    ctx.translate(x + widthPx, y);
    ctx.scale(-1, 1);
    ctx.drawImage(hazardImage, 0, 0, widthPx, heightPx);
  } else {
    ctx.drawImage(hazardImage, x, y, widthPx, heightPx);
  }
  ctx.restore();
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
overlayRestart.addEventListener("click", () => {
  if (awaitingName) {
    skipHighScore();
  }
  reset();
});
overlayStart.addEventListener("click", () => {
  if (!pipeIntroActive) return;
  pipeIntroActive = false;
  paused = false;
  overlay.classList.remove("show");
  overlayMessage.textContent = "";
  setOverlayStartVisible(false);
  start();
});
canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
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
  const rares = THEMES.filter((theme) => theme.rarity);
  const normals = THEMES.filter((theme) => !theme.rarity);
  let next = null;
  if (rares.length > 0 && Math.random() < rares[0].rarity) {
    next = rares[Math.floor(Math.random() * rares.length)];
  } else {
    next = normals[Math.floor(Math.random() * normals.length)];
  }
  if (next.id === currentTheme.id) {
    const pool = next.rarity ? rares : normals;
    if (pool.length > 1) {
      next = pool[(pool.indexOf(next) + 1) % pool.length];
    }
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
  if (gameTitleEl) {
    const titleText = theme.title || "Dave's Snake";
    gameTitleEl.textContent = titleText;
    document.title = titleText;
  }
  if (theme.id === "pipe") {
    showPipeIntro();
  }
}

function handleGameEnd() {
  const isGameOver = state.status === "game-over";
  setOverlayImageVisible(isGameOver);
  if (isTopScore(state.score)) {
    awaitingName = true;
    overlayMessage.textContent = "Top 10 score!";
    overlay.classList.add("show");
    setOverlayRestartVisible(false);
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
  overlayMessage.textContent = "Saving score...";
  overlay.classList.add("show");
  setOverlayRestartVisible(false);
  setOverlayImageVisible(state.status === "game-over");

  try {
    const scores = await saveGlobalScore(name, state.score);
    if (scores) {
      highScores = scores;
      leaderboardMode = "global";
      updateHighScoreDisplay();
      overlayMessage.textContent = "Global score saved! Press Enter to restart.";
      overlay.classList.add("show");
      setOverlayRestartVisible(true);
      setOverlayImageVisible(state.status === "game-over");
      return;
    }
  } catch (error) {
    // Fall back to local if global fails.
  }

  highScores = saveLocalHighScore(name, state.score);
  leaderboardMode = "local";
  updateHighScoreDisplay();
  overlayMessage.textContent = "Saved locally. Press Enter to restart.";
  overlay.classList.add("show");
  setOverlayRestartVisible(true);
  setOverlayImageVisible(state.status === "game-over");
}

function skipHighScore() {
  if (!awaitingName) return;
  awaitingName = false;
  highscorePrompt.classList.remove("show");
  overlayMessage.textContent = getGameOverMessage(state.score);
  overlay.classList.add("show");
  setOverlayRestartVisible(true);
  setOverlayImageVisible(true);
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

function setOverlayRestartVisible(visible) {
  if (!overlayRestart) return;
  overlayRestart.style.display = visible ? "inline-flex" : "none";
}

function setOverlayStartVisible(visible) {
  if (!overlayStart) return;
  overlayStart.style.display = visible ? "inline-flex" : "none";
}

function setOverlayImageVisible(visible) {
  if (!overlayImage) return;
  overlayImage.classList.toggle("show", visible);
}

function showPipeIntro() {
  pipeIntroActive = true;
  paused = true;
  overlayMessage.textContent = "Help Dave lay some Pipe!";
  overlay.classList.add("show");
  setOverlayStartVisible(true);
  setOverlayRestartVisible(false);
  setOverlayImageVisible(false);
}

function showThemeMessage(message) {
  if (!overlayMessage || state.status !== "running" || awaitingName) {
    return;
  }
  overlayMessage.textContent = message;
  overlay.classList.add("show");
  setOverlayRestartVisible(false);
  setOverlayImageVisible(false);
  if (themeMessageTimer) {
    clearTimeout(themeMessageTimer);
  }
  themeMessageTimer = setTimeout(() => {
    if (state.status === "running" && !awaitingName) {
      overlay.classList.remove("show");
      overlayMessage.textContent = "";
    }
  }, 1800);
}

function getGameOverMessage(score) {
  switch (currentTheme.id) {
    case "candy":
      return `Game Over - You helped Dave get ${score} In the Pink`;
    case "stink":
      return `Game Over - You helped Dave get ${score} In the Stink`;
    case "pipe":
      return `Game Over - You helped Dave Lay ${score} pipe`;
    default:
      return `Game over. Score ${score}. Press Enter to restart.`;
  }
}

function renderGameToText() {
  const hazards = getAllHazards(state).map((hazard) => {
    const size = normalizeSize(hazard.size || 1);
    return {
      x: hazard.x,
      y: hazard.y,
      w: size.w,
      h: size.h,
      type: hazard.type?.id || "hazard",
    };
  });
  const payload = {
    mode: state.status,
    theme: currentTheme?.name || "",
    score: state.score,
    snake: {
      head: state.snake[0],
      length: state.snake.length,
    },
    food: state.food ? { x: state.food.x, y: state.food.y, type: state.food.type?.id } : null,
    bonus: state.bonus ? { x: state.bonus.x, y: state.bonus.y, type: state.bonus.type?.id } : null,
    hazards,
    coordSystem: "origin top-left, x right, y down, units: grid cells",
  };
  return JSON.stringify(payload);
}

window.render_game_to_text = renderGameToText;
window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / 16));
  const slice = ms / steps;
  for (let i = 0; i < steps; i += 1) {
    updateGame(slice);
  }
  render();
};

function handleTouchStart(event) {
  const touch = event.touches[0];
  if (!touch) return;
  touchState.active = true;
  touchState.startX = touch.clientX;
  touchState.startY = touch.clientY;
  touchState.lastDir = null;
}

function handleTouchMove(event) {
  if (!touchState.active) return;
  if (event.cancelable) {
    event.preventDefault();
  }
  const touch = event.touches[0];
  if (!touch) return;
  const dx = touch.clientX - touchState.startX;
  const dy = touch.clientY - touchState.startY;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const threshold = Math.max(18, cellSize * 0.4);
  if (absX < threshold && absY < threshold) return;

  let dir = null;
  if (absX > absY) {
    dir = dx > 0 ? "right" : "left";
  } else {
    dir = dy > 0 ? "down" : "up";
  }

  if (dir && dir !== touchState.lastDir) {
    handleDirectionInput(dir);
    touchState.lastDir = dir;
    touchState.startX = touch.clientX;
    touchState.startY = touch.clientY;
  }
}

function handleTouchEnd() {
  touchState.active = false;
  touchState.lastDir = null;
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
