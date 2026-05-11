document.addEventListener("DOMContentLoaded", () => {

    let todasLasCarpetas = [];
    let currentReadingIndex = 0;

    fetch("/api/carpetas/mias", {credentials: "include"})
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(carpetas => {
            todasLasCarpetas = carpetas;

            const leyendo = carpetas.find(c => c.tipo === "LEYENDO");
            const resto = carpetas.filter(c => c.tipo !== "LEYENDO");

            if (leyendo && leyendo.libros.length > 0) {
                renderReadingCarousel(leyendo.libros);
            } else {
                document.getElementById("readingSection").innerHTML =
                    "<p class='text-muted'>No tienes libros en lectura actualmente.</p>";
            }

            renderCarpetas(resto);
            attachCarpetaEvents();

        })
        .catch(err => {
            console.error(err);
            document.getElementById("readingSection").innerHTML =
                `<p class='text-danger'>Error al cargar: ${err.message}</p>`;
        });

    function renderReadingCarousel(libros) {
        currentReadingIndex = 0;

        const carpetaLeyendo = todasLasCarpetas.find(c => c.tipo === "LEYENDO");

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
            if (libros.length === 0) {
                document.getElementById("readingSection").innerHTML =
                    "<p class='text-muted'>No tienes libros en lectura actualmente.</p>";
                return;
            }

            if (currentReadingIndex >= libros.length) {
                currentReadingIndex = libros.length - 1;
            }

            const libro = libros[currentReadingIndex];
            const container = document.getElementById("readingCarouselContainer");

            const otrasCarpetas = todasLasCarpetas.filter(c => c.tipo !== "LEYENDO");
            const dropdownOpciones = otrasCarpetas.length > 0
                ? otrasCarpetas.map(c => `
                <li>
                    <button class="dropdown-item" data-carpeta-destino="${c.id}" data-libro-id="${libro.id}">
                        <i class="bi bi-folder me-2"></i>${c.nombre}
                    </button>
                </li>`).join("")
                : `<li><span class="dropdown-item text-muted small">No hay otras listas</span></li>`;

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
                    <div class="d-flex gap-2 align-items-center flex-wrap mt-3">
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle"
                            data-bs-toggle="dropdown">
                            <i class="bi bi-folder-symlink"></i> Mover a
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            ${dropdownOpciones}
                        </ul>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" id="btn-quitar-leyendo">
                        <i class="bi bi-trash"></i> Quitar
                    </button>
                </div>
                    
                </div>
            </div>
        `;

            // ── Quitar de LEYENDO ─────────────────────────────────────────
            document.getElementById("btn-quitar-leyendo").addEventListener("click", () => {
                fetch(`/api/carpetas/${carpetaLeyendo.id}/libros/${libro.id}`, {
                    method: "DELETE",
                    credentials: "include"
                }).then(res => {
                    if (res.ok) {
                        libros.splice(currentReadingIndex, 1);
                        render();
                    } else {
                        alert("Error al quitar el libro.");
                    }
                }).catch(() => alert("Error de conexión."));
            });

            // ── Mover a otra carpeta ──────────────────────────────────────
            container.querySelectorAll("[data-carpeta-destino]").forEach(btn => {
                btn.addEventListener("click", () => {
                    const carpetaDestinoId = btn.dataset.carpetaDestino;
                    const libroId = btn.dataset.libroId;

                    fetch(`/api/carpetas/${carpetaDestinoId}/libros/${libroId}`, {
                        method: "POST",
                        credentials: "include"
                    }).then(res => {
                        if (!res.ok) throw new Error("Error al añadir a la lista destino.");
                        return fetch(`/api/carpetas/${carpetaLeyendo.id}/libros/${libroId}`, {
                            method: "DELETE",
                            credentials: "include"
                        });
                    }).then(res => {
                        if (res.ok) {
                            const destino = todasLasCarpetas.find(c => c.id == carpetaDestinoId);
                            if (destino) destino.libros.push(libro);
                            libros.splice(currentReadingIndex, 1);
                            render();
                        } else {
                            alert("Error al quitar el libro de lectura.");
                        }
                    }).catch(err => alert(err.message || "Error de conexión."));
                });
            });

            // ── Progreso ──────────────────────────────────────────────────
            fetch(`/api/actividades/progreso/${libro.id}`, {credentials: "include"})
                .then(res => res.ok ? res.json() : null)
                .then(progreso => {
                    const porcentaje = progreso ? Math.round(progreso.valor) : 0;
                    const isFinished = porcentaje >= 100;
                    const area = document.getElementById("progreso-area");

                    if (isFinished) {
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
                            const contenido = document.getElementById("resena-texto").value.trim();

                            if (!contenido) {
                                alert("Escribe algo en la reseña antes de publicar.");
                                return;
                            }

                            fetch("/api/resenas", {
                                method: "POST",
                                credentials: "include",
                                headers: {"Content-Type": "application/json"},
                                body: JSON.stringify({libroId: libro.id, puntuacion, contenido})
                            }).then(res => {
                                if (res.ok) alert("¡Reseña publicada!");
                                else alert("Error al publicar la reseña.");
                            });
                        });

                    } else {
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
                                fetch("/api/actividades/progreso", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {"Content-Type": "application/json"},
                                    body: JSON.stringify({
                                        libroId: libro.id,
                                        titulo: libro.titulo,
                                        progreso: nuevoProgreso
                                    })
                                }).then(res => {
                                    if (res.ok) render();
                                    else alert("Error al guardar el avance.");
                                }).catch(() => alert("Error de conexión."));

                            } else {
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
                                            headers: {"Content-Type": "application/json"},
                                            body: JSON.stringify({
                                                libroId: libro.id,
                                                titulo: libro.titulo,
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

    const container = document.getElementById("listasContainer");
    const sectionTitle = document.querySelector(".section-title:last-of-type");

    function renderCarpetas(carpetas) {
        container.innerHTML = "";

        if (carpetas.length === 0) {
            container.innerHTML = "<p class='text-muted'>No tienes listas creadas.</p>";
        } else {
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
                        <div class="d-flex gap-2">
                            ${!carpeta.fijas ? `
                            <button class="btn-borrar-lista" data-id="${carpeta.id}" title="Eliminar lista">
                                <i class="bi bi-trash"></i>
                            </button>` : ''}
                            <button class="btn-ver-lista" data-id="${carpeta.id}">Ver lista</button>
                        </div>
                    </div>
                    <div style="display:flex; gap:8px;">
                        ${miniaturas || "<p class='text-muted small'>Sin libros</p>"}
                    </div>
                `;
                container.appendChild(card);
            });


        }

        const btnWrapper = document.createElement("div");
        btnWrapper.className = "d-flex justify-content-end mt-4";
        btnWrapper.innerHTML = `
        <button class="btn btn-outline-dark btn-sm" id="btnAbrirModalCarpeta">
            <i class="bi bi-folder-plus me-1"></i>Nueva lista
        </button>
        `;
        container.appendChild(btnWrapper);

        document.getElementById("btnAbrirModalCarpeta").addEventListener("click", () => {
            document.getElementById("inputNombreCarpeta").value = "";
            document.getElementById("errorNombreCarpeta").style.display = "none";
            new bootstrap.Modal(document.getElementById("modalCrearCarpeta")).show();
        });
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

            // Otras carpetas disponibles para mover (excluimos la actual y las de tipo LEYENDO)
            const otrasCarpetas = todasLasCarpetas.filter(c => c.id !== carpeta.id);
            console.log("otrasCarpetas:", otrasCarpetas.map(c => c.nombre));
            const dropdownOpciones = otrasCarpetas.length > 0
                ? otrasCarpetas.map(c => `
                <li>
                    <button class="dropdown-item" data-carpeta-destino="${c.id}" data-libro-id="${libro.id}">
                        <i class="bi bi-folder me-2"></i>${c.nombre}
                    </button>
                </li>
              `).join("")
                : `<li><span class="dropdown-item text-muted small">No hay otras listas</span></li>`;

            card.innerHTML = `
            <img src="/img/${libro.portada || 'portada_default.jpg'}" class="carpeta-img">
            <div class="carpeta-info" style="flex-grow:1;">
                <h4>${libro.titulo}</h4>
                <p>${libro.autor}</p>
                <small><i class="bi bi-star-fill"></i>
                    ${libro.mediaResenas > 0 ? libro.mediaResenas : "Sin reseñas"}
                </small>
            </div>
            <div class="carpeta-action d-flex gap-2 align-items-center">
                <a href="/Vistas/Libro.html?id=${libro.id}" class="btn btn-sm btn-outline-dark">
                    Ver libro
                </a>
                <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                            data-bs-toggle="dropdown">
                        <i class="bi bi-folder-symlink"></i> Añadir a
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        ${dropdownOpciones}
                    </ul>
                </div>
                <button class="btn btn-sm btn-outline-danger btn-eliminar-libro"
                        data-carpeta-id="${carpeta.id}" data-libro-id="${libro.id}">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </div>
        `;

            container.appendChild(card);
        });

        // Evento eliminar
        container.querySelectorAll(".btn-eliminar-libro").forEach(btn => {
            btn.addEventListener("click", () => {
                const carpetaId = btn.dataset.carpetaId;
                const libroId = btn.dataset.libroId;
                fetch(`/api/carpetas/${carpetaId}/libros/${libroId}`, {
                    method: "DELETE",
                    credentials: "include"
                }).then(res => {
                    if (res.ok) btn.closest(".carpeta-book").remove();
                    else alert("Error al eliminar el libro.");
                });
            });
        });

        // Evento mover a otra carpeta
        container.querySelectorAll("[data-carpeta-destino]").forEach(btn => {
            btn.addEventListener("click", () => {
                const carpetaDestinoId = btn.dataset.carpetaDestino;
                const libroId = btn.dataset.libroId;
                fetch(`/api/carpetas/${carpetaDestinoId}/libros/${libroId}`, {
                    method: "POST",
                    credentials: "include"
                }).then(res => {
                    if (res.ok) {
                        btn.innerHTML = `<i class="bi bi-check2 me-2"></i>${btn.textContent.trim()} ✓`;
                        btn.disabled = true;
                    } else {
                        alert("Error al añadir a la lista.");
                    }
                });
            });
        });

        document.getElementById("backBtn").addEventListener("click", () => {
            document.getElementById("readingSection").style.display = "block";
            const resto = todasLasCarpetas.filter(c => c.tipo !== "LEYENDO");
            renderCarpetas(resto);
        });
    }

    function attachCarpetaEvents(carpetas) {
        // Un solo listener delegado en el contenedor padre
        container.addEventListener("click", function handler(e) {

            // — Ver lista —
            const btnVer = e.target.closest(".btn-ver-lista");
            if (btnVer) {
                const id = parseInt(btnVer.dataset.id);
                const carpeta = todasLasCarpetas.find(c => c.id === id);
                if (carpeta) renderLibrosDeCarpeta(carpeta);
                return;
            }

            // — Borrar lista —
            const btnBorrar = e.target.closest(".btn-borrar-lista");
            if (btnBorrar) {
                const id = parseInt(btnBorrar.dataset.id);
                const carpeta = todasLasCarpetas.find(c => c.id === id);
                if (!carpeta) return;

                if (!confirm(`¿Eliminar la lista "${carpeta.nombre}" y todos sus libros?`)) return;

                fetch(`/api/carpetas/${id}`, {
                    method: "DELETE",
                    credentials: "include"
                }).then(res => {
                    if (res.ok) {
                        todasLasCarpetas = todasLasCarpetas.filter(c => c.id !== id);
                        const resto = todasLasCarpetas.filter(c => c.tipo !== "LEYENDO");
                        renderCarpetas(resto);
                    } else {
                        return res.text().then(msg => alert("Error: " + msg));
                    }
                }).catch(() => alert("Error de conexión."));
                return;
            }
        });
    }

    document.getElementById("btnConfirmarCarpeta").addEventListener("click", () => {
        const input = document.getElementById("inputNombreCarpeta");
        const error = document.getElementById("errorNombreCarpeta");
        const nombre = input.value.trim();

        if (!nombre) {
            error.textContent = "El nombre no puede estar vacío.";
            error.style.display = "block";
            return;
        }
        error.style.display = "none";

        fetch("/api/carpetas", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre })
        })
            .then(res => {
                if (res.status === 409) {
                    return res.text().then(msg => {
                        error.textContent = msg; // "Ya tienes una lista con ese nombre"
                        error.style.display = "block";
                        return null; // señal para no continuar
                    });
                }
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(nuevaCarpeta => {
                if (!nuevaCarpeta) return; // fue un 409, ya mostrado
                bootstrap.Modal.getInstance(
                    document.getElementById("modalCrearCarpeta")
                ).hide();
                nuevaCarpeta.libros = nuevaCarpeta.libros || [];
                todasLasCarpetas.push(nuevaCarpeta);
                const resto = todasLasCarpetas.filter(c => c.tipo !== "LEYENDO");
                renderCarpetas(resto);
            })
            .catch(err => alert("Error al crear la lista: " + err.message));
    });

});