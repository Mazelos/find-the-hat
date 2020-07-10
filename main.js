const prompt = require('prompt-sync')({ sigint: true });
const getInitialConfig = require('./helper/getInitConfig');
const generateField = require('./helper/generateField');
const printField = require('./helper/printField');

const fieldCharacters = {
  hat: '^',
  hole: 'O',
  ground: '░',
  player: '*'
}
const defaultFieldSize = { height: 10, width: 20 };

class Game {
  constructor(height, width, difficulty) {
    this.field = [];
    this.fieldSize = { height: height, width: width };
    this.difficulty = difficulty;

    this.hatFound = false;
    this.playerDropped = false;
    this.gameRunning = true;

    this.playerStartingPos = { x: 0, y: 0 };
    this.playerPreviousPos = { x: 0, y: 0 };
    this.playerPos = { x: 0, y: 0 };

    this.hatPosition = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    }

    this.borderLimit = { x: width-1, y: height-1 };
  }

  handleUserInput() {
    const inputKey = prompt('» ');
      // move down 
    if (inputKey === 'w' && this.playerPos.y > 0) {
      this.playerPos.y -= 1;
      // move left 
    } else if (inputKey === 's' && this.playerPos.y < this.borderLimit.y) {
      this.playerPos.y += 1;
      // move up
    } else if (inputKey === 'a' && this.playerPos.x > 0) {
      this.playerPos.x -= 1;
      // move left 
    } else if (inputKey === 'd' && this.playerPos.x < this.borderLimit.x) {
      this.playerPos.x += 1;
      // quit game
    } else if (inputKey === 'q') {
      this.handleGameStatus('quit');
    }
  } 

  handlePlayerMovement() {
    if (this.playerPos.x === this.playerPreviousPos.x && this.playerPos.y === this.playerPreviousPos.y) {
      return;
    }
    if (this.field[this.playerPos.y][this.playerPos.x] === fieldCharacters.hat) {
      this.handleGameStatus('hat');
    }
    if (this.field[this.playerPos.y][this.playerPos.x] === fieldCharacters.hole) {
      this.handleGameStatus('hole');
    }

    this.field[this.playerPos.y][this.playerPos.x] = fieldCharacters.player;
    this.field[this.playerPreviousPos.y][this.playerPreviousPos.x] = fieldCharacters.ground;

    this.playerPreviousPos.x = this.playerPos.x;
    this.playerPreviousPos.y = this.playerPos.y;
  }  

  handleGameStatus(gameStat) {
    if (gameStat === 'hat') {
      this.gameRunning = false;
      this.hatFound = true;
    } else if (gameStat === 'hole') {
      this.gameRunning = false;
      this.playerDropped = true;
    } else {
      this.gameRunning = false;
    }
  }

  generateField() {
    this.field = generateField(this.fieldSize, this.difficulty, this.hatPosition, fieldCharacters);
  }
  printField() {
    printField(this.field, this.hatFound, this.playerDropped); 
  }
}

const runGame = () => {
  let initialConfig = getInitialConfig(defaultFieldSize);
  const newGame = new Game(initialConfig.height, initialConfig.width, initialConfig.difficulty);

  newGame.generateField();
  newGame.printField();

  while (newGame.gameRunning) {
    newGame.handleUserInput();
    newGame.handlePlayerMovement();
    newGame.printField();
  }
}

runGame();