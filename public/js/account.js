import { registerUser, loginUser, getUserBalance, logoutUser, updateUserBalance } from '../service/service.js';

// Modal logic for Login (unchanged)
const loginModal = document.getElementById("loginModal");
const openLoginModalBtn = document.getElementById("openLoginModalBtn");
const closeLoginModalBtn = document.getElementById("closeLoginModalBtn");

openLoginModalBtn.addEventListener("click", function () {
    loginModal.style.display = "flex";
});

closeLoginModalBtn.addEventListener("click", function () {
    loginModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    }
});

// Modal logic for Registration (unchanged)
const registrationModal = document.getElementById("registrationModal");
const openRegistrationModalBtn = document.getElementById("openRegistrationModalBtn");
const closeRegistrationModalBtn = document.getElementById("closeRegistrationModalBtn");

openRegistrationModalBtn.addEventListener("click", function () {
    registrationModal.style.display = "flex";
});

closeRegistrationModalBtn.addEventListener("click", function () {
    registrationModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target === registrationModal) {
        registrationModal.style.display = "none";
    }
});

// Handle Registration Form Submission (unchanged)
document.getElementById('registration-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const registrationUsername = document.getElementById('registration-username').value;
    const registrationPassword = document.getElementById('registration-password').value;
    const passwordConfirmation = document.getElementById('passwordConfirmation').value;

    if (registrationPassword !== passwordConfirmation) {
        alert('As senhas não coincidem. Por favor, tente novamente.');
        return;
    }

    try {
        const response = await registerUser({ username: registrationUsername, password: registrationPassword });
        alert('Usuário registrado com sucesso!');
        console.log('Registration successful:', response);
        window.location.href = '/account.html'; // Redirect to the login page
    } catch (error) {
        alert('Erro ao registrar usuário. Por favor, tente novamente.');
        console.error('Registration error:', error);
    }
});

// Handle Login Form Submission (unchanged)
document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const loginUsername = document.getElementById('login-username').value;
    const loginPassword = document.getElementById('login-password').value;

    try {
        const response = await loginUser({ username: loginUsername, password: loginPassword });

        if (response.status !== 200) { // Check the status code
            const errorData = await response.json(); // Get error details from the server
            throw new Error(errorData.message || 'Invalid credentials'); // Use server-provided message if available
        }
        
        // Proceed with successful login logic
        alert('Login realizado com sucesso!');
        console.log('Login successful:', response);
        window.location.href = '/account.html'; 
        
    } catch (error) {
        alert('Erro ao fazer login. Por favor, verifique seu usuário e senha.');
        console.error('Login error:', error);
    }
});

// Fetch user data (updated to manage button visibility)
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch user data (username and balance)
        const userData = await getUserBalance();

        // Display username and balance on the page
        document.getElementById('usernameDisplay').textContent = `${userData.username}`;
        document.getElementById('creditsDisplay').textContent = `${userData.balance}`;

        // Hide login and register buttons, show logout button
        document.getElementById('openLoginModalBtn').style.display = 'none';
        document.getElementById('openRegistrationModalBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-block';

        // Show the "Add Credits" section
        document.getElementById('creditManagement').style.display = 'block';

    } catch (error) {
        console.error('Error loading user data:', error);
        
        // If no user data is found, keep login and register buttons visible
        document.getElementById('openLoginModalBtn').style.display = 'inline-block';
        document.getElementById('openRegistrationModalBtn').style.display = 'inline-block';
        document.getElementById('logoutBtn').style.display = 'none';
    }
});

// Add Credits Button Logic
document.getElementById('addCreditsBtn').addEventListener('click', async function () {
    const creditAmount = parseInt(document.getElementById('creditAmount').value);

    if (isNaN(creditAmount) || creditAmount <= 0) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    const balanceData = { amount: creditAmount }; // Amount to be added to the balance

    try {
        // Update user balance
        const updatedUser = await updateUserBalance(balanceData);

        // Update balance on the page dynamically
        document.getElementById('creditsDisplay').textContent = updatedUser.balance;

        alert('Créditos adicionados com sucesso!');

        // Optionally, re-fetch user data (balance)
        const newUserData = await getUserBalance();
        document.getElementById('creditsDisplay').textContent = `${newUserData.balance}`;
    } catch (error) {
        alert('Erro ao adicionar créditos. Tente novamente.');
        console.error('Error during balance update:', error);
    }
});


// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', async function () {
    try {
        // Call logoutUser to log out
        const response = await logoutUser();

        if (response.status === 200) {
            // On success, redirect to the main page (index.html)
            alert('Você foi desconectado com sucesso!');
            window.location.href = '/index.html';
        } else {
            throw new Error('Erro ao fazer logout');
        }
    } catch (error) {
        alert('Erro ao tentar fazer logout. Tente novamente.');
        console.error('Logout error:', error);
    }
});
