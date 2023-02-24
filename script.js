var columns = 25;
var rows = 25;
var numMines = 25;
const bomb = "\uD83D\uDCA3";
const flag = "\ud83d\udea9";
var board = [];
var flagAmount = 0;

function startup(){
    let containerDiv = document.querySelector('#grid');
    let divsToRemove = containerDiv.querySelectorAll('div');

    divsToRemove.forEach((div) => {
        containerDiv.removeChild(div);
    });
    board = [];
    flagAmount = 0;
    spawnBoard();
    createGird()
}
function changeValue(){
    let row = document.getElementById("rows");
    let col = document.getElementById("columns");
    let bombs = document.getElementById("bombs");

    columns = col.value;
    rows = row.value;
    numMines = bombs.value;
    startup();
}

window.onload = function(){
   startup(); 
}


function createGird(){
    for (let row = 0; row < rows; row++){
        for (let col = 0; col < columns; col++){
            let box = document.createElement("div");
            box.id = row.toString()+ "-" + col.toString();
           
            box.classList.add("tile");
            box.addEventListener("click", onTileClicked);
            document.getElementById("grid").append(box);
        }
    }
}


function spawnBoard(){
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
        if (board[row][col] === 0) { // if there is no mine already
            board[row][col] = bomb; // add a mine
            count++;
        }
    }
    frame = document.getElementById("grid");
    frame.style.width = (25 * columns).toString()+"px";
    frame.style.height = (25 * rows).toString()+"px";
    addValues()
}


function addValues(){
    for (let row=0; row < rows; row++){
        for (let col=0; col < columns; col++){
            
            if (board[row][col] === bomb){
                if (row-1 >= 0 && board[row-1][col] !== bomb){
                    board[row-1][col]++;
                    
                }
                if (col-1 >= 0 && board[row][col-1] !== bomb){
                    board[row][col-1]++;
                    
                }
                if (col-1 >= 0 && row-1 >= 0 && board[row-1][col-1] !== bomb){
                    board[row-1][col-1]++;
                    
                }
                if (row+1 < board.length && board[row+1][col] !== bomb){
                    board[row+1][col]++;
                    
                }
                if (col+1 < board[0].length && board[row][col+1] !== bomb){
                    board[row][col+1]++;
                    
                }
                if (col+1 < board[0].length && row+1 < board.length && board[row+1][col+1] !== bomb){
                    board[row+1][col+1]++;
                    
                }
                if (col-1 >= 0 && row+1 < board.length && board[row+1][col-1] !== bomb){
                    board[row+1][col-1]++;
                    
                }
                if (row-1 >= 0 && col+1 < board[0].length && board[row-1][col+1] !== bomb){
                    board[row-1][col+1]++;
                    
                }
            }
        }
    }
}

function findBlank(row,col){
    row = Number(row);
    col = Number(col);

    if (row+1 < board.length && col+1 && board.length){
        fillBlanks(row+1,col+1);
    }
    if (row+1 < board.length ){
        fillBlanks(row+1,col);
    }
    if (col+1 < board.length ){
        fillBlanks(row,col+1);
    }
    if (row-1 >= 0 && col-1 >= 0){
        fillBlanks(row-1,col-1);
    }
    if (row-1 >= 0){
        fillBlanks(row-1,col);
    }
    if (col-1 >= 0){
        fillBlanks(row,col-1);
    }
    if (row+1 < board.length && col-1 >= 0){
        fillBlanks(row+1,col-1);
    }
    if (row-1 >= 0 && col+1 < board.length){
        fillBlanks(row-1,col+1);
    }
}

function fillBlanks(row,col){
    let value = board[row][col];
    
    let tile = document.getElementById(row.toString() + "-" + col.toString());
    if (tile !== null){
        
        if (value == 0 && !(tile.classList.contains("blank"))){
            
            tile.innerText = "";
            tile.classList.add("blank");
            
            tile.removeEventListener("click", onTileClicked);
            findBlank(row,col);
        } else {
            
            if (!(tile.classList.contains("blank")) && value !== bomb){
                tile.innerText = value;
                tile.classList.add("x"+value.toString());
                tile.removeEventListener("click", onTileClicked);
            }
        }
    }
} 
function gameOver(){
    for (let row = 0; row < rows; row++){
        for (let col = 0; col < columns; col++){
            let tile = document.getElementById(row.toString() + "-" + col.toString());
            let value= board[row][col];
            if (tile !== null){
                
                if (value === 0) {
                    tile.innerText = "";
                    tile.classList.add("blank");
                }else if(value === bomb){
                    tile.classList.add("bomb")
                    tile.classList.add("red")
                    tile.innerText = value;
                } else {
                    tile.innerText = value;
                }
                tile.classList.add("x"+(board[row][col]).toString());
                tile.removeEventListener("click", onTileClicked);
            };
        }
    }
    document.getElementById("lose").style.display = "block";
}


function win(){
    for (let row = 0; row < rows; row++){
        for (let col = 0; col < columns; col++){
            let tile = document.getElementById(row.toString() + "-" + col.toString());
            let value= board[row][col];
            if (tile !== null){
                
                if (value === 0) {
                    tile.innerText = "";
                    tile.classList.add("blank");
                }else if(value === bomb){
                    tile.classList.add("bomb")
                    tile.classList.add("red")
                    tile.innerText = value;
                } else {
                    tile.innerText = value;
                }
                tile.classList.add("x"+(board[row][col]).toString());
                tile.removeEventListener("click", onTileClicked);
            };
        }
    }
    document.getElementById("win").style.display = "block";
}




function onTileClicked(e) {
    let tile = e.target || e.srcElement;
    console.log(tile.id);
    let vals = tile.id.split("-");
    let value= board[vals[0]][vals[1]];
    if (e.ctrlKey){
        tile.innerText = flag;
        if (value === bomb){
            flagAmount++;
        }
    } else {
        tile.removeEventListener("click", onTileClicked);
        console.log(vals[0],vals[1])
        let value= board[vals[0]][vals[1]];
        if (value === 0) {
            findBlank(vals[0],vals[1]);
        } else if (value === bomb){
            tile.innerText = value;
            gameOver()
            
        }
        else{
            tile.classList.add("x"+(board[vals[0]][vals[1]]).toString());
            tile.innerText = value;
        }
    }

    if (flagAmount == numMines){
        win();
    }
}

function closeWin() {
    document.getElementById("win").style.display = "none";
    startup()
}
  
function closeLose() {
    document.getElementById("lose").style.display = "none";
    startup()
}
  