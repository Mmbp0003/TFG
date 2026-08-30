document.addEventListener("DOMContentLoaded", () => {

    let librosOriginal = [];
    const container = document.getElementById("recomendacionesContainer");

    // ─── CARGAR LIBROS DE LA API ──────────────────────────────
    fetch("/api/libros/generos", { credentials: "include" })
        .then(res => res.json())
        .then(generos => {
            const cont = document.getElementById("generosContainer");
            cont.innerHTML = generos.map(g => `
            <label class="label-filter-option-item">
                <input type="checkbox" value="${g}" class="filtro-genero"
                       onchange="aplicarFiltrosYOrden()"> ${g}
            </label>
        `).join("");
        });

    fetch("/api/libros", { credentials: "include" })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(libros => {
            librosOriginal = libros;
            renderRecomendaciones(librosOriginal);
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = `<p class='text-danger'>Error al cargar libros: ${err.message}</p>`;
        });

    // ─── PINTAR LIBROS ────────────────────────────────────────

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

    function renderRecomendaciones(libros) {
        if (!container) return;

        if (libros.length === 0) {
            container.innerHTML = `<p class="text-secondary w-100 mt-3">No hay recomendaciones que coincidan.</p>`;
            return;
        }

        container.innerHTML = libros.map(libro => `
        <div class="recomendacion-card">
            <img src="${libro.portada ? '/img/' + libro.portada : '/img/portada-default.jpg'}"
                 class="recomendacion-img" alt="${libro.titulo}">
            <div class="recomendacion-info">
                <span class="recomendacion-tag">
                    ${libro.mediaResenas > 0 ? '⭐ ' + libro.mediaResenas : 'Sin reseñas'}
                </span>
                <h4 class="recomendacion-title">${libro.titulo}</h4>
                <p class="recomendacion-author">${libro.autor}</p>
                <div class="d-flex gap-2 mt-2">
                    <button class="btn-recomendar"
                            onclick="window.location.href='/Vistas/Libro.html?id=${libro.id}'">
                        Ver 
                    </button>
                    <div class="dropdown">
                        <button class="btn btn-outline-dark btn-sm dropdown-toggle"
                                data-bs-toggle="dropdown">
                            <i class="bi bi-bookmark-plus"></i> Guardar
                        </button>
                        <ul class="dropdown-menu dropdown-carpetas"
                            data-libro-id="${libro.id}">
                            <li><span class="dropdown-item text-muted">Cargando...</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

        // Re-enganche dropdowns tras renderizar
        document.querySelectorAll(".dropdown-carpetas").forEach(menu => {
            menu.closest(".dropdown").addEventListener("show.bs.dropdown", () => {
                cargarCarpetasEnDropdown(menu, menu.dataset.libroId);
            });
        });
    }

    // ─── FILTROS Y ORDEN ──────────────────────────────────────
    window.aplicarFiltrosYOrden = () => {
        let librosFiltrados = [...librosOriginal];

        // Filtrar por géneros seleccionados
        const generosSeleccionados = [...document.querySelectorAll(".filtro-genero:checked")]
            .map(cb => cb.value);
        if (generosSeleccionados.length > 0) {
            librosFiltrados = librosFiltrados.filter(libro =>
                libro.generos?.some(g => generosSeleccionados.includes(g))
            );
        }

        // Ordenar
        const orden = document.querySelector('input[name="sort"]:checked')?.value;
        if (orden) {
            librosFiltrados.sort((a, b) => {
                if (orden === 'title_asc')  return a.titulo.localeCompare(b.titulo);
                if (orden === 'title_desc') return b.titulo.localeCompare(a.titulo);
                if (orden === 'autor_asc')  return a.autor.localeCompare(b.autor);
                return 0;
            });
        }

        renderRecomendaciones(librosFiltrados);
    };

    window.resetFiltros = () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
        renderRecomendaciones(librosOriginal);
    };
});