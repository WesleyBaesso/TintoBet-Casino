let player = {
    name: "",
    paintDrops: 0
};

// Elements
let messageEl = document.querySelector("#message-el");
let sumEl = document.querySelector("#sum-el");
let cardsEl = document.querySelector("#cards-el");
let playerEl = document.querySelector("#player-el");

// Login form
let loginForm = document.querySelector("#login-form");
let usernameInput = document.querySelector("#username");
let passwordInput = document.querySelector("#password");

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Send login request to the server
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.username && data.paintDrops !== undefined) {
            player.name = data.username;
            player.paintDrops = data.paintDrops;
            updatePlayerInfo();
            startGame(); // Start the game after successful login
        } else {
            messageEl.textContent = 'Invalid credentials';
        }
    })
    .catch(error => {
        messageEl.textContent = 'Error logging in. Please try again.';
        console.error('Login error:', error);
    });
});

// Function to update the UI with logged-in user's data
function updatePlayerInfo() {
    playerEl.textContent = `${player.name}: ${player.paintDrops} Paint Drops`;
}

// Blackjack Game Logic (updated for dynamic player data)
let cards = [];
let sumCards = 0;
let dealerCards = [];
let sumDealerCards = 0;
let hasBlackjack = false;
let isAlive = false;
let message = "";

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

function startGame() {
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

function renderGame() {
    cardsEl.textContent = "Cards: ";
    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " ";
    }
    sumEl.textContent = "Sum: " + sumCards;

    // Display dealer's cards
    let dealerCardsEl = document.querySelector("#dealer-cards");
    dealerCardsEl.textContent = "Dealer's Cards: " + dealerCards[0] + " ?";

    if (sumCards <= 20) {
        message = "Draw another card?";
    } else if (sumCards === 21) {
        message = "You have Blackjack!";
        hasBlackjack = true;
        isAlive = false;
        endGame();  // Ends the game as player has Blackjack
    } else {
        message = "You lost!";
        isAlive = false;
        endGame();  // Ends the game as player lost
    }
    messageEl.textContent = message;
    paintDropsAtt();
}

function paintDropsAtt() {
    if (hasBlackjack === true && isAlive === false) {
        player.paintDrops += 100;  // Reward for Blackjack
    } else if (hasBlackjack === false && isAlive === false) {
        player.paintDrops -= 5;  // Deduction for loss
    } else {
        player.paintDrops = player.paintDrops;  // No change during the game
    }
    updatePlayerInfo(); // Update Paint Drops
}

function newCard() {
    if (isAlive === true && hasBlackjack === false) {
        let card = getRandomCard();
        sumCards += card;
        cards.push(card);
        renderGame();
    }
}

function endGame() {
    // Simulate dealer's turn: Dealer draws until they reach 17 or higher
    while (sumDealerCards < 17) {
        let card = getRandomCard();
        sumDealerCards += card;
        dealerCards.push(card);
    }

    // Reveal dealer's cards
    let dealerCardsEl = document.querySelector("#dealer-cards");
    dealerCardsEl.textContent = "Dealer's Cards: " + dealerCards.join(" ") + " (Sum: " + sumDealerCards + ")";

    // Check who won: Player vs Dealer
    if ((sumCards > sumDealerCards && sumCards <= 21) || sumDealerCards > 21) {
        message = "You won!";
        if (hasBlackjack) {
            player.paintDrops += 100;
        } else {
            player.paintDrops += 10;
        }
    } else if (sumCards < sumDealerCards && sumCards <= 21) {
        message = "Dealer wins!";
        player.paintDrops -= 5;
    } else {
        message = "It's a tie!";
    }

    // After game ends, send result to backend to update the user's balance
    updateUserBalance(player.paintDrops);

    messageEl.textContent = message;
    updatePlayerInfo();  // Update Paint Drops after the game
}

function updateUserBalance(newBalance) {
    fetch('/api/update-balance', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: player.name,
            newBalance: newBalance
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Balance updated:', data);
    })
    .catch(error => {
        console.error('Error updating balance:', error);
    });
}
