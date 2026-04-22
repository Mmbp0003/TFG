
const formulario = document.getElementById('loginForm');

formulario.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    const loginData = {
        email: document.getElementById('floatingInput').value,
        clave: document.getElementById('floatingPassword').value
    };

    try {

        const respuesta = await fetch('http://localhost:8080/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        if (respuesta.ok) {

            const usuario = await respuesta.json();
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
            window.location.href = 'inicio.html';

        } else {
            const mensajeErrorDeJava = await respuesta.text();
            alert(mensajeErrorDeJava);
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        alert('Error al conectar con el servidor.');
    }
});