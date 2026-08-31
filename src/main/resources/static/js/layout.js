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

window.usuarioActual = null;

document.addEventListener("DOMContentLoaded", async () => {

    const layoutContainer = document.getElementById("layout");
    const rutaActual = getRuta();

    // ─── 1. CARGAR LAYOUT HTML ───────────────────────────────────────
    try {
        const response = await fetch("/Vistas/layout.html");
        const layoutHTML = await response.text();
        layoutContainer.innerHTML = layoutHTML;

        const content = document.getElementById("page-content");
        const appContent = document.getElementById("app-content");

        if (content && appContent) {
            appContent.appendChild(content);
        }
        if (content) content.style.display = "block";

        // Marcar nav-link activo
        document.querySelectorAll(".nav-link").forEach(link => {
            if (link.dataset.page === rutaActual) {
                link.classList.add("active");
            }
        });

    } catch (e) {
        console.error("Error cargando layout:", e);
        return;
    }

    // ─── 2. COMPROBAR SESIÓN ─────────────────────────────────────────
    const paginasPublicas = ["login", "registro"];

    if (paginasPublicas.includes(rutaActual)) return;

    try {
        const res = await fetch("/api/usuarios/me", {
            credentials: "include"
        });

        if (!res.ok) {
            // No hay sesión → mandamos al login
            window.location.href = "../Vistas/login.html";
            return;
        }

        const usuario = await res.json();
        window.usuarioActual = usuario;

        // ─── 3. PINTAR DATOS EN EL NAVBAR ────────────────────────────
        const nombreNav = document.getElementById("navbar-nombre");
        if (nombreNav) nombreNav.textContent = usuario.nombre;


        const verPerfil = document.getElementById("navbar-ver-perfil");
        if (verPerfil) verPerfil.href = `/Vistas/perfil.html?id=${usuario.id}`;

        document.querySelectorAll("a[data-page='perfil']").forEach(link => {
            link.href = `/Vistas/Perfil.html?id=${usuario.id}`;
        });

        // Botón cerrar sesión
        const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener("click", async (e) => {
                e.preventDefault();
                await fetch("/api/usuarios/logout", {
                    method: "POST",
                    credentials: "include"
                });
                localStorage.removeItem("usuario");
                window.location.href = "../Vistas/login.html";
            });
        }

        // Mostrar botón admin solo si tiene el rol
        const adminBtn = document.getElementById("admin-panel-btn");
        if (adminBtn) {
            adminBtn.style.display = usuario.rol === "ADMIN" ? "inline-block" : "none";
        }

        // ─── 4. AVISAR AL JS DE LA VISTA QUE EL USUARIO YA ESTÁ LISTO ─
        document.dispatchEvent(new CustomEvent("usuarioListo", {
            detail: usuario
        }));

        // ─── 5. BUSCADOR DEL NAVBAR ──────────────────────────────────────
        const formBusqueda = document.getElementById("form-busqueda");
        const inputBusqueda = document.getElementById("input-busqueda");

        if (formBusqueda && inputBusqueda) {
            formBusqueda.addEventListener("submit", async (e) => {
                e.preventDefault();

                const query = inputBusqueda.value.trim();
                if (!query) return;

                try {
                    const res = await fetch(
                        `/api/libros/buscarInteligente?titulo=${encodeURIComponent(query)}`,
                        { credentials: "include" }
                    );

                    if (!res.ok) throw new Error("Error en la búsqueda");

                    const libros = await res.json();

                    if (libros.length === 0) {
                        inputBusqueda.classList.add("is-invalid");
                        inputBusqueda.placeholder = "Sin resultados para: " + query;
                        inputBusqueda.value = "";
                        setTimeout(() => {
                            inputBusqueda.classList.remove("is-invalid");
                            inputBusqueda.placeholder = "Buscar libros...";
                        }, 2500);
                        return;
                    }

                    // Redirigir al libro más relevante (primero de la lista)
                    window.location.href = `../Vistas/Libro.html?id=${libros[0].id}\`;`;

                } catch (err) {
                    console.error("Error en búsqueda:", err);
                }
            });
        }

    } catch (e) {
        console.error("Error comprobando sesión:", e);
        window.location.href = "../Vistas/login.html";
    }
});