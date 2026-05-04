document.addEventListener("DOMContentLoaded", () => {
    // Estas variables vendrán de tu lógica de Back-End/Sesión
    const esMiPropioPerfil = false; // Cambiar a true si el usuario logueado es el dueño
    const yaLoSigo = false;         // Cambiar según si el usuario logueado ya sigue a este perfil

    const btnSeguir = document.getElementById('btn-seguir');
    const btnDejarSeguir = document.getElementById('btn-dejar-seguir');
    const btnEditar = document.getElementById('btn-editar');

    function actualizarVisibilidadBotones() {
        // Ocultamos todos primero
        btnSeguir.style.display = 'none';
        btnDejarSeguir.style.display = 'none';
        btnEditar.style.display = 'none';

        if (esMiPropioPerfil) {
            // Si es mi perfil, solo veo botón de editar
            btnEditar.style.display = 'inline-block';
        } else {
            // Si es perfil ajeno, depende de si lo sigo o no
            if (yaLoSigo) {
                btnDejarSeguir.style.display = 'inline-block';
            } else {
                btnSeguir.style.display = 'inline-block';
            }
        }
    }

    // Ejecutar al cargar la página
    actualizarVisibilidadBotones();

    // Ejemplo de funcionalidad (puedes añadir tus fetch aquí)
    btnSeguir.addEventListener('click', () => {
        console.log("Siguiendo a este usuario...");
        // Aquí iría tu llamada al API
    });

    btnDejarSeguir.addEventListener('click', () => {
        console.log("Dejando de seguir...");
        // Aquí iría tu llamada al API
    });
});