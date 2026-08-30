document.addEventListener("DOMContentLoaded", () => {

    fetch("/api/actividades/feed", { credentials: "include" })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(actividades => {
            console.table(actividades);
            console.log(JSON.stringify(actividades[0], null, 2));
            pintarFeed(actividades);
        })
        .catch(err => {
            console.error(err);
            document.getElementById("feed-container").innerHTML =
                `<p class='text-danger'>Error al cargar el feed: ${err.message}</p>`;
        });

    function pintarFeed(actividades) {
        const container = document.getElementById("feed-container");
        document.getElementById("page-content").style.display = "block";

        if (!actividades || actividades.length === 0) {
            container.innerHTML = `
                <p class='text-muted'>No hay actividad reciente de las personas que sigues.</p>
            `;
            return;
        }

        actividades.forEach(act => {
            const div = document.createElement("div");
            div.className = "actividad-item d-flex align-items-start gap-3 mb-3 p-3 border rounded";

            const fechaObj = new Date(act.fecha);
            const fecha = isNaN(fechaObj)
                ? act.fecha
                : fechaObj.toLocaleDateString("es-ES", {
                    day: "numeric", month: "short", year: "numeric"
                });

            div.innerHTML = `
                <i class="bi ${iconoActividad(act.tipo)} fs-4 mt-1"></i>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between">
                        <span>
                            <a href="/Vistas/Perfil.html?id=${act.usuarioId}" 
                               class="fw-bold text-decoration-none text-dark">
                                ${act.nombreUsuario}
                            </a>
                            ${textoActividad(act)}
                        </span>
                        <small class="text-muted">${fecha}</small>
                    </div>
                </div>
            `;

            container.appendChild(div);
        });
    }

    function iconoActividad(tipo) {
        const iconos = {
            "SEGUIMIENTO":   "bi-person-plus",
            "LIBRO_ACABADO": "bi-book",
            "RESENA":        "bi-star",
            "PROGRESO":      "bi-bar-chart-line",
            "COMENTARIO":    "bi-chat",
            "CARPETA":       "bi-folder-plus"
        };
        return iconos[tipo] || "bi-circle";
    }

    function textoActividad(act) {
        switch (act.tipo) {
            case "SEGUIMIENTO":   return `empezó a seguir a <strong>${act.textoReferencia}</strong>`;
            case "LIBRO_ACABADO": return `acabó <strong>${act.textoReferencia}</strong>`;
            case "RESENA":        return `reseñó <strong>${act.textoReferencia}</strong> — ${act.valor}★`;
            case "PROGRESO":      return `lleva un ${act.valor}% de <strong>${act.textoReferencia}</strong>`;
            case "COMENTARIO":    return `comentó en <strong>${act.textoReferencia}</strong>`;
            case "CARPETA":
                if (act.textoReferencia && act.textoReferencia.includes("||")) {
                    const [libro, carpeta] = act.textoReferencia.split("||");
                    return `añadió <strong>${libro.trim()}</strong> a la carpeta <strong>${carpeta.trim()}</strong>`;
                }
                return `añadió <strong>${act.textoReferencia}</strong> a una carpeta`;
        }
    }
});