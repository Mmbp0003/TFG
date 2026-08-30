document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const libroId = params.get("id");

    if (!libroId) {
        document.getElementById("page-content").innerHTML = "<p class='text-danger'>No se especificó ningún libro.</p>";
        document.getElementById("page-content").style.display = "block";
        return;
    }

    // ─── CARGAR LIBRO ─────────────────────────────────────────
    fetch(`/api/libros/${libroId}`, { credentials: "include" })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(libro => pintarLibro(libro))
        .catch(err => {
            console.error(err);
            document.getElementById("page-content").innerHTML =
                `<p class='text-danger'>Error al cargar el libro: ${err.message}</p>`;
            document.getElementById("page-content").style.display = "block";
        });

    // ─── CARGAR RESEÑAS ───────────────────────────────────────
    fetch(`/api/resenas/libro/${libroId}`, { credentials: "include" })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(resenas => pintarResenas(resenas))
        .catch(err => console.error("Error cargando reseñas:", err));

    // ─── PINTAR LIBRO ─────────────────────────────────────────
    function pintarLibro(libro) {
        document.querySelector(".book-title").textContent  = libro.titulo;
        document.querySelector(".book-author").textContent = libro.autor;

        document.querySelector(".book-detail-img img").src =
            libro.portada ? `/img/${libro.portada}` : "/img/portada-default.jpg";
        document.querySelector(".book-detail-img img").alt = libro.titulo;

        document.querySelector(".book-meta").innerHTML = `
            <p><strong>Páginas:</strong> ${libro.paginas}</p>
            <p><strong>Publicación:</strong> ${libro.fechaPublicacion}</p>
            <p><strong>Sinopsis:</strong></p>
            <p class="book-sinopsis">${libro.sinopis}</p>
        `;

        document.getElementById("page-content").style.display = "block";
    }

    // ─── PINTAR RESEÑAS ───────────────────────────────────────
    function pintarResenas(resenas) {
        const container = document.querySelector(".reviews-section");

        // Actualizar rating box siempre, haya o no reseñas
        if (!resenas || resenas.length === 0) {
            document.querySelector(".book-rating-box").innerHTML = `
            <i class="bi bi-star-fill text-warning"></i>
            <span>—</span>
            <small>(Sin reseñas)</small>
        `;
            container.innerHTML = `
            <h4>Reseñas de la comunidad</h4>
            <p class='text-muted'>Aún no hay reseñas para este libro.</p>
        `;
            return;
        }

        const media = (resenas.reduce((sum, r) => sum + r.puntuacion, 0) / resenas.length).toFixed(1);
        document.querySelector(".book-rating-box").innerHTML = `
        <i class="bi bi-star-fill text-warning"></i>
        <span>${media}</span>
        <small>(${resenas.length} reseña${resenas.length !== 1 ? "s" : ""})</small>
    `;

        container.innerHTML = `<h4>Reseñas de la comunidad</h4>`;

        resenas.forEach(resena => {
            const fecha = new Date(resena.fechaCreacion).toLocaleDateString("es-ES", {
                day: "numeric", month: "short", year: "numeric"
            });

            const div = document.createElement("div");
            div.className = "review-card";
            div.innerHTML = `
                <div class="review-user">
                    <a href="/Vistas/Perfil.html?id=${resena.usuarioId}" class="user-profile-link">
                        <i class="bi bi-person-circle fs-4"></i>
                        <span class="user-name">${resena.nombreUsuario} ${resena.apellidosUsuario}</span>
                        <i class="bi bi-star-fill text-warning ms-2"></i>
                        <span>${resena.puntuacion}</span>
                    </a>
                    <small class="text-muted ms-2">${fecha}</small>
                </div>
                <p class="mt-2">${resena.contenido}</p>
            `;
            container.appendChild(div);
        });
    }

    const dropdownBtn = document.getElementById("btnGuardarLibro");
    const dropdownMenu = document.getElementById("dropdownCarpetasLibro");

    if (dropdownBtn) {
        dropdownBtn.addEventListener("show.bs.dropdown", () => {
            fetch("/api/carpetas/mias", { credentials: "include" })
                .then(res => res.json())
                .then(carpetas => {
                    if (!carpetas || carpetas.length === 0) {
                        dropdownMenu.innerHTML = `<li><span class="dropdown-item text-muted">No tienes carpetas</span></li>`;
                        return;
                    }
                    dropdownMenu.innerHTML = carpetas.map(c => `
                    <li>
                        <button class="dropdown-item" onclick="guardarLibroEnCarpeta(${c.id}, this)">
                            <i class="bi bi-folder me-2"></i>${c.nombre}
                        </button>
                    </li>
                `).join("");
                });
        });
    }

    window.guardarLibroEnCarpeta = function(carpetaId, btn) {
        fetch(`/api/carpetas/${carpetaId}/libros/${libroId}`, {
            method: "POST",
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error();
                btn.innerHTML = `<i class="bi bi-check2 me-2"></i>${btn.textContent.trim()} ✓`;
                btn.disabled = true;
            })
            .catch(() => btn.textContent = "Error al guardar");
    };
});