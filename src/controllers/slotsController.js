const playGame = async (userId, betValue) => {
    const itemsLength = 4; // Known items length (hardcoded in this case)
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
  