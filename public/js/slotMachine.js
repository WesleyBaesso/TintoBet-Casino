import { handleGameRequest } from "../service/service.js";

const doors = document.querySelectorAll(".door");
const lever = document.querySelector("#lever");
const betInput = document.querySelector("#betAmount");
const slotMachine = document.querySelector(".slot-machine");

const items = [
  "images/paleta-de-cores.png",
  "images/pincel.png",
  "images/tinta-de-rolo.png",
  "images/balde-de-tinta.png",
];

export const slotMachineUI = {
  displayWin(prize) {
    alert(`Você ganhou! +${prize} 💵.`);
    this.flashBackground(slotMachine, "rgb(85, 239, 196)");
  },

  displayLoss() {
    alert("Você perdeu! Tente novamente.");
    this.flashBackground(slotMachine, "rgb(255, 99, 71)");
  },

  flashBackground(element, color) {
    element.style.backgroundColor = color;
    setTimeout(() => {
      element.style.backgroundColor = "";
    }, 2000);
  },

  initDoors(doorResults, duration = 1) {
    for (const [index, door] of doors.entries()) {
      const boxes = door.querySelector(".boxes");
      const boxesClone = boxes.cloneNode(false);

      const pool = [items[doorResults[index]]]; // Map indices to item paths

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = `${door.clientWidth}px`;
        box.style.height = `${door.clientHeight}px`;

        const img = document.createElement("img");
        img.src = pool[i];
        img.style.width = "60%";
        img.style.height = "50%";

        box.appendChild(img);
        boxesClone.appendChild(box);
      }

      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
      door.replaceChild(boxesClone, boxes);
    }
  },
};

async function handleLeverPull() {
  const betAmount = parseInt(betInput.value);
  if (isNaN(betAmount) || betAmount <= 0) {
    alert("Por favor, insira um valor de aposta válido.");
    return;
  }

  try {
    // Call the backend to process the game logic
    const { result, success } = await handleGameRequest(betAmount, "slots");

    if (!success) {
      alert("Erro ao processar o jogo. Tente novamente.");
      return;
    }

    const { winnings, doorResults } = result;

    // Update the slot machine UI
    slotMachineUI.initDoors(doorResults, 2);

    if (winnings > 0) {
      slotMachineUI.displayWin(winnings);
    } else {
      slotMachineUI.displayLoss();
    }
  } catch (error) {
    console.error("Error handling lever pull:", error);
    alert("Ocorreu um erro ao processar a aposta. Tente novamente.");
  }
}

function attachEventListeners() {
  lever.addEventListener("click", handleLeverPull);
}

document.addEventListener("DOMContentLoaded", attachEventListeners);
