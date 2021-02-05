const windowWidth = 1000; // 400
const windowHeight = 450; // 450
var curTetromino;
var gameBoard;

var date = new Date();
const cur_time_num = date.now();
Math.seedrandom(`${cur_time_num}`);

function preload(){
  // put preload code here
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  gameBoard = new Board();
  curTetromino = new Tetromino(round(random(0,6)), 0, 0);
  frameRate(30);
}

var prev = 0;
var timer = 0;
function drawCycle(){
  gameBoard.ClearCollision();
  gameBoard.PutTetrominoToCollision(curTetromino);
  gameBoard.CheckLineFilled();
  if(!gameBoard.DoesPieceFit(curTetromino)){
    print("Collided!");
  }
  // draw
  background(255);
  gameBoard.RefreshGraphics();
  gameBoard.show();
}

function draw(){
  // pre-draw
  let curr = millis();
  let delta = curr - prev;
  timer += delta;
  prev = curr;
  if(timer >= 500){
    timer = 0;
    if(!curTetromino.MoveDown()){
      // clear the moving piece off the collision map first
      gameBoard.ClearCollision();
      gameBoard.TransferTetrominoToCollision(curTetromino);
      curTetromino = new Tetromino(floor(random(0,6)), 0, 0);
    }
  }
  drawCycle();
  // curTetromino.rotation = cycle;


}
