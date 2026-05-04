document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const email = document.getElementById('floatingInput').value;
        const clave = document.getElementById('floatingPassword').value;

        const dtoLogin = {
            email: email,
            clave: clave
        };

        try {
            // "http://localhost:8080" si tu servidor usa otro puerto
            const response = await fetch('http://localhost:8080/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Le decimos al backend que enviamos JSON
                },
                body: JSON.stringify(dtoLogin) // Convertimos nuestro objeto JavaScript a texto JSON
            });

            if (response.ok) {
                const usuario = await response.json();

                delete usuario.clave;
                const recordar = document.getElementById('checkDefault').checked;
                const usuarioJSON = JSON.stringify(usuario);

                if (recordar) {
                    localStorage.setItem('usuarioLogueado', usuarioJSON);
                } else {
                    sessionStorage.setItem('usuarioLogueado', usuarioJSON);
                }
                window.location.href = 'inicio.html';

            } else {
                // Si la contraseña o el correo son incorrectos
                const mensajeError = await response.text();
                alert('Error al iniciar sesión: ' + mensajeError);
            }

        } catch (error) {
            console.error('Error de conexión:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });
});