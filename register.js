document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            alert('Este correo ya está registrado');
        } else {
            users.push({ email, phone, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registro exitoso. Puedes iniciar sesión ahora.');
            window.location.href = 'login.html';
        }
    });
});
