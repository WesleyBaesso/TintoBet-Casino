import { fetchPage } from "../service/service.js";

let player = {
    name: "Vitor",
    chips: 100
}
let cards = []
let sumCards = 0
let hasBlackjack = false
let isAlive = false
let message = ""
let messageEl = document.querySelector("#message-el")
let sumEl = document.querySelector("#sum-el")
let cardsEl = document.querySelector("#cards-el")
let playerEl = document.querySelector("#player-el")

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13)+1 
    if (randomNumber === 1) {
        return 11
    } else if (randomNumber > 10) {
        return 10
    } else {
        return randomNumber
    }
}

function startGame() {
    if (isAlive === false) {
        isAlive = true
        let firstCard = getRandomCard()
        let secondCard = getRandomCard()
        cards = [firstCard, secondCard]
        sumCards = firstCard + secondCard
        hasBlackjack = false
        renderGame()
    }
}

function renderGame() {
    cardsEl.textContent = "Cards: "
    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " "
    }
    sumEl.textContent = "Sum: " + sumCards
    if (sumCards <= 20) {
        message = "Draw another card?"    
    } else if (sumCards === 21) {
        message = "You have Blackjack!"
        hasBlackjack = true
        isAlive = false
    } else {
        message = "You lost!"
        isAlive = false
    }
    messageEl.textContent = message
    chipsAtt()
}

function chipsAtt() {
    if (hasBlackjack === true && isAlive === false) {
        player.chips += 100
    } else if (hasBlackjack === false && isAlive === false) {
        player.chips -= 5
    } else {
        player.chips = player.chips
    }
    playerEl.textContent = player.name + ": R$ " + player.chips
}

function newCard() {
    if (isAlive === true && hasBlackjack === false) {
        let card = getRandomCard()
        sumCards += card
        cards.push(card)
        renderGame()
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Attach click event listeners to all game buttons
    const pageRedirects = document.querySelectorAll('.page-redirect');
    
    pageRedirects.forEach(button => {
        button.addEventListener('click', function() {
            const pageName = this.getAttribute('page-name');
            redirectToPage(pageName);
        });
    });
});

// Redirect to the game's page by calling the service.js function
function redirectToPage(pageName) {
    fetchPage(pageName)
        .then(url => {
            // Redirect the user to the specific game page
            window.location.href = url;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Game not found!');
        });
}