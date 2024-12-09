import { handleGameRequest, getUserBalance, fetchPage } from "../service/service.js";

// DOM Elements
const messageEl = document.querySelector("#message-el");
const sumEl = document.querySelector("#sum-el");
const cardsEl = document.querySelector("#cards-el");
const playerEl = document.querySelector("#player-el");

const startGameBtn = document.getElementById("start-game-btn");
const newCardBtn = document.getElementById("new-card-btn");
const endGameBtn = document.getElementById("end-game-btn");

// Variables
let socket;
let player = { name: "Player", chips: 0 };
let gameId = null;

// Update player display
function updatePlayerDisplay() {
    playerEl.textContent = `${player.name}: R$ ${player.chips}`;
}

// Render game state
function renderGame(state) {
    // Check if playerCards and dealerCards are defined before rendering them
    cardsEl.textContent = "Player Cards: " + (state.playerCards || []).join(" ");
    sumEl.textContent = "Player Sum: " + (state.playerSum || 0);
    messageEl.textContent = state.message || "Game in progress...";

    // Render dealer cards if available
    if (state.dealerCards) {
        cardsEl.textContent += "\nDealer Cards: " + state.dealerCards.join(" ");
    }

    // Display the bet value
    const betValueEl = document.getElementById("bet-value");
    if (betValueEl) {
        betValueEl.textContent = "Bet: R$ " + state.betValue;
    }

    // Enable or disable buttons based on the game state
    newCardBtn.disabled = state.gameOver;
    endGameBtn.disabled = state.gameOver;
}

// WebSocket connection setup
function initializeWebSocket() {
    socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
        console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);

        if (data.type === "blackjack_state") {
            const state = data.gameState; // Access game state correctly
            renderGame(state);  // Render the game state
            if (state.chips !== undefined) {
                player.chips = state.chips; // Update player chips if provided
                updatePlayerDisplay();
            }
        } else if (data.type === "error") {
            alert(data.message);  // Display error message in an alert
        }
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed");
    };
}

// Game actions
function startGame() {
    handleGameRequest(10, "blackjack")
        .then((response) => {
            gameId = response.result.gameId;
            player.chips -= 10; // Deduct bet amount from chips
            updatePlayerDisplay();
            socket.send(JSON.stringify({ action: "start", betValue: 10, gameId }));
            newCardBtn.disabled = false;
            endGameBtn.disabled = false;
        })
        .catch((error) => {
            console.error("Error starting game:", error);
            alert("Failed to start the game.");
        });
}

function newCard() {
    if (!gameId) return;
    socket.send(JSON.stringify({ action: "newCard", gameId }));
}

function endGame() {
    if (!gameId) return;
    socket.send(JSON.stringify({ action: "end", gameId }));
    newCardBtn.disabled = true;
    endGameBtn.disabled = true;
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    startGameBtn.addEventListener("click", startGame);
    newCardBtn.addEventListener("click", newCard);
    endGameBtn.addEventListener("click", endGame);

    // Fetch initial user balance
    getUserBalance()
        .then((userData) => {
            player.chips = userData.balance;
            player.name = userData.username;
            updatePlayerDisplay();
        })
        .catch((error) => {
            console.error("Error fetching user balance:", error);
            alert("Failed to fetch user balance.");
        });

    // Initialize WebSocket
    initializeWebSocket();

    // Page redirection for other buttons
    const pageRedirects = document.querySelectorAll(".page-redirect");
    pageRedirects.forEach((button) => {
        button.addEventListener("click", function () {
            const pageName = this.getAttribute("page-name");
            redirectToPage(pageName);
        });
    });
});

// Redirect function
function redirectToPage(pageName) {
    fetchPage(pageName)
        .then((url) => {
            window.location.href = url;
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Page not found!");
        });
}
