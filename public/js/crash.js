import { fetchPage } from "../service/service.js";

let betAmount = 0;
let currentMultiplier = 1.00;
let crashMultiplier = 0;
let gameInterval;
let cashOutDone = false;
let userBalance = 500.00;
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

startButton.addEventListener('click', startGame);
cashOutButton.addEventListener('click', cashOut);

function startGame() {
    betAmount = parseFloat(betInput.value);

    if (isNaN(betAmount) || betAmount <= 0) {
        alert("Por favor, insira um valor válido para a aposta.");
        return;
    }

    if (betAmount > userBalance) {
        alert("Você não tem saldo suficiente para essa aposta.");
        return;
    }

    userBalance -= betAmount;
    balanceDisplay.innerText = userBalance.toFixed(2);

    startButton.disabled = true;
    betInput.disabled = true;
    cashOutButton.disabled = false;
    cashOutDone = false;

    crashMultiplier = parseFloat((Math.random() * (5 - 1) + 1).toFixed(2));
    currentMultiplier = 1.00;
    multiplierDisplay.innerText = currentMultiplier;

    chartData.labels = [0];
    chartData.datasets[0].data = [1.00];
    multiplierChart.update();

    gameInterval = setInterval(increaseMultiplier, 100);
}

function increaseMultiplier() {
    if (currentMultiplier >= crashMultiplier) {
        clearInterval(gameInterval);
        showResult("Você perdeu! O jogo 'crashou'.");
    } else {
        currentMultiplier += Math.random() * (0.1 - 0.02) + 0.02;
        currentMultiplier = parseFloat(currentMultiplier.toFixed(2));
        multiplierDisplay.innerText = currentMultiplier;

        chartData.labels.push(chartData.labels.length);
        chartData.datasets[0].data.push(currentMultiplier);
        multiplierChart.update();
    }
}

function cashOut() {
    if (cashOutDone) return;

    clearInterval(gameInterval);
    cashOutDone = true;

    const winAmount = (betAmount * currentMultiplier).toFixed(2);
    userBalance += parseFloat(winAmount);
    balanceDisplay.innerText = userBalance.toFixed(2);

    showResult(`Você fez cash out! Você ganhou R$ ${winAmount}`);
}

function showResult(message) {
    resultDisplay.innerText = message;
    cashOutButton.disabled = true;
    setTimeout(resetGame, 3000);
}

function resetGame() {
    startButton.disabled = false;
    betInput.disabled = false;
    betInput.value = '';
    resultDisplay.innerText = '';
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
