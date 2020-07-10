const printField = (field, isHatFound, isPlayerDropped) => {
  console.clear();
  console.log('\nFind The Hat ...\n');
  field.forEach(row => {
    console.log(row.join(''));
  });
  console.log("\n☞ Move the character → Press w-a-s-d to pick a direction and press enter to confirm");
  console.log("☞ Press 'q' at any time to quit ...");

  if (isHatFound) {
    console.clear();
    console.log('YOU WIN!!');
  }
  if (isPlayerDropped) {
    console.clear();
    console.log('GAME OVER!!');
  }
}

module.exports = printField;