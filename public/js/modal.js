document.addEventListener('DOMContentLoaded', () => {
    const openModalButtons = document.querySelectorAll('.open-modal');
    const closeModalButtons = document.querySelectorAll('.modal .close');
    const modals = document.querySelectorAll('.modal');

    // Abrir modal
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            document.getElementById(modalId).style.display = 'flex';
        });
    });

    // Fechar modal
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            document.getElementById(modalId).style.display = 'none';
        });
    });

    // Fechar modal ao clicar fora do conteúdo
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});