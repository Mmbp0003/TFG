document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const perfilId = params.get("id");

    const btnSeguir = document.getElementById('btn-seguir');
    const btnDejarSeguir = document.getElementById('btn-dejar-seguir');
    const btnEditar = document.getElementById('btn-editar');

    // =========================
    // REDIRECCIÓN SI NO HAY ID
    // =========================
    if (!perfilId) {
        const redirigir = (usuario) => {
            window.location.href = `/Vistas/Perfil.html?id=${usuario.id}`;
        };
        if (window.usuarioActual) {
            redirigir(window.usuarioActual);
        } else {
            document.addEventListener("usuarioListo", (e) => redirigir(e.detail));
        }
        return;
    }

    // =========================
    // 1. OBTENER USUARIO LOGUEADO
    // =========================
    function iniciar(usuarioLogueado) {
        cargarPerfil(usuarioLogueado);
    }

    if (window.usuarioActual !== undefined && window.usuarioActual !== null) {
        iniciar(window.usuarioActual);
    } else {
        document.addEventListener("usuarioListo", (e) => iniciar(e.detail));
    }

    // =========================
    // 2. CARGAR PERFIL
    // =========================
    function cargarPerfil(usuarioLogueado) {
        fetch(`/api/usuarios/${perfilId}`, { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("Error cargando perfil");
                return res.json();
            })
            .then(usuario => {

                document.getElementById("nombre-usuario").textContent =
                    usuario.nombre + " " + usuario.apellidos;

                document.getElementById("total-leidos").textContent =
                    usuario.librosGuardados?.length || 0;
                document.getElementById("leidos-ano").textContent = usuario.leidosEsteAno || 0;
                document.getElementById("media").textContent = usuario.mediaResenas
                    ? usuario.mediaResenas + "★"
                    : "—";

                pintarCarpetas(usuario.carpetas);

                pintarUsuarios("seguidores", usuario.seguidores);
                pintarUsuarios("siguiendo", usuario.siguiendo);

                configurarBotones(usuario, usuarioLogueado);
                cargarActividad(perfilId);

                document.getElementById("page-content").style.display = "block";
            })
            .catch(err => console.error("Error cargando perfil:", err));
    }

    // =========================
    // 3. CARPETAS CON PORTADAS
    // =========================
    function pintarCarpetas(carpetas) {
        const container = document.getElementById("carpetas-container");
        container.innerHTML = "";

        if (!carpetas || carpetas.length === 0) {
            container.innerHTML = `
                <div class="profile-section">
                    <p class="text-muted">No hay carpetas todavía</p>
                </div>`;
            return;
        }

        carpetas.forEach(carpeta => {
            const seccion = document.createElement("div");
            seccion.className = "profile-section";

            const titulo = document.createElement("h5");
            titulo.className = "profile-section-title";
            titulo.textContent = carpeta.nombre;
            seccion.appendChild(titulo);

            const fila = document.createElement("div");
            fila.className = "profile-scroll-row";

            if (!carpeta.libros || carpeta.libros.length === 0) {
                fila.innerHTML = "<p class='text-muted small'>Carpeta vacía</p>";
            } else {
                carpeta.libros.forEach(libro => {
                    const img = document.createElement("img");
                    img.src = libro.portada ? `/img/${libro.portada}` : "/img/portada_default.jpg";
                    img.alt = libro.titulo || "";
                    img.className = "profile-book";
                    img.title = libro.titulo || "";
                    fila.appendChild(img);
                });
            }

            seccion.appendChild(fila);
            container.appendChild(seccion);
        });
    }

    // =========================
    // 4. ACTIVIDAD
    // =========================
    function cargarActividad(usuarioId) {
        fetch(`/api/actividades/usuario/${usuarioId}`, { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("Error cargando actividad");
                return res.json();
            })
            .then(actividades => pintarActividad(actividades))
            .catch(err => console.error("Error actividad:", err));
    }

    function pintarActividad(actividades) {
        const container = document.getElementById("actividad");
        container.innerHTML = "";

        if (!actividades || actividades.length === 0) {
            container.innerHTML = "<p class='text-muted ps-1'>Sin actividad reciente</p>";
            return;
        }

        actividades.slice(0, 10).forEach(act => {
            const div = document.createElement("div");
            div.className = "actividad-item d-flex align-items-start gap-2 mb-2";

            const fecha = new Date(act.fecha).toLocaleDateString("es-ES", {
                day: "numeric", month: "short", year: "numeric"
            });

            div.innerHTML = `
                <i class="bi ${iconoActividad(act.tipo)} fs-5 mt-1"></i>
                <div>
                    <span class="small">${textoActividad(act)}</span>
                    <br>
                    <span class="text-muted" style="font-size:0.75rem">${fecha}</span>
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
        const quien = `<a href="/Vistas/Perfil.html?id=${act.usuarioId}" 
                          class="text-decoration-none fw-bold">${act.nombreUsuario}</a>`;
        switch (act.tipo) {
            case "SEGUIMIENTO":   return `${quien} empezó a seguir a <strong>${act.textoReferencia}</strong>`;
            case "LIBRO_ACABADO": return `${quien} acabó <strong>${act.textoReferencia}</strong>`;
            case "RESENA":        return `${quien} reseñó <strong>${act.textoReferencia}</strong> — ${act.valor}★`;
            case "PROGRESO":      return `${quien} lleva un ${act.valor}% de <strong>${act.textoReferencia}</strong>`;
            case "COMENTARIO":    return `${quien} comentó en <strong>${act.textoReferencia}</strong>`;
            case "CARPETA":
                if (act.textoReferencia && act.textoReferencia.includes("||")) {
                    const [libro, carpeta] = act.textoReferencia.split("||");
                    return `${quien} añadió <strong>${libro.trim()}</strong> a la carpeta <strong>${carpeta.trim()}</strong>`;
                }
                return `${quien} añadió <strong>${act.textoReferencia}</strong> a una carpeta`;
            default:              return act.textoReferencia;
        }
    }

    // =========================
    // AUXILIARES
    // =========================
    function pintarUsuarios(containerId, lista) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";

        if (!lista || lista.length === 0) {
            container.innerHTML = "<p class='text-muted ps-3'>Ninguno todavía</p>";
            return;
        }

        lista.forEach(u => {
            const div = document.createElement("div");
            div.className = "profile-user-item d-flex align-items-center mb-2";
            div.innerHTML = `
                <i class="bi bi-person-circle fs-4 me-2 profile-avatar"></i>
                <a href="/Vistas/Perfil.html?id=${u.id}" class="text-decoration-none text-dark">
                    <span class="profile-user">${u.nombre} ${u.apellidos}</span>
                </a>
            `;
            container.appendChild(div);
        });
    }

    function configurarBotones(usuarioPerfil, usuarioLogueado) {
        btnSeguir.style.display = 'none';
        btnDejarSeguir.style.display = 'none';
        btnEditar.style.display = 'none';

        if (!usuarioLogueado) return;

        const esMiPerfil = usuarioLogueado.id === usuarioPerfil.id;

        if (esMiPerfil) {
            btnEditar.style.display = 'inline-block';
            return;
        }

        // Preguntamos al backend si ya lo seguimos
        fetch(`/api/relaciones/comprobar/${perfilId}`, { credentials: "include" })
            .then(res => res.json())
            .then(yaLoSigo => {
                yaLoSigo
                    ? (btnDejarSeguir.style.display = 'inline-block')
                    : (btnSeguir.style.display = 'inline-block');
            });
    }


    // =========================
    // EVENTOS
    // =========================
    btnSeguir.addEventListener("click", () => {
        fetch("/api/relaciones/seguir", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ seguidoId: parseInt(perfilId) })  // forzar número
        })
            .then(res => {
                if (!res.ok) return res.text().then(t => { throw new Error(t); });
                location.reload();
            })
            .catch(err => console.error("Error al seguir:", err));
    });

    btnDejarSeguir.addEventListener("click", () => {
        fetch("/api/relaciones/dejar", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ seguidoId: parseInt(perfilId) })  // forzar número
        })
            .then(res => {
                if (!res.ok) return res.text().then(t => { throw new Error(t); });
                location.reload();
            })
            .catch(err => console.error("Error al dejar de seguir:", err));
    });
});