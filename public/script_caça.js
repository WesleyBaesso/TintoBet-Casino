// Arrays com emojis para os três rolos
const emojis1 = ['🍒', '🍉', '🍊', '🍇', '🍓', '🍍'];
const emojis2 = ['🍒', '🍉', '🍊', '🍇', '🍓', '🍍'];
const emojis3 = ['🍒', '🍉', '🍊', '🍇', '🍓', '🍍'];

const reels = document.querySelectorAll('.reel');
const button = document.querySelector('button');

// Função para iniciar a rotação dos rolos
function spin() {
  // Variável para armazenar os resultados dos rolos
  let results = [];

  // Adicionando delay entre os rolos
  reels.forEach((reel, index) => {
    // Seleciona um emoji aleatório da lista correspondente ao rolo
    let emojiList;
    if (index === 0) {
      emojiList = emojis1;
    } else if (index === 1) {
      emojiList = emojis2;
    } else {
      emojiList = emojis3;
    }

    // Puxa um emoji aleatório da lista
    const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
    const emojiElement = reel.querySelector('.emoji');

    // Aplica um pequeno atraso para a animação de cada rolo
    setTimeout(() => {
      // Aplica a animação de translação para o emoji atual
      emojiElement.style.animation = 'spin-out 0.5s ease-out';

      // Troca o emoji atual por um novo aleatório após a animação terminar
      setTimeout(() => {
        emojiElement.textContent = randomEmoji;
        
        // Aplicar a animação de translação ao novo emoji
        emojiElement.style.animation = 'spin-in 0.5s ease-out';  // Ajustando animação de entrada

      }, 500);  // Espera o tempo da animação para trocar o emoji
    }, index * 150);  // Delay ajustado para cada rolo

    results.push(randomEmoji);
  });

  // Verificando se os 3 emojis são iguais
  if (results[0] === results[1] && results[1] === results[2]) {
    triggerWinAnimation();
  }
}

// Função para disparar a animação de vitória
function triggerWinAnimation() {
  reels.forEach(reel => {
    reel.querySelector('.emoji').style.animation = 'win-animation 0.5s ease-in-out';
  });

  // Remover a animação após a execução
  setTimeout(() => {
    reels.forEach(reel => {
      reel.querySelector('.emoji').style.animation = ''; // Remove a animação
    });
  }, 500);
}

// Adiciona o evento de clique no botão
button.addEventListener('click', spin);
