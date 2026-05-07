document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("floatingInput").value;
        const clave = document.getElementById("floatingPassword").value;

        const dtoLogin = { email, clave };

        try {
            const response = await fetch("http://localhost:8080/api/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dtoLogin)
            });

            // 🔴 IMPORTANTE: primero leer como texto (evita el JSON.parse roto)
            const dataText = await response.text();

            if (!response.ok) {
                alert("Error al iniciar sesión: " + dataText);
                return;
            }

            // 🔵 ahora sí intentamos convertir a JSON de forma segura
            let usuario;
            try {
                usuario = JSON.parse(dataText);
            } catch (e) {
                console.error("Respuesta del servidor NO es JSON:", dataText);
                alert("Error del servidor (respuesta inválida)");
                return;
            }

            delete usuario.clave;

            const recordar = document.getElementById("checkDefault").checked;

            const usuarioJSON = JSON.stringify(usuario);

            if (recordar) {
                localStorage.setItem("usuarioLogueado", usuarioJSON);
            } else {
                sessionStorage.setItem("usuarioLogueado", usuarioJSON);
            }

            window.location.href = "Inicio.html";

        } catch (error) {
            console.error(error);
            alert("No se pudo conectar con el servidor");
        }
    });

});