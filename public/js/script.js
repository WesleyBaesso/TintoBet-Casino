import { fetchGamePage } from "../service/service.js";

document.addEventListener('DOMContentLoaded', () => {
    // Attach click event listeners to all game buttons
    const gameButtons = document.querySelectorAll('.play-btn');
    
    gameButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gameType = this.getAttribute('data-game');
            redirectToGame(gameType);
        });
    });
});

// Redirect to the game's page by calling the service.js function
function redirectToGame(gameType) {
    fetchGamePage(gameType)
        .then(url => {
            // Redirect the user to the specific game page
            window.location.href = url;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Game not found!');
        });
}
