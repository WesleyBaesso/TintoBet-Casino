let betAmount = 0;
let currentMultiplier = 1.00;
let crashMultiplier = 0;
let gameInterval;
let crashTime;
let cashOutDone = false;
let userBalance = 500.00; // Saldo inicial do usuário
let chartData = {
    labels: [0],
    datasets: [{
        label: 'Multiplicador',
        data: [1.00],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        lineTension: 0.1
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
            x: {
                type: 'linear',
                position: 'bottom'
            }
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

    userBalance -= betAmount; // Subtrai a aposta do saldo do usuário
    balanceDisplay.innerText = userBalance.toFixed(2);
    
    startButton.disabled = true;
    betInput.disabled = true;
    cashOutButton.disabled = false;
    cashOutDone = false;
    
    // Gerar o multiplicador de crash aleatório
    crashMultiplier = (Math.random() * (5 - 1) + 1).toFixed(2); // Entre 1 e 5

    currentMultiplier = 1.00;
    multiplierDisplay.innerText = currentMultiplier;

    // Limpa os dados do gráfico para reiniciar a partida
    chartData.labels = [0];
    chartData.datasets[0].data = [1.00];
    multiplierChart.update();

    // Iniciar o aumento do multiplicador
    gameInterval = setInterval(increaseMultiplier, 100);
}

function increaseMultiplier() {
    if (currentMultiplier >= crashMultiplier) {
        clearInterval(gameInterval);
        showResult("Você perdeu! O jogo 'crashou'.");
    } else {
        currentMultiplier += Math.random() * (0.1 - 0.02) + 0.02; // Aumento gradual
        currentMultiplier = parseFloat(currentMultiplier.toFixed(2));
        multiplierDisplay.innerText = currentMultiplier;

        // Atualiza o gráfico
        chartData.labels.push(chartData.labels.length);
        chartData.datasets[0].data.push(currentMultiplier);
        multiplierChart.update();
    }
}

function cashOut() {
    if (cashOutDone) {
        return;
    }

    clearInterval(gameInterval);
    cashOutDone = true;
    const winAmount = (betAmount * currentMultiplier).toFixed(2);
    userBalance += parseFloat(winAmount); // Adiciona o ganho ao saldo
    balanceDisplay.innerText = userBalance.toFixed(2);
    
    showResult(`Você fez cash out! Você ganhou R$ ${winAmount}`);
}

function showResult(message) {
    resultDisplay.innerText = message;
    cashOutButton.disabled = true;
    setTimeout(() => {
        resetGame();
    }, 3000);
}

function resetGame() {
    startButton.disabled = false;
    betInput.disabled = false;
    betInput.value = '';
    resultDisplay.innerText = '';
}