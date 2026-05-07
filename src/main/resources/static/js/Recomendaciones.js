document.addEventListener("DOMContentLoaded", () => {

    const librosRecomendadosOriginal = [
        { id: "r1", tag: "Tendencia", titulo: "Cuna de Gatos", autor: "Kurt Vonnegut", img: "https://m.media-amazon.com/images/I/91MsOKbHjVL.jpg" },
        { id: "r2", tag: "Fantasía", titulo: "El imperio final", autor: "Brandon Sanderson", img: "https://m.media-amazon.com/images/I/91MsOKbHjVL.jpg" },
        { id: "r3", tag: "Clásico", titulo: "Fahrenheit 451", autor: "Ray Bradbury", img: "https://m.media-amazon.com/images/I/91MsOKbHjVL.jpg" },
        { id: "r4", tag: "Tendencia", titulo: "Proyecto Hail Mary", autor: "Andy Weir", img: "https://m.media-amazon.com/images/I/91MsOKbHjVL.jpg" },
        { id: "r5", tag: "Fantasía", titulo: "El camino de los reyes", autor: "B. Sanderson", img: "https://m.media-amazon.com/images/I/91MsOKbHjVL.jpg" }
    ];

    const container = document.getElementById("recomendacionesContainer");

    // Función principal para pintar el array que le pasemos
    function renderRecomendaciones(libros) {
        if (!container) return;

        if (libros.length === 0) {
            container.innerHTML = `<p class="text-secondary w-100 mt-3">No hay recomendaciones que coincidan con estos filtros.</p>`;
            return;
        }

        container.innerHTML = libros.map(libro => `
            <div class="recomendacion-card">
                <img src="${libro.img}" class="recomendacion-img" alt="${libro.titulo}">
                <div class="recomendacion-info">
                    <span class="recomendacion-tag">${libro.tag}</span>
                    <h4 class="recomendacion-title">${libro.titulo}</h4>
                    <p class="recomendacion-author">${libro.autor}</p>
                    <button class="btn-recomendar" onclick="window.location.href='Libro.html?id=${libro.id}'">
                        Ver libro
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Funciones globales para que el HTML pueda llamarlas (los onchange="...")
    window.aplicarFiltrosYOrden = () => {
        let librosFiltrados = [...librosRecomendadosOriginal];

        // 1. FILTRAR POR TAGS (Checkboxes)
        const checkboxesMarcados = Array.from(document.querySelectorAll('.filtro-tag:checked')).map(cb => cb.value);
        if (checkboxesMarcados.length > 0) {
            librosFiltrados = librosFiltrados.filter(libro => checkboxesMarcados.includes(libro.tag));
        }

        // 2. ORDENAR (Radio buttons)
        const ordenSeleccionado = document.querySelector('input[name="sort"]:checked')?.value;
        if (ordenSeleccionado) {
            librosFiltrados.sort((a, b) => {
                if (ordenSeleccionado === 'title_asc') return a.titulo.localeCompare(b.titulo);
                if (ordenSeleccionado === 'title_desc') return b.titulo.localeCompare(a.titulo);
                if (ordenSeleccionado === 'autor_asc') return a.autor.localeCompare(b.autor);
                return 0;
            });
        }

        // 3. Pintar el resultado
        renderRecomendaciones(librosFiltrados);
    };

    window.resetFiltros = () => {
        // Desmarcar todo
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
        // Volver a pintar el original
        renderRecomendaciones(librosRecomendadosOriginal);
    };

    // Pintar inicialmente todo el catálogo
    renderRecomendaciones(librosRecomendadosOriginal);
});