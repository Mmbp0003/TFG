document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const perfilId = params.get("id");

    const btnSeguir = document.getElementById('btn-seguir');
    const btnDejarSeguir = document.getElementById('btn-dejar-seguir');
    const btnEditar = document.getElementById('btn-editar');

    let usuarioLogueado = null;

    // =========================
    // 1. CARGAR USUARIO LOGUEADO
    // =========================
    fetch("/api/usuarios/me", {
        credentials: "include"
    })
        .then(res => {
            if (!res.ok) {
                return res.text().then(msg => {
                    throw new Error(msg);
                });
            }
            return res.json();
        })
        .then(user => {
            usuarioLogueado = user;
            cargarPerfil();
        })
        .catch(err => {
            console.log("No autenticado:", err.message);
            cargarPerfil(); // incluso sin login
        });


    // =========================
    // 2. CARGAR PERFIL
    // =========================
    function cargarPerfil() {

        fetch(`/api/usuarios/${perfilId}`)
            .then(res => {
                if (!res.ok) throw new Error("Error cargando perfil");
                return res.json();
            })
            .then(usuario => {

                // ===== DATOS PRINCIPALES =====
                document.getElementById("nombre-usuario").textContent =
                    usuario.nombre + " " + usuario.apellidos;

                // ===== STATS =====
                document.getElementById("total-leidos").textContent =
                    usuario.librosGuardados?.length || 0;

                document.getElementById("leidos-ano").textContent = 0;
                document.getElementById("media").textContent = 0;

                // ===== LIBROS =====
                pintarLibros("lecturas", usuario.librosGuardados);
                pintarLibros("favoritos", usuario.librosGuardados);

                // ===== SOCIAL =====
                pintarUsuarios("seguidores", usuario.seguidores, "seguidor");
                pintarUsuarios("siguiendo", usuario.siguiendo, "seguido");

                // ===== BOTONES =====
                configurarBotones(usuario);

                document.getElementById("page-content").style.display = "block";
            })
            .catch(err => {
                console.error(err);
            });
    }


    // =========================
    // AUXILIARES
    // =========================

    function pintarLibros(containerId, libros) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";

        if (!libros || libros.length === 0) {
            container.innerHTML = "<p>No hay libros</p>";
            return;
        }

        libros.forEach(libro => {
            const img = document.createElement("img");
            img.src = libro.portada;
            img.className = "profile-book";
            container.appendChild(img);
        });
    }

    function pintarUsuarios(containerId, lista, tipo) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";

        if (!lista || lista.length === 0) {
            container.innerHTML = "<p>Vacío</p>";
            return;
        }

        lista.forEach(rel => {
            const usuario = rel[tipo];

            const div = document.createElement("div");
            div.className = "profile-user-item";

            div.innerHTML = `
                <i class="bi bi-person-circle fs-4 profile-avatar"></i>
                <span class="profile-user">${usuario.nombre}</span>
            `;

            container.appendChild(div);
        });
    }


    function configurarBotones(usuarioPerfil) {

        btnSeguir.style.display = 'none';
        btnDejarSeguir.style.display = 'none';
        btnEditar.style.display = 'none';

        if (!usuarioLogueado) return;

        const esMiPerfil = usuarioLogueado.id === usuarioPerfil.id;

        if (esMiPerfil) {
            btnEditar.style.display = 'inline-block';
        } else {

            const yaLoSigo = usuarioPerfil.seguidores?.some(
                r => r.seguidor.id === usuarioLogueado.id
            );

            if (yaLoSigo) {
                btnDejarSeguir.style.display = 'inline-block';
            } else {
                btnSeguir.style.display = 'inline-block';
            }
        }
    }


    // =========================
    // EVENTOS
    // =========================

    btnSeguir.addEventListener("click", () => {
        fetch("/api/relaciones/seguir", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ seguidoId: perfilId })
        }).then(() => location.reload());
    });

    btnDejarSeguir.addEventListener("click", () => {
        fetch("/api/relaciones/dejar", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ seguidoId: perfilId })
        }).then(() => location.reload());
    });

});