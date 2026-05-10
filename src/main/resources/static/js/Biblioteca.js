document.addEventListener("DOMContentLoaded", () => {

    let todasLasCarpetas = [];
    let currentReadingIndex = 0;

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

    function renderReadingCarousel(libros) {
        currentReadingIndex = 0;

        function generateStarRating(rating) {
            let html = '<div class="star-rating">';
            for (let i = 1; i <= 5; i++) {
                let fill = 0;
                if (rating >= i) fill = 100;
                else if (rating > i - 1) fill = (rating - (i - 1)) * 100;
                html += `
                <div class="star-container" data-value="${i}">
                    <i class="bi bi-star-fill star-empty"></i>
                    <i class="bi bi-star-fill star-filled" style="width:${fill}%;"></i>
                </div>`;
            }
            html += '</div>';
            return html;
        }

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
                        <div id="progreso-area">
                            <p class="text-muted small">Cargando progreso...</p>
                        </div>
                    </div>
                </div>
            `;

            fetch(`/api/actividades/progreso/${libro.id}`, { credentials: "include" })
                .then(res => res.ok ? res.json() : null)
                .then(progreso => {
                    const porcentaje = progreso ? Math.round(progreso.valor) : 0;
                    const isFinished = porcentaje >= 100;
                    const area = document.getElementById("progreso-area");

                    if (isFinished) {
                        // ── RESEÑA FINAL ──────────────────────────────
                        area.innerHTML = `
                            <div class="mb-3">
                                <small>Progreso: 100% ✓ Libro terminado</small>
                                <div class="progress" style="height:8px;">
                                    <div class="progress-bar bg-danger" style="width:100%"></div>
                                </div>
                            </div>
                            <div class="final-review-area">
                                <h5>¡Libro Terminado!</h5>
                                <div class="mb-3 d-flex align-items-center gap-3">
                                    <label class="mb-0 fw-bold">Nota:</label>
                                    <input type="number" id="rating-final" class="form-control form-control-sm"
                                           min="0" max="5" step="0.1" style="width:75px;" value="0">
                                    <div id="stars-final">${generateStarRating(0)}</div>
                                </div>
                                <textarea id="resena-texto" class="form-control mb-2"
                                          placeholder="Escribe tu reseña final..."></textarea>
                                <button class="btn btn-dark w-100" id="btn-publicar-resena">
                                    Publicar Reseña
                                </button>
                            </div>
                        `;

                        document.getElementById("rating-final").addEventListener("input", e => {
                            let val = parseFloat(e.target.value);
                            if (isNaN(val) || val < 0) val = 0;
                            if (val > 5) val = 5;
                            document.getElementById("stars-final").innerHTML = generateStarRating(val);
                        });

                        document.getElementById("btn-publicar-resena").addEventListener("click", () => {
                            const puntuacion = parseFloat(document.getElementById("rating-final").value) || 0;
                            const contenido  = document.getElementById("resena-texto").value.trim();

                            if (!contenido) {
                                alert("Escribe algo en la reseña antes de publicar.");
                                return;
                            }

                            fetch("/api/resenas", {
                                method: "POST",
                                credentials: "include",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ libroId: libro.id, puntuacion, contenido })
                            }).then(res => {
                                if (res.ok) alert("¡Reseña publicada!");
                                else alert("Error al publicar la reseña.");
                            });
                        });

                    } else {
                        // ── ACTUALIZAR PROGRESO ───────────────────────
                        area.innerHTML = `
                            <div class="mb-3">
                                <small>Progreso: ${porcentaje}%</small>
                                <div class="progress" style="height:8px;">
                                    <div class="progress-bar bg-danger" style="width:${porcentaje}%"></div>
                                </div>
                            </div>
                            <div class="progress-update-area">
                                <h6>Actualizar progreso</h6>
                                <div class="d-flex align-items-center gap-2 mb-3">
                                    <label class="small fw-bold mb-0">%</label>
                                    <input type="number" id="nuevo-progreso" class="form-control form-control-sm"
                                           min="0" max="100" value="${porcentaje}" style="width:80px;">
                                    <label class="small fw-bold mb-0 ms-2">Nota:</label>
                                    <input type="number" id="rating-sesion" class="form-control form-control-sm"
                                           min="0" max="5" step="0.1" value="0" style="width:75px;">
                                    <div id="stars-update">${generateStarRating(0)}</div>
                                </div>
                                <div id="extra-area"></div>
                                <button class="btn btn-outline-dark btn-sm w-100 mt-2" id="btn-guardar-avance">
                                    Guardar Avance
                                </button>
                            </div>
                        `;

                        document.getElementById("rating-sesion").addEventListener("input", e => {
                            let val = parseFloat(e.target.value);
                            if (isNaN(val) || val < 0) val = 0;
                            if (val > 5) val = 5;
                            document.getElementById("stars-update").innerHTML = generateStarRating(val);
                        });

                        document.getElementById("btn-guardar-avance").addEventListener("click", () => {
                            const nuevoProgreso = parseInt(document.getElementById("nuevo-progreso").value) || 0;
                            const extraArea = document.getElementById("extra-area");

                            if (nuevoProgreso >= 100) {
                                // Guardar y saltar a reseña
                                fetch("/api/actividades/progreso", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        libroId:  libro.id,
                                        titulo:   libro.titulo,
                                        progreso: nuevoProgreso
                                    })
                                }).then(res => {
                                    if (res.ok) render();
                                    else alert("Error al guardar el avance.");
                                }).catch(() => alert("Error de conexión."));

                            } else {
                                // Mostrar textarea de comentario si no está ya
                                if (!document.getElementById("comentario-texto")) {
                                    extraArea.innerHTML = `
                                        <textarea id="comentario-texto" class="form-control mb-2 mt-2" rows="2"
                                                  placeholder="¿Qué te ha parecido este tramo?"></textarea>
                                        <button class="btn btn-dark btn-sm w-100" id="btn-enviar-avance">
                                            Enviar
                                        </button>
                                    `;

                                    document.getElementById("btn-enviar-avance").addEventListener("click", () => {
                                        fetch("/api/actividades/progreso", {
                                            method: "POST",
                                            credentials: "include",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                libroId:  libro.id,
                                                titulo:   libro.titulo,
                                                progreso: nuevoProgreso
                                            })
                                        }).then(res => {
                                            if (res.ok) {
                                                alert("¡Avance guardado!");
                                                render();
                                            } else {
                                                alert("Error al guardar el avance.");
                                            }
                                        }).catch(() => alert("Error de conexión."));
                                    });
                                }
                            }
                        });
                    }
                })
                .catch(() => {
                    document.getElementById("progreso-area").innerHTML =
                        "<p class='text-danger small'>Error cargando progreso.</p>";
                });
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
        document.getElementById("readingSection").style.display = "none";
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
            document.getElementById("readingSection").style.display = "block";
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