document.addEventListener('DOMContentLoaded', () => {
    const accountEmail = document.getElementById('account-email');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const changePasswordForm = document.getElementById('change-password-form');
    const submitPasswordChange = document.getElementById('submit-password-change');
    const accountMessage = document.getElementById('account-message');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    accountEmail.textContent = currentUser.email;

    changePasswordBtn.addEventListener('click', () => {
        changePasswordForm.style.display = 'block';
    });

    submitPasswordChange.addEventListener('click', () => {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            accountMessage.textContent = 'Las nuevas contraseñas no coinciden';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);

        if (users[userIndex].password !== currentPassword) {
            accountMessage.textContent = 'La contraseña actual es incorrecta';
            return;
        }

        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

        accountMessage.textContent = 'Contraseña cambiada exitosamente';
        changePasswordForm.style.display = 'none';
    });
});
