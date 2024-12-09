import { handleGameRequest, getUserBalance, fetchPage } from "../service/service.js";

const doors = document.querySelectorAll(".door");
const lever = document.querySelector("#lever");
const betInput = document.querySelector("#betAmount");
const slotMachine = document.querySelector(".slot-machine");
const creditsDisplay = document.getElementById('creditsDisplay');

const items = [
  "images/paleta-de-cores.png",
  "images/pincel.png",
  "images/tinta-de-rolo.png",
  "images/balde-de-tinta.png",
];

export const slotMachineUI = {
  displayWin(prize) {
    this.flashBackground(slotMachine, "rgb(85, 239, 196)");
    setTimeout(() => {
      alert(`Você ganhou! +${prize} Paint Drops`);
    }, 100);
  },

  displayLoss() {
    this.flashBackground(slotMachine, "rgb(255, 99, 71)");
    setTimeout(() => {
      alert("Você perdeu! Tente novamente.");
    }, 100);
  },

  flashBackground(element, color) {
    element.style.backgroundColor = color;
    setTimeout(() => {
      element.style.backgroundColor = "";
    }, 2000);
  },

  resetDoors() {
    for (const door of doors) {
      const boxes = door.querySelector(".boxes");
      boxes.style.transitionDuration = "0s";
      boxes.style.transform = "translateY(0)";
      boxes.innerHTML = "";
    }
  },

  initDoors(doorResults, duration = 1) {
    this.resetDoors();

    for (const [index, door] of doors.entries()) {
      const boxes = door.querySelector(".boxes");
      const pool = [...items, ...items, ...items];
      pool.push(items[doorResults[index]]);

      for (const item of pool) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = `${door.clientWidth}px`;
        box.style.height = `${door.clientHeight}px`;

        const img = document.createElement("img");
        img.src = item;
        img.style.width = "60%";
        img.style.height = "50%";

        box.appendChild(img);
        boxes.appendChild(box);
      }

      setTimeout(() => {
        boxes.style.transitionDuration = `${duration}s`;
        boxes.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
      }, 50);
    }
  },
};

async function updateUserBalance() {
  try {
    const userData = await getUserBalance();
    creditsDisplay.textContent = `${userData.balance}`;
  } catch (error) {
    console.error("Error fetching user balance:", error);
    alert("Erro ao atualizar o saldo. Tente novamente.");
  }
}

async function handleLeverPull() {
  const betAmount = parseInt(betInput.value);
  if (isNaN(betAmount) || betAmount <= 0) {
    alert("Por favor, insira um valor de aposta válido.");
    return;
  }

  try {
    const { result, success } = await handleGameRequest(betAmount, "slots");

    if (!success) {
      alert("Erro ao processar o jogo. Tente novamente.");
      return;
    }

    const { winnings, doorResults } = result;

    slotMachineUI.initDoors(doorResults, 2);

    setTimeout(async () => {
      if (winnings > 0) {
        slotMachineUI.displayWin(winnings);
      } else {
        slotMachineUI.displayLoss();
      }

      // Update the balance after the spin
      await updateUserBalance();
    }, 2000);

  } catch (error) {
    console.error("Error handling lever pull:", error);
    alert("Ocorreu um erro ao processar a aposta. Tente novamente.");
  }
}

function attachEventListeners() {
  lever.addEventListener("click", handleLeverPull);
}

document.addEventListener("DOMContentLoaded", async () => {
  attachEventListeners();

  // Update balance when the page loads
  await updateUserBalance();
});

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
