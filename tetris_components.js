var fieldWidth = 12;
var fieldHeight = 18;

// nicely visualized tetrominoes
class Block{
  constructor(posX, posY, color){
    this.posX = posX;
    this.posY = posY;
    this.size = 25;
    this.color = color;
    //print(this.posX, this.posY, this.size, this.color);
  }
  show(){
    stroke(0);
    strokeWeight(2);
    fill(this.color[0], this.color[1], this.color[2]);
    square(this.posX, this.posY, this.size);
  }
}

class Tetromino{
  constructor(type, posX, posY){
		this.blockType = type;
    this.blocks = [];
    this.posX = posX;
    this.posY = posY;
    this.rotation = 0;

    for(let i = 0; i < 16; i++){
			if(Tetromino.Tetrominoes[type][i]){
				this.blocks.push(new Block(posX + (i % 4)*25, posY + floor(i / 4)*25,[0,0,255]));
			}
    }
    print("New Tetromino: ", this.blocks);
  }
  MoveDown(){
    this.posY++;
    if(!gameBoard.DoesPieceFit(curTetromino)){
      this.posY--;
      return false;
    }
    return true;
  }
  MoveLeft(){
    this.posX--;
    if(!gameBoard.DoesPieceFit(curTetromino)){
      this.posX++;
      return false;
    }
    return true;
  }
  MoveRight(){
    this.posX++;
    if(!gameBoard.DoesPieceFit(curTetromino)){
      this.posX--;
      return false;
    }
    return true;
  }
  RotateRight(){
    curTetromino.rotation++;
    if(!gameBoard.DoesPieceFit(curTetromino)){
      curTetromino.rotation--;
      return false;
    }
    return true;
  }
  show(){
    this.blocks.forEach(function(block){
      if(block){
				block.show();
			}
    });
  }

	static To1D(posX, posY){
		return (posY * 4)+posX;
	}
	static To2D(pos){
		let x = (pos % 4);
		let y = floor(pos / 4);
		return [x,y];
	}

	static Tetrominoes = [
		[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
		[0,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0],
		[0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
		[0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0],
		[0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0],
		[0,1,0,0,0,1,0,0,0,1,1,0,0,0,0,0],
		[0,0,1,0,0,0,1,0,0,1,1,0,0,0,0,0]
	];
}

class Board{
	constructor(){
		this.playField = [];
    // define borders at start
    for(let i = 0; i < (fieldHeight * fieldWidth); i++)
			if(Board.To2D(i)[0] == 0 || Board.To2D(i)[0] == 11)
				this.playField.push(3);
			else if(Board.To2D(i)[1] == fieldHeight - 1)
				this.playField.push(3);
			else
				this.playField.push(0);
		this.graphicalField = [];
    this.drawOverlay = false;
		this.ClearCollision();
		this.RefreshGraphics();
	}
	PutTetrominoToCollision(tetromino){
		for(let y = 0; y < 4; y++)
			for(let x = 0; x < 4; x++){
				let playFieldPos = ((tetromino.posY * fieldWidth) + (y * fieldWidth)) + tetromino.posX + x;
				let tile = Tetromino.Tetrominoes[tetromino.blockType][Rotate(x,y,tetromino.rotation)] ? 2 : 0;
				if(!this.playField[playFieldPos]){
					this.playField[playFieldPos] = tile;
				}
			}
	}
  TransferTetrominoToCollision(tetromino){
    for(let y = 0; y < 4; y++)
			for(let x = 0; x < 4; x++){
				let playFieldPos = ((tetromino.posY * fieldWidth) + (y * fieldWidth)) + tetromino.posX + x;
				let tile = Tetromino.Tetrominoes[tetromino.blockType][Rotate(x,y,tetromino.rotation)] ? 1 : 0;
				if(!this.playField[playFieldPos]){
					this.playField[playFieldPos] = tile;
				}
			}
  }
	DoesPieceFit(tetromino){
		for(let py = 0; py < 4; py++)
			for(let px = 0; px < 4; px++){
				let pi = Rotate(px, py, tetromino.rotation);
				let fi = (tetromino.posY + py) * fieldWidth + (tetromino.posX + px);
				// TODO: FIX THIS
				if(tetromino.posX + px >= 0 && tetromino.posX + px < fieldWidth &&
					tetromino.posY + py >= 0 && tetromino.posY + py < fieldHeight){
					if(Tetromino.Tetrominoes[tetromino.blockType][pi] !=  0 &&
						(this.playField[fi] == 1 || this.playField[fi] == 3)){
							print(Tetromino.Tetrominoes[tetromino.blockType][pi], this.playField[fi]);
							return false;
						}
				}
			}
		return true;
	}
	ClearCollision(){
		this.playField.forEach((item, i) => {
      if(item == 2){
        this.playField[i] = 0;
      }
    });
	}
  CheckLineFilled(){
    let filledTiles = 0;
    for(let y = 0; y < fieldHeight; y++){
      for(let x = 0; x < fieldWidth; x++){
        if(this.playField[Board.To1D(x,y)] == 1)
          filledTiles++;
      }
      if(filledTiles == fieldWidth - 2){
        let copy = this.playField.slice(0,Board.To1D(fieldWidth-1,y-1));
        copy.forEach((item, i) => {
          let coord = Board.To2D(i);
          this.playField[Board.To1D(coord[0],coord[1]+1)] = this.playField[Board.To1D(coord[0],coord[1]+1)] != 3 ? item : 3;
        });


      }
      filledTiles = 0;
    }
  }
	RefreshGraphics(){
	  this.graphicalField = [];
	  for(let y = 0; y < fieldHeight; y++)
	    for(let x = 0; x < fieldWidth; x++)
        switch(this.playField[Board.To1D(x,y)]){
          case 0:
            this.graphicalField.push(new Block(10+x*25,10 + y*25, [100,100,100])); // gray
            break;
          case 1:
          case 2:
            this.graphicalField.push(new Block(10 + x*25,10 + y*25, [0,0,255])); // blue
            break;
          case 3:
            this.graphicalField.push(new Block(10+x*25,10 + y*25, [0,0,0])); // black
            break;
          default:
            this.graphicalField.push(new Block(10+x*25,10 + y*25, [255,255,255])); // white
            break;
        }
	}
	show(){
		this.graphicalField.forEach(block => block.show());
    if(this.drawOverlay){
      textSize(20);
      fill(255);
      gameBoard.playField.forEach((tile, i) => {
        let coords = Board.To2D(i);
        text(tile, coords[0]*25 + 15, coords[1]*25 + 30);
      });
    }
	}
	static To1D(posX, posY){
		return (posY * fieldWidth)+posX;
	}
	static To2D(pos){
		let x = (pos % fieldWidth);
		let y = floor(pos / fieldWidth);
		return [x,y];
	}
}

function Rotate(px, py, r){
	let pi = 0;
	switch(r % 4){
	case 0: // 0 degrees				// 0  1  2  3
		pi = py * 4 + px;					// 4  5  6  7
		break;										// 8  9 10 11
															//12 13 14 15

	case 1: // 90 degrees				//12  8  4  0
		pi = 12 + py - (px * 4);	//13  9  5  1
		break;										//14 10  6  2
															//15 11  7  3

	case 2: // 180 degrees			//15 14 13 12
		pi = 15 - (py * 4) - px;	//11 10  9  8
		break;										// 7  6  5  4
															// 3  2  1  0

	case 3: // 270 degrees			// 3  7 11 15
		pi = 3 - py + (px * 4);		// 2  6 10 14
		break;										// 1  5  9 13
	}														// 0  4  8 12
	return pi;
}
