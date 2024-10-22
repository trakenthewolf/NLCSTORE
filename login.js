document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.createElement('p'); // Crear elemento para mensajes
    loginForm.appendChild(loginMessage); // Añadir el elemento al formulario

    // Inicializar el usuario admin si no existe
    if (!localStorage.getItem('adminUser')) {
        localStorage.setItem('adminUser', JSON.stringify({
            email: 'maximilianoferreria3@gmail.com',
            password: 'maxinicole'
        }));
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const adminUser = JSON.parse(localStorage.getItem('adminUser'));

        if (email === adminUser.email && password === adminUser.password) {
            // Es el administrador
            localStorage.setItem('isAdminLoggedIn', 'true');
            loginMessage.textContent = 'Inicio de sesión exitoso como administrador';
            loginMessage.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        } else {
            // Verificar si es un usuario regular
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                loginMessage.textContent = 'Inicio de sesión exitoso';
                loginMessage.style.color = 'green';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                loginMessage.textContent = 'Correo o contraseña incorrectos';
                loginMessage.style.color = 'red';
            }
        }
    });
});
