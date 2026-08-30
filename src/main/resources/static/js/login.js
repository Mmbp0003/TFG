document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("floatingInput").value;
        const clave = document.getElementById("floatingPassword").value;

        const dtoLogin = { email, clave };

        try {
            const response = await fetch("/api/usuarios/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dtoLogin)
            });

            const dataText = await response.text();

            if (!response.ok) {
                alert("Error al iniciar sesión: " + dataText);
                return;
            }

            let usuario;
            try {
                usuario = JSON.parse(dataText);
            } catch (e) {
                console.error("Respuesta no válida:", dataText);
                alert("Error del servidor");
                return;
            }


            localStorage.setItem('usuario', JSON.stringify(usuario));
            console.log("Usuario guardado en localStorage:", usuario);

            window.location.href = "inicio.html";

        } catch (error) {
            console.error(error);
            alert("No se pudo conectar con el servidor");
        }
    });

});