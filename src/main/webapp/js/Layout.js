const Rutas = {
    "inicio.html": "inicio",
    "perfil.html": "perfil",
    "login.html": "login",
    "libro.html": "libro",
    "biblioteca.html": "biblioteca",
    "buscador.html": "buscador",
    "carpetas.html": "carpetas",
    "recomendaciones.html": "recomendaciones"
};

function getRuta() {
    return Rutas[window.location.pathname.split("/").pop().toLowerCase()] || "";
}

document.addEventListener("DOMContentLoaded", async () => {



    const layoutContainer = document.getElementById("layout");

    const response = await fetch("../Vistas/layout.html");
    const layoutHTML = await response.text();

    layoutContainer.innerHTML = layoutHTML;

    // esperar a que el DOM interno del layout exista
    requestAnimationFrame(() => {

        // 2. mover contenido (solo si existe estructura)
        const content = document.getElementById("page-content");
        const appContent = document.getElementById("app-content");

        if (content && appContent) {
            appContent.appendChild(content);
            content.style.display = "block";
        }

        // 3. activar ruta
        const current = getRuta();

        const links = document.querySelectorAll(".nav-link");

        links.forEach(link => {
            const page = link.dataset.page;

            if (page === current) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

    });

    const rolUsuario = "ADMIN"; // esto no se puede dejar estatico

    const adminBtn = document.getElementById("admin-panel-btn");

    if (adminBtn) {
        if (rolUsuario === "ADMIN") {
            adminBtn.style.display = "inline-block";
        } else {
            adminBtn.style.display = "none";
        }
    }

});

