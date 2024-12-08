const playGame = async (betValue, alwaysWin = false) => {
  const itemsLength = 4; // Known items length (hardcoded in this case)
  
  // If alwaysWin is true, force a winning result
  if (alwaysWin) {
      const doorResults = [0, 0, 0]; // Any result where all doors match
      const winnings = betValue * 10; // Guaranteed win
      return {
          winnings,
          doorResults,
      };
  }

  // Normal game logic
  const { winnings, doorResults } = spin(itemsLength, betValue);

  return {
      winnings,
      doorResults,
  };
};

const spin = (itemsLength, betValue) => {
  const doorResults = Array.from({ length: 3 }, () => Math.floor(Math.random() * itemsLength));

  const winnings = doorResults.every((result) => result === doorResults[0]) ? betValue * 10 : 0;

  return { winnings, doorResults };
};

module.exports = { playGame };
