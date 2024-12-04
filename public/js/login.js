import { registerUser, loginUser } from './service.js';

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
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('passwordConfirmation').value;

    // Check if passwords match
    if (password !== passwordConfirmation) {
        alert('As senhas não coincidem. Por favor, tente novamente.');
        return;
    }

    try {
        // Call the service to register the user
        const response = await registerUser({ username, password });
        alert('Usuário registrado com sucesso!');
        console.log('Registration successful:', response);

        // Optionally, redirect to the login page after successful registration
        window.location.href = '/login.html'; 
    } catch (error) {
        alert('Erro ao registrar usuário. Por favor, tente novamente.');
        console.error('Registration error:', error);
    }
});

// Handle Login Form Submission
document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Call the service to log the user in
        const response = await loginUser({ username, password });
        alert('Login realizado com sucesso!');
        console.log('Login successful:', response);

        // Optionally, redirect to a dashboard or home page after successful login
        window.location.href = '/dashboard.html'; // Redirect to the main page or dashboard
    } catch (error) {
        alert('Erro ao fazer login. Por favor, verifique seu usuário e senha.');
        console.error('Login error:', error);
    }
});
