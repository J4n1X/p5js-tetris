console.log('keyboard')
document.addEventListener('keydown', event => {
    if ([32, 37, 38, 39, 40].includes(event.keyCode)) {
    	event.preventDefault();
    }
    switch (event.keyCode) {
      // Up arrow
      case 38:
        curTetromino.RotateRight();
        timer = 0;
        break;
      // Down arrow
      case 40:
        curTetromino.MoveDown();
        timer = 0;
        break;

      // Left arrow
      case 37:
        curTetromino.MoveLeft();
        break;

      // Right Arrow
      case 39:
        curTetromino.MoveRight();
        break;
    }

});
