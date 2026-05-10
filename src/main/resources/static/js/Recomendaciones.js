document.addEventListener("DOMContentLoaded", () => {

    let librosOriginal = [];
    const container = document.getElementById("recomendacionesContainer");

    // ─── CARGAR LIBROS DE LA API ──────────────────────────────
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
    function renderRecomendaciones(libros) {
        if (!container) return;

        if (libros.length === 0) {
            container.innerHTML = `<p class="text-secondary w-100 mt-3">No hay recomendaciones que coincidan con estos filtros.</p>`;
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
                    <button class="btn-recomendar" onclick="window.location.href='/Vistas/Libro.html?id=${libro.id}'">
                        Ver libro
                    </button>
                </div>
            </div>
        `).join('');
    }

    // ─── FILTROS Y ORDEN ──────────────────────────────────────
    window.aplicarFiltrosYOrden = () => {
        let librosFiltrados = [...librosOriginal];

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