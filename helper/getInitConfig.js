const prompt = require('prompt-sync')({ sigint: true });

const getInitialConfigurations = (defaultFieldSize) => {
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

module.exports = getInitialConfigurations;