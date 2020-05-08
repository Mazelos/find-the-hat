// library to make syncronous terminal imput easier .
// since it's a function we need to call it when required 
//we also pass the option 'sigint' equalt to true that makes sure that "signal interrupt" ( by default fired with CTRL-C ) will exit the program .
const prompt = require('prompt-sync')({ sigint: true });
// requirung event emitter 
// const EventEmitter = require('events');

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const playerCharacter = '*';
const defaultFieldSize = { height: 10, width: 20 }

class Field {
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

  handlePlayerMovement() {
    if (this.playerPos.x === this.playerPreviousPos.x && this.playerPos.y === this.playerPreviousPos.y) {
      return;
    }
    if (this.field[this.playerPos.y][this.playerPos.x] === hat) {
      this.handleGameStatus('hat');
    }
    if (this.field[this.playerPos.y][this.playerPos.x] === hole) {
      this.handleGameStatus('hole');
    }

    this.field[this.playerPos.y][this.playerPos.x] = playerCharacter;
    this.field[this.playerPreviousPos.y][this.playerPreviousPos.x] = fieldCharacter;

    this.playerPreviousPos.x = this.playerPos.x;
    this.playerPreviousPos.y = this.playerPos.y;
  }

  handleUserInput(direction) {
    if (direction === 'w' && this.playerPos.y > 0) {
      this.playerPos.y -= 1;
    } else if (direction === 's' && this.playerPos.y < this.borderLimit.y) {
      this.playerPos.y += 1;
    } else if (direction === 'a' && this.playerPos.x > 0) {
      this.playerPos.x -= 1; 
    } else if (direction === 'd' && this.playerPos.x < this.borderLimit.x) {
      this.playerPos.x += 1;
    } else if (direction === 'q'){
      this.handleGameStatus('quit');
    }
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

  getPlayerInput() {
    let playerMovement = prompt('» ');
    return playerMovement
  }

  getRandomHolesPlacement() {
    const characterToChoose = [fieldCharacter, hole];

    let holesRate;
    switch (this.difficulty) {
      case 'easy':
        holesRate = 0.1;
      case 'medium':
        holesRate = 0.15;
      case 'hard':
        holesRate = 0.25;
    }
    return characterToChoose[Math.floor(Math.random() + holesRate)]
  }

  generateField() {
    for (let row = 0; row < this.fieldSize.height; row++){
      this.field[row] = [];
      for (let column = 0; column < this.fieldSize.width; column++) {
        this.field[row].push(this.getRandomHolesPlacement());
      }
    }

    this.field[this.hatPosition.y][this.hatPosition.x] = hat;
    this.field[0][0] = playerCharacter;
  }

  print() {
    console.clear();
    console.log('\nFind The Hat ...\n');
    this.field.forEach(row => {
      console.log(row.join(''));
    });
    console.log("\nPress 'q' at any time to quit ...")
    
    if (this.hatFound) {
      console.clear();
      console.log('YOU WIN!!')
    }
    if (this.playerDropped) {
      console.clear();
      console.log('GAME OVER!!')
    }
  }

  run() {
    while (this.gameRunning) {
      let playerMovement = this.getPlayerInput();
      this.handleUserInput(playerMovement);
      this.handlePlayerMovement();
      this.print(); 
    }
  }
}

const testGame = () => {
  const myField = new Field([
    ['*', '░', 'O', '░', 'O'],
    ['░', 'O', '░', '░', '░'],
    ['░', '░', '^', '░', 'O'],
    ['O', '░', 'O', '░', '░'],
  ]);
  myField.print();
  myField.run()   
}


const getInput = () => {
  console.clear();
  let fieldHeight = prompt(`Height of the field (default ${defaultFieldSize.height}) : `, defaultFieldSize.height);
  let fieldWidth = prompt(`Width of the field? (default ${defaultFieldSize.width}) : `, defaultFieldSize.width);
  let gameDifficulty = prompt('Difficulty of the game (choose between easy-medium-hard, default medium) : ');

  try {
    fieldHeight = Number(fieldHeight);
  } catch (err) {
    fieldHeight = defaultFieldSize.height;
  }
  try {
    fieldWidth = Number(fieldWidth);
  } catch (err) {
    fieldWidth = defaultFieldSize.width;
  }

  fieldHeight = fieldHeight <= 30 ? fieldHeight : defaultFieldSize.height;
  fieldWidth = fieldWidth <= 60 ? fieldWidth : defaultFieldSize.width;
  gameDifficulty = gameDifficulty === 'easy' || gameDifficulty === 'hard' ? gameDifficulty : 'medium';

  return {
    height: fieldHeight,
    width: fieldWidth,
    difficulty: gameDifficulty
  }
}

const runGame = () => {
  let inputData = getInput();
  const myField = new Field(inputData.height, inputData.width, inputData.difficulty);

  myField.generateField();
  myField.print();
  myField.run();
}

runGame();
// testGame();