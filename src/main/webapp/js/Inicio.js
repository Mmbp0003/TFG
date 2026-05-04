document.addEventListener("DOMContentLoaded", () => {

    const currentPage = window.location.pathname.split("/").pop();


    /* =========================
       TOGGLE MENÚS (FILTROS + ORDEN)
       ========================= */

    const filterMenus = document.querySelectorAll(".filter-menu");

    filterMenus.forEach(menu => {
        const toggle = menu.querySelector(".toggle-filter-menu");
        const form = menu.querySelector(".filter-form");

        if (toggle && form) {
            toggle.addEventListener("click", () => {

                // cerrar otros filtros abiertos
                document.querySelectorAll(".filter-form").forEach(f => {
                    if (f !== form) f.classList.remove("active");
                });

                // toggle actual
                form.classList.toggle("active");
            });
        }
    });


    /* =========================
       LOGIN (IMPORTANTE)
       ========================= */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const clave = document.getElementById("clave").value;

            try {
                const response = await fetch("http://localhost:8080/api/usuarios/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, clave })
                });

                if (response.ok) {
                    const usuario = await response.json();

                    // guardar sesión simple
                    localStorage.setItem("usuario", JSON.stringify(usuario));

                    // redirección
                    window.location.href = "../Vistas/Inicio.html";

                } else {
                    const msg = await response.text();
                    alert("Error login: " + msg);
                }

            } catch (error) {
                console.error("Error en login:", error);
                alert("Error de conexión con el servidor");
            }
        });
    }

});