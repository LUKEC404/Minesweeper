const columnsInput = document.getElementById("columns");
const rowsInput = document.getElementById("rows");
const bombsInput = document.getElementById("bombs");
const gridContainer = document.getElementById("grid");
const winModal = document.getElementById("win");
const loseModal = document.getElementById("lose");

const BOMB = -1;
const TILE_SIZE = 25;

let board = [];
let revealed = [];
let flagged = [];
let rows = 0;
let columns = 0;
let numMines = 0;
let gameOver = false;
let firstClick = true;

function init() {
  rows = parseInt(rowsInput.value) || 10;
  columns = parseInt(columnsInput.value) || 10;
  numMines = parseInt(bombsInput.value) || 10;

  rows = Math.max(1, Math.min(rows, 50));
  columns = Math.max(1, Math.min(columns, 50));
  numMines = Math.max(1, Math.min(numMines, rows * columns - 9));

  rowsInput.value = rows;
  columnsInput.value = columns;
  bombsInput.value = numMines;

  board = [];
  revealed = [];
  flagged = [];
  gameOver = false;
  firstClick = true;

  for (let r = 0; r < rows; r++) {
    board[r] = [];
    revealed[r] = [];
    flagged[r] = [];
    for (let c = 0; c < columns; c++) {
      board[r][c] = 0;
      revealed[r][c] = false;
      flagged[r][c] = false;
    }
  }

  createGrid();
}

function placeMines(excludeRow, excludeCol) {
  let placed = 0;
  while (placed < numMines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);
    if (board[r][c] !== BOMB && (r !== excludeRow || c !== excludeCol)) {
      board[r][c] = BOMB;
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] !== BOMB) {
        board[r][c] = countAdjacentMines(r, c);
      }
    }
  }
}

function countAdjacentMines(row, col) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < columns && board[nr][nc] === BOMB) {
        count++;
      }
    }
  }
  return count;
}

function createGrid() {
  gridContainer.innerHTML = "";
  gridContainer.style.gridTemplateColumns = `repeat(${columns}, ${TILE_SIZE}px)`;
  gridContainer.style.width = `${columns * TILE_SIZE}px`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement("div");
      tile.id = `${r}-${c}`;
      tile.classList.add("tile");
      tile.addEventListener("click", handleClick);
      tile.addEventListener("contextmenu", handleRightClick);
      gridContainer.appendChild(tile);
    }
  }
}

function handleClick(e) {
  if (gameOver) return;
  
  const tile = e.target;
  const [row, col] = tile.id.split("-").map(Number);

  if (flagged[row][col] || revealed[row][col]) return;

  if (firstClick) {
    placeMines(row, col);
    firstClick = false;
  }

  revealTile(row, col);
  checkWin();
}

function handleRightClick(e) {
  e.preventDefault();
  if (gameOver) return;

  const tile = e.target;
  const [row, col] = tile.id.split("-").map(Number);

  if (revealed[row][col]) return;

  flagged[row][col] = !flagged[row][col];
  tile.textContent = flagged[row][col] ? "🚩" : "";
}

function revealTile(row, col) {
  if (row < 0 || row >= rows || col < 0 || col >= columns) return;
  if (revealed[row][col] || flagged[row][col]) return;

  revealed[row][col] = true;
  const tile = document.getElementById(`${row}-${col}`);
  tile.classList.add("revealed");

  const value = board[row][col];
  
  if (value === BOMB) {
    tile.textContent = "💣";
    tile.classList.add("bomb", "red");
    endGame(false);
    return;
  }

  if (value > 0) {
    tile.textContent = value;
    tile.classList.add(`x${value}`);
  } else {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr !== 0 || dc !== 0) {
          revealTile(row + dr, col + dc);
        }
      }
    }
  }
}

function checkWin() {
  let revealedCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (revealed[r][c]) revealedCount++;
    }
  }

  if (revealedCount === rows * columns - numMines) {
    endGame(true);
  }
}

function endGame(won) {
  gameOver = true;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      const value = board[r][c];
      
      if (value === BOMB && !revealed[r][c]) {
        tile.textContent = "💣";
        tile.classList.add("bomb");
      }
      tile.classList.add("revealed");
    }
  }

  if (won) {
    winModal.style.display = "block";
  } else {
    loseModal.style.display = "block";
  }
}

function closeModal() {
  winModal.style.display = "none";
  loseModal.style.display = "none";
  init();
}

document.querySelector(".change").addEventListener("click", init);
document.querySelectorAll(".close").forEach(btn => btn.addEventListener("click", closeModal));

columnsInput.addEventListener("change", init);
rowsInput.addEventListener("change", init);
bombsInput.addEventListener("change", init);

init();
