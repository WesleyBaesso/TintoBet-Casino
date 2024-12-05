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

// Modal de Matrícula
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
