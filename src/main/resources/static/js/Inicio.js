document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       TOGGLE MENÚS
       ========================= */
    document.querySelectorAll(".filter-menu").forEach(menu => {
        const toggle = menu.querySelector(".toggle-filter-menu");
        const form = menu.querySelector(".filter-form");
        if (toggle && form) {
            toggle.addEventListener("click", () => {
                document.querySelectorAll(".filter-form").forEach(f => {
                    if (f !== form) f.classList.remove("active");
                });
                form.classList.toggle("active");
            });
        }
    });

    /* =========================
       CARGAR LIBROS
       ========================= */
    cargarLibros("/api/libros");

    function cargarLibros(url) {
        fetch(url, { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(libros => pintarLibros(libros))
            .catch(err => {
                console.error(err);
                // Añade esto:
                document.getElementById("libros-container").innerHTML =
                    `<p class='text-danger'>Error al cargar libros: ${err.message}</p>`;
            });
    }

    function cargarCarpetasEnDropdown(menu, libroId) {
        fetch("/api/carpetas/mias", { credentials: "include" })
            .then(res => res.json())
            .then(carpetas => {
                if (!carpetas || carpetas.length === 0) {
                    menu.innerHTML = `<li><span class="dropdown-item text-muted">No tienes carpetas</span></li>`;
                    return;
                }
                menu.innerHTML = carpetas.map(c => `
                <li>
                    <button class="dropdown-item" onclick="guardarEnCarpeta(${c.id}, ${libroId}, this)">
                        <i class="bi bi-folder me-2"></i>${c.nombre}
                    </button>
                </li>
            `).join("");
            })
            .catch(() => {
                menu.innerHTML = `<li><span class="dropdown-item text-danger">Error al cargar carpetas</span></li>`;
            });
    }

    window.guardarEnCarpeta = function(carpetaId, libroId, btn) {
        fetch(`/api/carpetas/${carpetaId}/libros/${libroId}`, {
            method: "POST",
            credentials: "include"
        })
            .then(res => {
                if (res.status === 409) {
                    return res.text().then(msg => alert(msg));
                }
                if (!res.ok) throw new Error();
                btn.innerHTML = `<i class="bi bi-check2 me-2"></i>${btn.textContent.trim()} ✓`;
                btn.disabled = true;
            })
            .catch(() => {
                btn.textContent = "Error al guardar";
            });
    };

    function pintarLibros(libros) {
        const container = document.getElementById("libros-container");
        container.innerHTML = "";

        if (!libros || libros.length === 0) {
            container.innerHTML = "<p class='text-muted'>No se encontraron libros</p>";
            return;
        }

        libros.forEach(libro => {
            const card = document.createElement("div");
            card.className = "book-card";

            const estrellas = libro.mediaResenas > 0
                ? `<i class="bi bi-star-fill"></i> ${libro.mediaResenas}`
                : `<i class="bi bi-star"></i> Sin reseñas`;

            card.innerHTML = `
                <img src="${libro.portada ? '/img/' + libro.portada : '/img/portada-default.jpg'}" class="book-img" alt="Portada de ${libro.titulo}">
                <div class="book-info">
                    <div class="book-header">
                        <h5 class="book-title">${libro.titulo}</h5>
                        <span class="book-author">${libro.autor}</span>
                    </div>
                    <p class="book-description">${libro.sinopis}</p>
                    <div class="book-footer">
                        <span class="book-rating">${estrellas}</span>
                        <div class="book-actions">
                             <a class="btn btn-view" href="/Vistas/Libro.html?id=${libro.id}">Ver</a>
                             <div class="dropdown d-inline-block">
                                <button class="btn btn-save dropdown-toggle" type="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-bookmark-plus"></i> Guardar
                                </button>
                            <ul class="dropdown-menu dropdown-carpetas" data-libro-id="${libro.id}">
                                <li><span class="dropdown-item text-muted">Cargando...</span></li>
                            </ul>
                        </div>
                    </div>
                    </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        document.querySelectorAll(".dropdown-carpetas").forEach(menu => {
            menu.closest(".dropdown").addEventListener("show.bs.dropdown", () => {
                cargarCarpetasEnDropdown(menu, menu.dataset.libroId);
            });
        });
    }

    /* =========================
       FILTROS
       ========================= */
    window.getFilters = function () {
        const tagValues = ["friendship","fluff","enemies_to_lovers","violence",
            "family","drama","cozy","slow_burn","humor",
            "hurt_comfort","happy_ending","supernatural"];

        const generos = [...document.querySelectorAll(".filter-menu-check-boxes input[type=checkbox]:checked")]
            .map(cb => cb.value)
            .filter(v => !tagValues.includes(v));

        const tags = [...document.querySelectorAll(".filter-menu-check-boxes input[type=checkbox]:checked")]
            .map(cb => cb.value)
            .filter(v => tagValues.includes(v));

        const ratingMin  = document.getElementById("rating")?.value     || null;
        const paginasMin = document.getElementById("words_from")?.value || null;
        const paginasMax = document.getElementById("words_to")?.value   || null;
        const orden      = document.querySelector("input[name=sort]:checked")?.value || null;

        const params = new URLSearchParams();
        generos.forEach(g => params.append("generos", g));
        tags.forEach(t => params.append("tags", t));
        if (ratingMin)  params.append("ratingMin",  ratingMin);
        if (paginasMin) params.append("paginasMin", paginasMin);
        if (paginasMax) params.append("paginasMax", paginasMax);
        if (orden)      params.append("orden",      orden);

        cargarLibros(`/api/libros/filtrar?${params.toString()}`);

        document.querySelectorAll(".filter-form").forEach(f => f.classList.remove("active"));
    };

    window.applySort = function () {
        getFilters();
    };

    window.resetSort = function () {
        document.querySelectorAll("input[name=sort]").forEach(r => r.checked = false);
        cargarLibros("/api/libros");
    };
});