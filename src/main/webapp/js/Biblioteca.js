document.addEventListener("DOMContentLoaded", () => {
    // Tus datos
    const listas = [
        {
            id: "favoritos",
            nombre: "Favoritos",
            libros: [
                { titulo: "El nombre del viento", autor: "Patrick Rothfuss", rating: 4.5, img: "https://m.media-amazon.com/images/I/91MsOKbHjVL.jpg" },
                { titulo: "1984", autor: "George Orwell", rating: 4.7, img: "https://m.media-amazon.com/images/I/81YOuOGFCJL.jpg" }
            ]
        },
        {
            id: "quiero_leer",
            nombre: "Quiero leer",
            libros: [
                { titulo: "Dune", autor: "Frank Herbert", rating: 4.6, img: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg" }
            ]
        }
    ];

    const container = document.getElementById("listasContainer");
    const sectionTitle = document.querySelector(".section-title"); // Para cambiar el título "Mis listas"

    // VISTA 1: Dibuja las carpetas
    function renderCarpetas() {
        container.innerHTML = "";
        sectionTitle.textContent = "Libros que estoy leyendo "; // Restaurar título original

        listas.forEach(lista => {
            const card = document.createElement("div");
            card.className = "lista-card";

            const miniaturas = lista.libros
                .slice(0, 3)
                .map(l => `<img src="${l.img}" style="width:50px;height:75px;border-radius:6px;object-fit:cover;">`)
                .join("");

            card.innerHTML = `
                <div class="lista-header">
                    <span class="lista-title">${lista.nombre}</span>
                    <button class="btn-ver-lista" data-id="${lista.id}">Ver lista</button>
                </div>
                <div style="display:flex; gap:8px;">
                    ${miniaturas}
                </div>
            `;
            container.appendChild(card);
        });

        attachEvents();
    }

    // VISTA 2: Dibuja los libros de una carpeta
    function renderLibros(lista) {
        container.innerHTML = "";
        sectionTitle.textContent = lista.nombre; // Cambiamos el título general

        // Botón para volver atrás
        const header = document.createElement("div");
        header.innerHTML = `
            <button class="btn btn-sm btn-outline-dark mb-4" id="backBtn">
                <i class="bi bi-arrow-left"></i> Volver a mis listas
            </button>
        `;
        container.appendChild(header);

        // Listamos los libros
        lista.libros.forEach((libro, index) => {

            const card = document.createElement("div");
            card.className = "carpeta-book";

            // 🔥 Añadimos flex-grow: 1 a la carpeta-info y el botón al final
            card.innerHTML = `
                <img src="${libro.img}" class="carpeta-img">

                <div class="carpeta-info" style="flex-grow: 1;">
                    <h4>${libro.titulo}</h4>
                    <p>${libro.autor}</p>
                    <small> ${libro.rating}</small>
                </div>
                
                <div class="carpeta-action">
                    <a href="Libro.html?id=${index}" class="btn btn-sm btn-outline-dark">
                        Ver libro
                    </a>
                </div>
            `;

            container.appendChild(card);
        });

        // Evento para volver
        document.getElementById("backBtn").addEventListener("click", renderCarpetas);
    }

    // Poner eventos a los botones
    function attachEvents() {
        document.querySelectorAll(".btn-ver-lista").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const lista = listas.find(l => l.id === id);
                renderLibros(lista);
            });
        });
    }

    // Iniciar la vista
    renderCarpetas();
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. Datos dinámicos (esto vendría de tu base de datos o estado global)
    const leyendoActualmente = [
        {
            id: "1",
            titulo: "El imperio final",
            autor: "Brandon Sanderson",
            img: "https://m.media-amazon.com/images/I/91MsOKbHjVL.jpg",
            paginasTotales: 672,
            paginaActual: 150,
            ratingSesion: 0 // Estrellas para la actualización actual
        },
        {
            id: "2",
            titulo: "Cien años de soledad",
            autor: "Gabriel García Márquez",
            img: "https://m.media-amazon.com/images/I/91MsOKbHjVL.jpg",
            paginasTotales: 496,
            paginaActual: 496,
            ratingFinal: 5 // Estrellas para la reseña final
        }
    ];

    let currentReadingIndex = 0;

    // Función auxiliar para generar el HTML de estrellas
    function generateStarRating(rating, isInteractive = false, prefix = "") {
        let starsHTML = '<div class="star-rating">';

        for (let i = 1; i <= 5; i++) {

            let fillPercentage = 0;

            if (rating >= i) {
                fillPercentage = 100; // Estrella completa
            } else if (rating > i - 1) {
                fillPercentage = (rating - (i - 1)) * 100; // Fracción decimal (ej. el 0.2 de 3.2 se vuelve 20%)
            }

            starsHTML += `
                <div class="star-container ${isInteractive ? 'interactive-star' : ''}" 
                     data-value="${i}" 
                     data-prefix="${prefix}">
                     
                    <i class="bi bi-star-fill star-empty"></i>
                    
                    <i class="bi bi-star-fill star-filled" style="width: ${fillPercentage}%;"></i>
                    
                </div>`;
        }
        starsHTML += '</div>';
        return starsHTML;
    }

    // 2. Renderizado del Carrusel
    function renderReadingCarousel() {
        const container = document.getElementById("readingCarouselContainer");
        const libro = leyendoActualmente[currentReadingIndex];
        const porcentaje = Math.round((libro.paginaActual / libro.paginasTotales) * 100);
        const isFinished = porcentaje >= 100;

        container.innerHTML = `
            <div class="reading-card">
                <img src="${libro.img}" class="reading-img">
                
                <div class="reading-info">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h2>${libro.titulo}</h2>
                            <p class="text-secondary">${libro.autor}</p>
                        </div>
                        <a href="Libro.html?id=${libro.id}" class="btn btn-sm btn-outline-dark">
                            Ver detalles <i class="bi bi-box-arrow-up-right ms-1"></i>
                        </a>
                    </div>
                    
                    <div class="mb-4">
                        <small>Progreso: ${porcentaje}% (${libro.paginaActual}/${libro.paginasTotales} págs)</small>
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar bg-danger" style="width: ${porcentaje}%"></div>
                        </div>
                    </div>

                    ${isFinished ? `
                        <div class="final-review-area">
                            <h5>¡Libro Terminado! </h5>
                            
                            <div class="mb-3 d-flex align-items-center gap-3">
                                <label class="mb-0 fw-bold">Nota:</label>
                                <input type="number" class="form-control form-control-sm decimal-rating-input" 
                                       value="${libro.ratingFinal || 0}" min="0" max="5" step="0.1" style="width: 75px;" data-target="final">
                                
                                <div id="stars-final-container">
                                    ${generateStarRating(libro.ratingFinal || 0)}
                                </div>
                            </div>

                            <textarea class="form-control mb-2" placeholder="Escribe tu reseña final..."></textarea>
                            <button class="btn btn-dark w-100">Publicar Reseña</button>
                        </div>
                    ` : `
                        <div class="progress-update-area">
                            <h6>Actualizar progreso</h6>
                            <div class="row g-2 mb-2 align-items-center">
                                <div class="col-3">
                                    <input type="number" class="form-control form-control-sm" placeholder="Pág." value="${libro.paginaActual}">
                                </div>
                                
                                <div class="col-9 d-flex align-items-center gap-2">
                                    <span class="small fw-bold">Nota:</span>
                                    <input type="number" class="form-control form-control-sm decimal-rating-input" 
                                           value="${libro.ratingSesion || 0}" min="0" max="5" step="0.1" style="width: 75px;" data-target="update">
                                    
                                    <div id="stars-update-container">
                                        ${generateStarRating(libro.ratingSesion || 0)}
                                    </div>
                                </div>
                            </div>
                            <textarea class="form-control mb-2" rows="2" placeholder="¿Qué te ha parecido este tramo?"></textarea>
                            <button class="btn btn-outline-dark btn-sm w-100">Guardar Avance</button>
                        </div>
                    `}
                </div>
            </div>
        `;

        attachDecimalEvents();
    }

    // 🔥 Nueva función para que las estrellas reaccionen al escribir
    function attachDecimalEvents() {
        document.querySelectorAll('.decimal-rating-input').forEach(input => {

            // Usamos 'input' para que cambie al instante, con cada tecla que pulses
            input.addEventListener('input', (e) => {
                let val = parseFloat(e.target.value);

                // Protecciones: si borras todo se pone a 0, si pones más de 5 se queda en 5
                if (isNaN(val) || val < 0) val = 0;
                if (val > 5) val = 5;

                const target = e.target.dataset.target;

                // Actualizamos los datos del array y recargamos SOLO las estrellas
                // (no recargamos todo el carrusel o se perdería el foco del teclado al escribir)
                if (target === 'final') {
                    leyendoActualmente[currentReadingIndex].ratingFinal = val;
                    document.getElementById('stars-final-container').innerHTML = generateStarRating(val);
                } else {
                    leyendoActualmente[currentReadingIndex].ratingSesion = val;
                    document.getElementById('stars-update-container').innerHTML = generateStarRating(val);
                }
            });
        });
    }

    // Lógica de navegación (cíclica)
    document.getElementById("prevReading").onclick = () => {
        currentReadingIndex = (currentReadingIndex === 0) ? leyendoActualmente.length - 1 : currentReadingIndex - 1;
        renderReadingCarousel();
    };

    document.getElementById("nextReading").onclick = () => {
        currentReadingIndex = (currentReadingIndex === leyendoActualmente.length - 1) ? 0 : currentReadingIndex + 1;
        renderReadingCarousel();
    };

    renderReadingCarousel();
});