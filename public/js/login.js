import { registerUser, loginUser } from '../service/service.js';

// Modal logic for Login
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

// Modal logic for Registration
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

// Handle Registration Form Submission
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
        window.location.href = '/index.html'; // Redirect to the login page
    } catch (error) {
        alert('Erro ao registrar usuário. Por favor, tente novamente.');
        console.error('Registration error:', error);
    }
});

// Handle Login Form Submission
document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const loginUsername = document.getElementById('login-username').value;
    const loginPassword = document.getElementById('login-password').value;

    try {
        const response = await loginUser({ username: loginUsername, password: loginPassword });
        alert('Login realizado com sucesso!');
        console.log('Login successful:', response);
        window.location.href = '/index.html'; // Redirect to the main page
    } catch (error) {
        alert('Erro ao fazer login. Por favor, verifique seu usuário e senha.');
        console.error('Login error:', error);
    }
});