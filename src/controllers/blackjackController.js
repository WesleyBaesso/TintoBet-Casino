let player = {
    name: "",
    paintDrops: 0
};

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1;
    if (randomNumber === 1) {
        return 11;
    } else if (randomNumber > 10) {
        return 10;
    } else {
        return randomNumber;
    }
}

function playGame() {
    if (isAlive === false) {
        isAlive = true;
        let firstCard = getRandomCard();
        let secondCard = getRandomCard();
        cards = [firstCard, secondCard];
        sumCards = firstCard + secondCard;

        // Dealer starts with two cards
        let dealerFirstCard = getRandomCard();
        let dealerSecondCard = getRandomCard();
        dealerCards = [dealerFirstCard, dealerSecondCard];
        sumDealerCards = dealerFirstCard + dealerSecondCard;

        hasBlackjack = false;
        renderGame();
    }
}


function newCard() {
    if (isAlive === true && hasBlackjack === false) {
        let card = getRandomCard();
        sumCards += card;
        cards.push(card);
        renderGame();
    }
}
