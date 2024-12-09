import { handleGameRequest, getUserBalance, fetchPage } from "../service/service.js";

let currentMultiplier = 1.00;
let gameInterval;
let cashOutDone = false;
let gameId = null;
let betAmount = 0;
let userBalance = 0; // We will set this dynamically when the page loads
let chartData = {
    labels: [0],
    datasets: [{
        label: 'Multiplicador',
        data: [1.00],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1
    }]
};

const startButton = document.getElementById('start-button');
const betInput = document.getElementById('bet-amount');
const multiplierDisplay = document.getElementById('multiplier');
const cashOutButton = document.getElementById('cash-out-button');
const resultDisplay = document.getElementById('result');
const balanceDisplay = document.getElementById('balance');
const ctx = document.getElementById('multiplierChart').getContext('2d');
const multiplierChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
        responsive: true,
        scales: {
            x: { type: 'linear', position: 'bottom' }
        }
    }
});

// WebSocket connection setup
const ws = new WebSocket('ws://localhost:3000'); // Connect to WebSocket server

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'game_crash') {
        const { gameId: crashedGameId, crashMultiplier } = message;

        if (crashedGameId === gameId) {
            clearInterval(gameInterval); // Stop the game interval
            showResult(`Você perdeu! O jogo estourou com multiplicador ${crashMultiplier.toFixed(2)}`);
        }
    }
};

ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
};

ws.onclose = () => {
    console.log('WebSocket connection closed');
};

startButton.addEventListener('click', startGame);
cashOutButton.addEventListener('click', cashOut);

// Fetch and display the user's balance when the page loads
async function fetchUserBalance() {
    try {
        const userData = await getUserBalance();
        userBalance = userData.balance;
        balanceDisplay.innerText = userBalance.toFixed(2); // Update balance on the page
    } catch (error) {
        console.error("Error fetching user balance:", error);
        alert("Error fetching balance. Please try again.");
    }
}

async function startGame() {
    betAmount = parseFloat(betInput.value);

    if (isNaN(betAmount) || betAmount <= 0) {
        alert("Por favor, insira um valor válido para a aposta.");
        return;
    }

    if (betAmount > userBalance) {
        alert("Você não tem saldo suficiente para essa aposta.");
        return;
    }

    try {
        const response = await handleGameRequest(betAmount, 'crash/start');
        gameId = response.result.gameId;
        const startTime = response.result.startTime;
        currentMultiplier = 1.00;

        userBalance -= betAmount;
        balanceDisplay.innerText = userBalance.toFixed(2); // Update balance after the bet

        startButton.disabled = true;
        betInput.disabled = true;
        cashOutButton.disabled = false;
        cashOutDone = false;

        chartData.labels = [0];
        chartData.datasets[0].data = [1.00];
        multiplierChart.update();

        gameInterval = setInterval(() => increaseMultiplier(startTime), 100);

    } catch (error) {
        console.error("Error starting game:", error);
        alert("Error starting the game. Please try again.");
    }
}

function increaseMultiplier(startTime) {
    const elapsedTime = (Date.now() - startTime) / 1000; // Time in seconds
    currentMultiplier = parseFloat((elapsedTime * 0.1 + 1).toFixed(2)); // Calculate multiplier based on time elapsed

    // Display multiplier on UI
    multiplierDisplay.innerText = currentMultiplier;

    chartData.labels.push(chartData.labels.length);
    chartData.datasets[0].data.push(currentMultiplier);
    multiplierChart.update();
}

function showResult(message) {
    resultDisplay.innerText = message;
    cashOutButton.disabled = true;
    setTimeout(resetGame, 3000);
}

async function cashOut() {
    if (cashOutDone) return;

    try {
        console.log('frontend cashout', gameId);
        const response = await handleGameRequest(betAmount, 'crash/stop', gameId);
        const winAmount = response.result.winnings;
        const crashMultiplier = response.result.crashMultiplier;

        // Immediately update balance after cash-out
        userBalance += winAmount;
        balanceDisplay.innerText = userBalance.toFixed(2);

        showResult(`Você fez cash out! Você ganhou ${winAmount.toFixed(2)} com multiplicador ${crashMultiplier}`);

        clearInterval(gameInterval); // Stop the game interval
        cashOutDone = true;
    } catch (error) {
        console.error("Error during cash-out:", error);
        alert("Error during cash-out. Please try again.");
    }
}

function resetGame() {
    startButton.disabled = false;
    betInput.disabled = false;
    betInput.value = '';
    resultDisplay.innerText = '';
    gameId = null;
}

// Fetch and display user balance when the page loads
fetchUserBalance();

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