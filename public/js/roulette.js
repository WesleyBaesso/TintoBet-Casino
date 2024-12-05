document.addEventListener("DOMContentLoaded", () => {
    const wheel = document.getElementById("roulette-wheel");
    const ball = document.getElementById("roulette-ball");
    const spinBtn = document.getElementById("spin-btn");
    const resultNumber = document.getElementById("result-number");

    let spinning = false;

    spinBtn.addEventListener("click", () => {
        if (spinning) return; // Prevent multiple spins at the same time

        spinning = true;
        const totalSectors = 13; // Number of numbers on the wheel
        const randomSector = Math.floor(Math.random() * totalSectors);
        const anglePerSector = 360 / totalSectors;
        const randomAngle = randomSector * anglePerSector;

        // Calculate the final rotation angles
        const spins = 5; // Number of spins before stopping
        const finalWheelAngle = spins * 360 + randomAngle;
        const finalBallAngle = -1 * (spins * 720 + randomAngle); // Opposite and faster spin

        // Spin the wheel
        wheel.style.transform = `rotate(${finalWheelAngle}deg)`;

        // Spin the ball
        ball.style.animation = "none"; // Reset the animation
        setTimeout(() => {
            ball.style.animation = `ball-spin 3s linear infinite`;
        }, 10); // Restart animation to sync

        // Set result after spin ends
        setTimeout(() => {
            spinning = false;
            resultNumber.textContent = randomSector;
            ball.style.animation = "none"; // Stop the ball's animation
        }, 3000); // Match the CSS transition duration
    });
});
