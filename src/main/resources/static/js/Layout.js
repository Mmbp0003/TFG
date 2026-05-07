const Rutas = {
    "inicio.html": "inicio",
    "perfil.html": "perfil",
    "login.html": "login",
    "biblioteca.html": "biblioteca",
    "buscador.html": "buscador",
    "recomendaciones.html": "recomendaciones"
};

function getRuta() {
    return Rutas[window.location.pathname.split("/").pop().toLowerCase()] || "";
}

document.addEventListener("DOMContentLoaded", async () => {

    const layoutContainer = document.getElementById("layout");

    try {
        const response = await fetch("/Vistas/layout.html");
        const layoutHTML = await response.text();

        layoutContainer.innerHTML = layoutHTML;

        const content = document.getElementById("page-content");
        const appContent = document.getElementById("app-content");

        if (content && appContent) {
            appContent.appendChild(content);
            content.style.display = "block";
        } else {
            content.style.display = "block";
        }

        const current = getRuta();

        document.querySelectorAll(".nav-link").forEach(link => {
            if (link.dataset.page === current) {
                link.classList.add("active");
            }
        });

        const adminBtn = document.getElementById("admin-panel-btn");
        if (adminBtn) adminBtn.style.display = "inline-block";

    } catch (e) {
        console.error("Error layout:", e);
    }
});