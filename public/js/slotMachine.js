(function () {
  const items = [
    '🍎', '🍌', '🍒', '🍉', // 4 emojis
  ];

  const doors = document.querySelectorAll('.door');
  const lever = document.querySelector('#lever');
  const betInput = document.querySelector('#betAmount');
  const saldoDisplay = document.querySelector('#saldo');
  const initialBalanceInput = document.querySelector('#initialBalance');
  const setBalanceButton = document.querySelector('#setBalance');

  let saldo = 0; // Saldo inicial do jogador

  // Atualiza o saldo na tela
  function updateSaldo() {
    saldoDisplay.textContent = saldo;
  }

  // Função para definir o saldo inicial
  setBalanceButton.addEventListener('click', () => {
    const initialBalance = parseInt(initialBalanceInput.value);
    if (initialBalance > 0) {
      saldo = initialBalance; // Define o saldo inicial
      updateSaldo(); // Atualiza o saldo na tela
      alert(`Saldo inicial de ${saldo} 💰 definido!`);
    } else {
      alert("Valor de saldo inicial inválido.");
    }
  });

  lever.addEventListener('click', spin);

  function init(firstInit = true, duration = 1) {
    for (const door of doors) {
      const boxes = door.querySelector('.boxes');
      const boxesClone = boxes.cloneNode(false);
      const pool = ['❓'];

      if (!firstInit) {
        const arr = [...items]; // Usando somente os 4 emojis
        pool.push(...shuffle(arr));

        boxesClone.addEventListener('transitionstart', function () {
          this.querySelectorAll('.box').forEach((box) => {
            box.style.filter = 'blur(1px)';
          });
        }, { once: true });

        boxesClone.addEventListener('transitionend', function () {
          this.querySelectorAll('.box').forEach((box, index) => {
            box.style.filter = 'blur(0)';
            if (index > 0) this.removeChild(box);
          });
        }, { once: true });
      }

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.style.width = door.clientWidth + 'px';
        box.style.height = door.clientHeight + 'px';
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      }

      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
      door.replaceChild(boxesClone, boxes);
    }
  }

  // Função para girar as portas
  async function spin() {
    const betAmount = parseInt(betInput.value);
    if (betAmount <= 0 || betAmount > saldo) {
      alert("Valor da aposta inválido ou insuficiente.");
      return;
    }

    saldo -= betAmount; // Deduz a aposta do saldo
    updateSaldo(); // Atualiza o saldo na tela

    init(false, 2);

    const doorResults = [];

    for (const door of doors) {
      const boxes = door.querySelector('.boxes');
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = 'translateY(0)';
      await new Promise((resolve) => setTimeout(resolve, duration * 100));

      const result = boxes.querySelector('.box').textContent;
      doorResults.push(result); // Armazena o resultado de cada porta
    }

    // Verifica se todos os emojis são iguais
    if (doorResults[0] === doorResults[1] && doorResults[0] === doorResults[2]) {
      // O jogador ganhou! O valor da aposta será multiplicado por 10
      const prize = betAmount * 10;
      saldo += prize; // Aumento do saldo
      updateSaldo(); // Atualiza o saldo na tela

      alert(`Você ganhou! +${prize} 💵.`);
      
      // Muda o fundo para verde (vitória)
      document.body.style.backgroundColor = 'rgb(85, 239, 196)'; // Cor verde clara (sucesso)

      // Reseta a cor do fundo após 2 segundos
      setTimeout(() => {
        document.body.style.backgroundColor = '#1a2b45'; // Cor de fundo original
      }, 2000);

    } else {
      // O jogador perdeu.
      alert("Você perdeu! Tente novamente.");
      
      // Muda o fundo para vermelho (erro)
      document.body.style.backgroundColor = 'rgb(255, 99, 71)'; // Cor vermelha (erro)

      // Reseta a cor do fundo após 2 segundos
      setTimeout(() => {
        document.body.style.backgroundColor = '#1a2b45'; // Cor de fundo original
      }, 2000);
    }
  }

  // Função para embaralhar os emojis
  function shuffle(arr) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  init(); // Inicializa a máquina ao carregar a página
})();
