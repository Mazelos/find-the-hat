const getRandomHolesPlacement = (difficulty, ground, hole) => {
  const characterToChoose = [ground, hole];
  let holesRate;
  // make holes more frequents based on the difficulty 
  switch (difficulty) {
    case 'easy':
      holesRate = 0.1;
    case 'medium':
      holesRate = 0.15;
    case 'hard':
      holesRate = 0.25;
  }
  return characterToChoose[Math.floor(Math.random() + holesRate)]
}

module.exports = (fieldSize, difficulty, hatPosition, { hat, hole, ground, player }) => {
  const field = [];
  for (let row = 0; row < fieldSize.height; row++) {
    field[row] = [];
    for (let column = 0; column < fieldSize.width; column++) {
      field[row].push(getRandomHolesPlacement(difficulty, ground, hole));
    }
  }

  field[hatPosition.y][hatPosition.x] = hat;
  field[0][0] = player;

  return field
}