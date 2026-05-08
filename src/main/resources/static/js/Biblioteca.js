document.addEventListener("DOMContentLoaded", () => {

    let todasLasCarpetas = [];
    let currentReadingIndex = 0;

    // ─── CARGAR DATOS DE LA API ───────────────────────────────
    fetch("/api/carpetas/mias", { credentials: "include" })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(carpetas => {
            todasLasCarpetas = carpetas;

            const leyendo = carpetas.find(c => c.tipo === "LEYENDO");
            const resto   = carpetas.filter(c => c.tipo !== "LEYENDO");

            if (leyendo && leyendo.libros.length > 0) {
                renderReadingCarousel(leyendo.libros);
            } else {
                document.getElementById("readingSection").innerHTML =
                    "<p class='text-muted'>No tienes libros en lectura actualmente.</p>";
            }

            renderCarpetas(resto);
        })
        .catch(err => {
            console.error(err);
            document.getElementById("readingSection").innerHTML =
                `<p class='text-danger'>Error al cargar: ${err.message}</p>`;
        });

    // ─── CARRUSEL "LEYENDO" ───────────────────────────────────
    function renderReadingCarousel(libros) {
        currentReadingIndex = 0;

        function render() {
            const libro = libros[currentReadingIndex];
            const container = document.getElementById("readingCarouselContainer");

            container.innerHTML = `
                <div class="reading-card">
                    <img src="/img/${libro.portada || 'portada_default.jpg'}" class="reading-img">
                    <div class="reading-info">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h2>${libro.titulo}</h2>
                                <p class="text-secondary">${libro.autor}</p>
                            </div>
                            <a href="/Vistas/Libro.html?id=${libro.id}" class="btn btn-sm btn-outline-dark">
                                Ver detalles <i class="bi bi-box-arrow-up-right ms-1"></i>
                            </a>
                        </div>
                        <div class="mb-3">
                            <span class="book-rating">
                                <i class="bi bi-star-fill"></i> 
                                ${libro.mediaResenas > 0 ? libro.mediaResenas : "Sin reseñas"}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }

        render();

        document.getElementById("prevReading").onclick = () => {
            currentReadingIndex = currentReadingIndex === 0
                ? libros.length - 1 : currentReadingIndex - 1;
            render();
        };

        document.getElementById("nextReading").onclick = () => {
            currentReadingIndex = currentReadingIndex === libros.length - 1
                ? 0 : currentReadingIndex + 1;
            render();
        };
    }

    // ─── LISTA DE CARPETAS ────────────────────────────────────
    const container    = document.getElementById("listasContainer");
    const sectionTitle = document.querySelector(".section-title:last-of-type");

    function renderCarpetas(carpetas) {
        container.innerHTML = "";

        if (carpetas.length === 0) {
            container.innerHTML = "<p class='text-muted'>No tienes listas creadas.</p>";
            return;
        }

        carpetas.forEach(carpeta => {
            const card = document.createElement("div");
            card.className = "lista-card";

            const miniaturas = carpeta.libros
                .slice(0, 3)
                .map(l => `<img src="/img/${l.portada || 'portada_default.jpg'}" 
                                style="width:50px;height:75px;border-radius:6px;object-fit:cover;">`)
                .join("");

            card.innerHTML = `
                <div class="lista-header">
                    <span class="lista-title">${carpeta.nombre}</span>
                    <button class="btn-ver-lista" data-id="${carpeta.id}">Ver lista</button>
                </div>
                <div style="display:flex; gap:8px;">
                    ${miniaturas || "<p class='text-muted small'>Sin libros</p>"}
                </div>
            `;
            container.appendChild(card);
        });

        attachCarpetaEvents(carpetas);
    }

    function renderLibrosDeCarpeta(carpeta) {
        container.innerHTML = "";

        const header = document.createElement("div");
        header.innerHTML = `
            <button class="btn btn-sm btn-outline-dark mb-4" id="backBtn">
                <i class="bi bi-arrow-left"></i> Volver a mis listas
            </button>
        `;
        container.appendChild(header);

        if (carpeta.libros.length === 0) {
            container.innerHTML += "<p class='text-muted'>Esta lista está vacía.</p>";
        }

        carpeta.libros.forEach(libro => {
            const card = document.createElement("div");
            card.className = "carpeta-book";

            card.innerHTML = `
                <img src="/img/${libro.portada || 'portada_default.jpg'}" class="carpeta-img">
                <div class="carpeta-info" style="flex-grow:1;">
                    <h4>${libro.titulo}</h4>
                    <p>${libro.autor}</p>
                    <small><i class="bi bi-star-fill"></i> 
                        ${libro.mediaResenas > 0 ? libro.mediaResenas : "Sin reseñas"}
                    </small>
                </div>
                <div class="carpeta-action">
                    <a href="/Vistas/Libro.html?id=${libro.id}" class="btn btn-sm btn-outline-dark">
                        Ver libro
                    </a>
                </div>
            `;
            container.appendChild(card);
        });

        document.getElementById("backBtn").addEventListener("click", () => {
            const resto = todasLasCarpetas.filter(c => c.tipo !== "LEYENDO");
            renderCarpetas(resto);
        });
    }

    function attachCarpetaEvents(carpetas) {
        document.querySelectorAll(".btn-ver-lista").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id);
                const carpeta = carpetas.find(c => c.id === id);
                renderLibrosDeCarpeta(carpeta);
            });
        });
    }
});