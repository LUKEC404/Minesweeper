const columnsInput = document.getElementById("columns");
const rowsInput = document.getElementById("rows");
const bombsInput = document.getElementById("bombs");
const gridContainer = document.getElementById("grid");
const bombEmoji = "\uD83D\uDCA3";
const flagEmoji = "\ud83d\udea9";

let board = [];
let flagAmount = 0;
let rows = 0;
let columns = 0;
let numMines = 0;

function startup() {
  clearGrid();
  board = [];
  flagAmount = 0;
  spawnBoard();
  createGrid();
}

function clearGrid() {
  const containerDiv = document.querySelector("#grid");
  const divsToRemove = containerDiv.querySelectorAll("div");

  divsToRemove.forEach((div) => {
    containerDiv.removeChild(div);
  });
}

function changeValue() {
  columns = columnsInput.value;
  rows = rowsInput.value;
  numMines = bombsInput.value;
  startup();
}

window.onload = function () {
  startup();
};

function createGrid() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const box = document.createElement("div");
      box.id = `${row}-${col}`;
      box.classList.add("tile");
      box.addEventListener("click", onTileClicked);
      gridContainer.append(box);
    }
  }
}

function spawnBoard() {
  // Initialize the board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = 0; // 0 represents no mine, 1 represents mine
    }
  }
  // Add mines to the board
  let count = 0;
  while (count < numMines) {
    let row = Math.floor(Math.random() * rows);
    let col = Math.floor(Math.random() * columns);
    if (board[row][col] === 0) {
      // if there is no mine already
      board[row][col] = bombEmoji; // add a mine
      count++;
    }
  }
  const frame = document.getElementById("grid");
  frame.style.width = 25 * columns + "px";
  frame.style.height = 25 * rows + "px";
  addValues();
}

function addValues() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (board[row][col] === bombEmoji) {
        incrementIfNotBomb(row - 1, col);
        incrementIfNotBomb(row, col - 1);
        incrementIfNotBomb(row - 1, col - 1);
        incrementIfNotBomb(row + 1, col);
        incrementIfNotBomb(row, col + 1);
        incrementIfNotBomb(row + 1, col + 1);
        incrementIfNotBomb(row + 1, col - 1);
        incrementIfNotBomb(row - 1, col + 1);
      }
    }
  }
}

function incrementIfNotBomb(row, col) {
  const rowExists = row >= 0 && row < board.length;
  const colExists = col >= 0 && col < board[0].length;
  const isNotBomb = rowExists && colExists && board[row][col] !== bombEmoji;

  if (isNotBomb) {
    board[row][col]++;
  }
}

function findBlank(row, col) {
  row = Number(row);
  col = Number(col);

  if (row + 1 < board.length && col + 1 && board.length) {
    fillBlanks(row + 1, col + 1);
  }
  if (row + 1 < board.length) {
    fillBlanks(row + 1, col);
  }
  if (col + 1 < board.length) {
    fillBlanks(row, col + 1);
  }
  if (row - 1 >= 0 && col - 1 >= 0) {
    fillBlanks(row - 1, col - 1);
  }
  if (row - 1 >= 0) {
    fillBlanks(row - 1, col);
  }
  if (col - 1 >= 0) {
    fillBlanks(row, col - 1);
  }
  if (row + 1 < board.length && col - 1 >= 0) {
    fillBlanks(row + 1, col - 1);
  }
  if (row - 1 >= 0 && col + 1 < board.length) {
    fillBlanks(row - 1, col + 1);
  }
}

function fillBlanks(row, col) {
  const value = board[row][col];
  const tile = document.getElementById(`${row}-${col}`);

  if (tile !== null) {
    if (value == 0 && !tile.classList.contains("blank")) {
      tile.innerText = "";
      tile.classList.add("blank");
      tile.removeEventListener("click", onTileClicked);
      findBlank(row, col);
    } else {
      if (!tile.classList.contains("blank") && value !== bombEmoji) {
        tile.innerText = value;
        tile.classList.add("x" + value.toString());
        tile.removeEventListener("click", onTileClicked);
      }
    }
  }
}

function gameOver() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const tile = document.getElementById(`${row}-${col}`);
      const value = board[row][col];

      if (tile !== null) {
        if (value === 0) {
          tile.innerText = "";
          tile.classList.add("blank");
        } else if (value === bombEmoji) {
          tile.classList.add("bombEmoji");
          tile.classList.add("red");
          tile.innerText = value;
        } else {
          tile.innerText = value;
        }
        tile.classList.add("x" + board[row][col].toString());
        tile.removeEventListener("click", onTileClicked);
      }
    }
  }
  document.getElementById("lose").style.display = "block";
}

function win() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const tile = document.getElementById(`${row}-${col}`);
      const value = board[row][col];

      if (tile !== null) {
        if (value === 0) {
          tile.innerText = "";
          tile.classList.add("blank");
        } else if (value === bombEmoji) {
          tile.classList.add("bombEmoji");
          tile.classList.add("red");
          tile.innerText = value;
        } else {
          tile.innerText = value;
        }
        tile.classList.add("x" + board[row][col].toString());
        tile.removeEventListener("click", onTileClicked);
      }
    }
  }
  document.getElementById("win").style.display = "block";
}

function onTileClicked(e) {
  const tile = e.target || e.srcElement;
  const vals = tile.id.split("-");
  const value = board[vals[0]][vals[1]];

  if (e.ctrlKey) {
    tile.innerText = flagEmoji;
    if (value === bombEmoji) {
      flagAmount++;
    }
  } else {
    tile.removeEventListener("click", onTileClicked);
    const value = board[vals[0]][vals[1]];
    if (value === 0) {
      findBlank(vals[0], vals[1]);
    } else if (value === bombEmoji) {
      tile.innerText = value;
      gameOver();
    } else {
      tile.classList.add("x" + board[vals[0]][vals[1]].toString());
      tile.innerText = value;
    }
  }

  if (flagAmount == numMines) {
    win();
  }
}

function closeWin() {
  document.getElementById("win").style.display = "none";
  startup();
}

function closeLose() {
  document.getElementById("lose").style.display = "none";
  startup();
}
