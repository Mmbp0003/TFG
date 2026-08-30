document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("registroForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const datos = {
            nombre:          document.getElementById("floatingNombre").value.trim(),
            apellidos:       document.getElementById("floatingApellidos").value.trim(),
            fechaNacimiento: document.getElementById("floatingFecha").value,
            email:           document.getElementById("floatingEmail").value.trim(),
            clave:           document.getElementById("floatingPassword").value
        };

        fetch("/api/usuarios/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
            .then(res => {
                if (!res.ok) return res.text().then(msg => { throw new Error(msg); });
                return res.json();
            })
            .then(() => {
                window.location.href = "../Vistas/login.html";
            })
            .catch(err => {
                alert("Error al registrarse: " + err.message);
            });
    });
});