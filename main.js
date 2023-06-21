const body = document.querySelector("body");
const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.querySelector(".score-count");

const cellSize = 16;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let scoreCount = 0;
let snakeDirection = "up";
let isListeningKeyEvent = false;
const food = {
  x: 160,
  y: 96,
};
const initSnake = [
  {
    x: 160,
    y: 160,
  },
  {
    x: 160,
    y: 176,
  },
  {
    x: 160,
    y: 192,
  },
];
const strInitSnake = JSON.stringify(initSnake)
let snake;

const initGame = () => {
  snake = JSON.parse(strInitSnake)
  scoreCount = 0
  snakeDirection = 'up'
  food.x = 160
  food.y = 96
}

initGame()

const fieldRendering = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const numberCellsX = canvas.width / cellSize;
  const numberCellsY = canvas.height / cellSize;
  let currentCoordinateX = 0;
  let currentCoordinateY = 0;

  for (let i = 0; i <= numberCellsY; i++) {
    for (let j = 0; j <= numberCellsX; j++) {
      ctx.strokeStyle = "rgb(69, 69, 69)";
      ctx.strokeRect(
        currentCoordinateX,
        currentCoordinateY,
        cellSize,
        cellSize
      );

      currentCoordinateX = currentCoordinateX + cellSize;

      if (canvas.width === currentCoordinateX - cellSize) {
        currentCoordinateY = currentCoordinateY + cellSize;
        currentCoordinateX = 0;
      }
    }
  }
};

const drawSnake = () => {
  snake.forEach((elem, i) => {
    snakeTeleportation(elem);
    i === 0
    ? (ctx.fillStyle = "rgb(220, 20, 60)")
    : (ctx.fillStyle = "rgba(220, 20, 60, 0.8)");
    ctx.fillRect(elem.x, elem.y, cellSize, cellSize);
  });
  moveSnake();
};

const moveSnake = () => {
  if(checkGameOver()) {
    initGame()
  }

  checkFood();

  if (snakeDirection === "up") {
    snake.splice(1, 0, { x: snake[0].x, y: snake[0].y });
    snake[0].y -= cellSize;
  } else if (snakeDirection === "down") {
    snake.splice(1, 0, { x: snake[0].x, y: snake[0].y });
    snake[0].y += cellSize;
  } else if (snakeDirection === "left") {
    snake.splice(1, 0, { x: snake[0].x, y: snake[0].y });
    snake[0].x -= cellSize;
  } else if (snakeDirection === "right") {
    snake.splice(1, 0, { x: snake[0].x, y: snake[0].y });
    snake[0].x += cellSize;
  }
  snake.pop();
};

const incrementScore = () => {
  scoreCount++;
  scoreElement.textContent = scoreCount;
};

const checkFood = () => {
  if (snake[0].x === food.x && snake[0].y === food.y) {
    incrementScore();
    snake.splice(1, 0, { x: snake[0].x, y: snake[0].y });
    generateRandomFood();
  } else {
    foodRendering();
  }
};

const foodRendering = () => {
  ctx.fillStyle = "rgb(220, 20, 60)";
  ctx.fillRect(food.x, food.y, cellSize, cellSize);
};

const snakeIntersectionCheck = () => {
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === food.x && snake[i].y === food.y) {
      generateRandomFood()
    }
  }
};

const generateRandomFood = () => {
  food.x = generateRandomСoordinate(canvasWidth);
  food.y = generateRandomСoordinate(canvasHeight);
  snakeIntersectionCheck()
};

const generateRandomСoordinate = (maxNum) => {
  const randomNum = Math.floor(Math.random() * maxNum);
  if (randomNum % cellSize === 0) return randomNum;
  else return generateRandomСoordinate(maxNum);
};

const snakeTeleportation = (chunk) => {
  if (chunk.y < 0) {
    chunk.y = canvasHeight - cellSize;
  } else if (chunk.x < 0) {
    chunk.x = canvasWidth - cellSize;
  } else if (chunk.y >= canvasHeight) {
    chunk.y = 0;
  } else if (chunk.x >= canvasWidth) {
    chunk.x = 0;
  }
};

const checkGameOver = () => {
    const head = snake[0];
  
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    return false;
};

const globalRender = () => {
  fieldRendering();
  drawSnake();
  isListeningKeyEvent = false;
};

const controlSnake = (e) => {
  if (isListeningKeyEvent) return;

  isListeningKeyEvent = true;

  if (e.key.toLowerCase() === "w" && snakeDirection !== "down") {
    snakeDirection = "up";
  } else if (e.key.toLowerCase() === "a" && snakeDirection !== "right") {
    snakeDirection = "left";
  } else if (e.key.toLowerCase() === "d" && snakeDirection !== "left") {
    snakeDirection = "right";
  } else if (e.key.toLowerCase() === "s" && snakeDirection !== "up") {
    snakeDirection = "down";
  }
};

body.addEventListener("keydown", controlSnake);

setInterval(() => globalRender(), 200);