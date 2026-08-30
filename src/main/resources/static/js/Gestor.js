const API_URLS = {
    usuarios: '/api/usuarios',
    libros:   '/api/libros',
    generos:  '/api/generos',
    resenas:  '/api/resenas'
};

let datosCargados     = [];
let paginaActual      = 1;
const REGISTROS_PAG   = 15;

// ─────────────────────────────────────────────
// INICIALIZACIÓN
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    cargarVista('usuarios');
});

// ─────────────────────────────────────────────
// CARGA DE DATOS
// ─────────────────────────────────────────────

async function cargarVista(seccion) {
    document.querySelectorAll('.btn-gestor').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${seccion}'`));
    });

    // Mostrar/ocultar botones de creación según sección
    document.getElementById('btnNuevoUsuarioWrapper').style.display = seccion === 'usuarios' ? '' : 'none';
    document.getElementById('btnNuevoGeneroWrapper').style.display  = seccion === 'generos'  ? '' : 'none';
    document.getElementById('btnNuevoLibroWrapper').style.display  = seccion === 'libros'   ? '' : 'none';

    paginaActual = 1;

    const contenedor = document.getElementById('gestorTableContainer');
    contenedor.innerHTML = `
        <div class="text-center p-5">
            <div class="spinner-border text-danger"></div>
        </div>`;

    try {
        const response = await fetch(API_URLS[seccion]);
        if (!response.ok) throw new Error(`Error ${response.status}`);

        datosCargados = await response.json();
        renderizarTabla(seccion, datosCargados);
    } catch (error) {
        contenedor.innerHTML = `
            <div class="alert alert-danger">
                Error al conectar con el servidor: ${error.message}
            </div>`;
    }
}

// ─────────────────────────────────────────────
// RENDERIZADO DE TABLA
// ─────────────────────────────────────────────
function renderizarTabla(seccion, datos) {
    const contenedor   = document.getElementById('gestorTableContainer');
    const totalRegistros = datos.length;
    const totalPaginas   = Math.ceil(totalRegistros / REGISTROS_PAG);

    if (paginaActual > totalPaginas && totalPaginas > 0) {
        paginaActual = totalPaginas;
    }

    const inicio        = (paginaActual - 1) * REGISTROS_PAG;
    const datosPaginados = datos.slice(inicio, inicio + REGISTROS_PAG);

    let html = '';

    if (seccion === 'usuarios') {
        html = construirTablaUsuarios(datosPaginados);
    } else if (seccion === 'libros') {
        html = construirTablaLibros(datosPaginados);
    } else if (seccion === 'generos') {
        html = construirTablaGeneros(datosPaginados);
    } else {
        html = '<div class="alert alert-warning">Sección no reconocida.</div>';
    }

    contenedor.innerHTML = html;
    actualizarPaginacion(totalRegistros, totalPaginas, seccion);
}

// ─────────────────────────────────────────────
// CONSTRUCTORES DE TABLA POR SECCIÓN
// ─────────────────────────────────────────────
function construirTablaUsuarios(datos) {
    let html = `
        <table class="table align-middle">
            <thead><tr>
                <th>ID</th>
                <th>Nombre y Apellidos</th>
                <th>Email</th>
                <th>Fecha de nacimiento</th>
                <th>Rol</th>
                <th class="text-end">Acciones</th>
            </tr></thead>
            <tbody>`;

    if (datos.length === 0) {
        html += `<tr><td colspan="6" class="text-center text-muted py-4">No se encontraron usuarios.</td></tr>`;
    }

    datos.forEach(u => {
        const fechaFormateada = u.fechaNacimiento
            ? new Date(u.fechaNacimiento).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : '—';

        html += `
            <tr>
                <td class="text-muted">#${u.id}</td>
                <td>
                    <div class="fw-bold">${u.nombre} ${u.apellidos}</div>
                </td>
                <td>${u.email}</td>
                <td class="text-muted small">${fechaFormateada}</td>
                <td>
                    <span class="status-pill ${u.rol === 'ADMIN' ? 'admin-pill' : 'active-pill'}">
                        ${u.rol}
                    </span>
                </td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger"
                            title="Eliminar usuario"
                            onclick="eliminarRegistro('usuarios', ${u.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`;
    });

    return html + `</tbody></table>`;
}

function construirTablaLibros(datos) {
    let html = `
        <table class="table align-middle">
            <thead><tr>
                <th>Portada</th>
                <th>Título / Autor</th>
                <th>Géneros</th>
                <th>Tags</th>
                <th>Páginas</th>
                <th>Publicación</th>
                <th>Valoración</th>
                <th>Reseñas</th>
                <th class="text-end">Acciones</th>
            </tr></thead>
            <tbody>`;

    if (datos.length === 0) {
        html += `<tr><td colspan="9" class="text-center text-muted py-4">No se encontraron libros.</td></tr>`;
    }

    datos.forEach(l => {
        const tituloEscapado = l.titulo.replace(/'/g, "\\'");
        html += `
            <tr>
                <td><img src="${l.portada ? '/img/' + l.portada : '/img/portada-default.jpg'}"
                         class="rounded" style="width:40px; height:55px; object-fit:cover;"></td>
                <td>
                    <div class="fw-bold">${l.titulo}</div>
                    <div class="text-muted small">${l.autor}</div>
                </td>
                <td><small>${l.generos?.join(', ') || '—'}</small></td>
                <td><small>${l.tags?.join(', ') || '—'}</small></td>
                <td>${l.paginas}</td>
                <td><small>${l.fechaPublicacion}</small></td>
                <td><i class="bi bi-star-fill text-warning"></i> ${l.mediaResenas.toFixed(1)}</td>
                <td>
                    <button class="btn btn-sm btn-link p-0"
                            onclick="verResenasDeLibro(${l.id}, '${tituloEscapado}')">
                        Ver reseñas
                    </button>
                </td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-secondary me-1" title="Editar libro" 
                            onclick="abrirModalEditarLibro(${l.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger"
                            onclick="eliminarRegistro('libros', ${l.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`;
    });

    return html + `</tbody></table>`;
}

function construirTablaGeneros(datos) {
    let html = `
        <table class="table align-middle">
            <thead><tr>
                <th>ID</th>
                <th>Nombre</th>
                <th class="text-end">Acciones</th>
            </tr></thead>
            <tbody>`;

    if (datos.length === 0) {
        html += `<tr><td colspan="3" class="text-center text-muted py-4">No se encontraron géneros.</td></tr>`;
    }

    datos.forEach(g => {
        html += `
            <tr>
                <td class="text-muted">#${g.id}</td>
                <td><div class="fw-bold">${g.nombre}</div></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger"
                            onclick="eliminarRegistro('generos', ${g.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`;
    });

    return html + `</tbody></table>`;
}

// ─────────────────────────────────────────────
// PAGINACIÓN
// ─────────────────────────────────────────────
function actualizarPaginacion(totalRegistros, totalPaginas, seccion) {
    const label        = document.getElementById('paginationLabel');
    const paginationUl = document.querySelector('.pagination');

    const desde = totalRegistros === 0 ? 0 : (paginaActual - 1) * REGISTROS_PAG + 1;
    const hasta = Math.min(paginaActual * REGISTROS_PAG, totalRegistros);
    label.innerText = `Mostrando ${desde}–${hasta} de ${totalRegistros} registros`;

    let html = `
        <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#"
               onclick="cambiarPagina(${paginaActual - 1}, '${seccion}'); return false;">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>`;

    // Máximo 7 botones visibles para no desbordar en datasets grandes
    const rango = paginasVisibles(paginaActual, totalPaginas, 7);
    rango.forEach(i => {
        if (i === '...') {
            html += `<li class="page-item disabled"><a class="page-link">…</a></li>`;
        } else {
            html += `
                <li class="page-item ${i === paginaActual ? 'active' : ''}">
                    <a class="page-link" href="#"
                       onclick="cambiarPagina(${i}, '${seccion}'); return false;">${i}</a>
                </li>`;
        }
    });

    html += `
        <li class="page-item ${paginaActual >= totalPaginas || totalPaginas === 0 ? 'disabled' : ''}">
            <a class="page-link" href="#"
               onclick="cambiarPagina(${paginaActual + 1}, '${seccion}'); return false;">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>`;

    paginationUl.innerHTML = html;
}


function paginasVisibles(actual, total, maxBotones) {
    if (total <= maxBotones) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const paginas = new Set([1, total, actual]);
    const vecinos = 1; // páginas a cada lado de la actual
    for (let i = actual - vecinos; i <= actual + vecinos; i++) {
        if (i >= 1 && i <= total) paginas.add(i);
    }
    const ordenadas = [...paginas].sort((a, b) => a - b);
    const resultado = [];
    for (let i = 0; i < ordenadas.length; i++) {
        resultado.push(ordenadas[i]);
        if (i < ordenadas.length - 1 && ordenadas[i + 1] - ordenadas[i] > 1) {
            resultado.push('...');
        }
    }
    return resultado;
}

function cambiarPagina(nuevaPagina, seccion) {
    if (!seccion) {
        // Fallback: leer la sección del botón activo
        const btn = document.querySelector('.btn-gestor.active');
        seccion = btn ? btn.getAttribute('onclick').match(/'([^']+)'/)[1] : 'usuarios';
    }
    const totalPaginas = Math.ceil(datosCargados.length / REGISTROS_PAG);
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    paginaActual = nuevaPagina;
    renderizarTabla(seccion, datosCargados);
}

// ─────────────────────────────────────────────
// BÚSQUEDA / FILTRO
// ─────────────────────────────────────────────
function filterGestorTable() {
    const query = document.getElementById('gestorSearch').value.toLowerCase().trim();

    const filtrados = datosCargados.filter(item => {
        const campo1 = (item.nombre  || item.titulo  || '').toLowerCase();
        const campo2 = (item.email   || item.autor   || '').toLowerCase();
        const campo3 = (item.apellidos || item.nombre || '').toLowerCase();
        return campo1.includes(query) || campo2.includes(query) || campo3.includes(query);
    });

    paginaActual = 1; // Siempre volver a la página 1 al filtrar

    const btn = document.querySelector('.btn-gestor.active');
    const seccionActiva = btn ? btn.getAttribute('onclick').match(/'([^']+)'/)[1] : 'usuarios';
    renderizarTabla(seccionActiva, filtrados);
}

// ─────────────────────────────────────────────
// RESEÑAS DE UN LIBRO
// ─────────────────────────────────────────────
async function verResenasDeLibro(libroId, titulo) {
    paginaActual = 1; // Resetear paginación al entrar en detalle

    const contenedor = document.getElementById('gestorTableContainer');
    contenedor.innerHTML = `
        <h4 class="m-0">Reseñas de: <span class="text-danger">${titulo}</span></h4>`;

    // Ocultar paginación mientras se muestra la vista de detalle
    document.getElementById('paginationLabel').innerText = '';
    document.querySelector('.pagination').innerHTML = '';

    try {
        const res = await fetch(`${API_URLS.resenas}/libro/${libroId}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const resenas = await res.json();

        let html = `
            <div class="d-flex align-items-center mb-4">
                <button class="btn btn-sm btn-secondary me-3" onclick="cargarVista('libros')">
                    <i class="bi bi-arrow-left"></i> Volver
                </button>
                <h4 class="m-0">Reseñas de: <span class="text-info">${titulo}</span></h4>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <tr><th>ID usuario</th>
                            <th>Usuario</th>
                            <th>Nota</th>
                            <th>Contenido</th>
                            <th>Fecha</th>
                            <th class="text-end">Acciones</th>
                        </tr>
                    </tr>
                </thead>
                <tbody>`;

        if (resenas.length === 0) {
            html += `<tr><td colspan="4" class="text-center text-muted py-4">Este libro no tiene reseñas.</td></tr>`;
        }

        resenas.forEach(r => {
            html += `
        <tr>
            <td class="text-muted">#${r.usuarioId}</td>
            <td>${r.nombreUsuario} ${r.apellidosUsuario}</td>
            <td><span class="text-warning">★ ${r.puntuacion}</span></td>
            <td><small class="text-muted">${r.contenido}</small></td>
            <td><small>${r.fechaCreacion}</small></td>
            <td class="text-end">
                <button class="btn btn-sm btn-danger"
                        onclick="eliminarResena(${r.id}, ${libroId}, '${titulo.replace(/'/g, "\\'")}')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </td>
        </tr>`;
        });

        html += `</tbody></table>`;
        contenedor.innerHTML = html;

    } catch (e) {
        contenedor.innerHTML = `
            <div class="alert alert-danger">
                Error al cargar las reseñas: ${e.message}
            </div>`;
    }
}

// ─────────────────────────────────────────────
// ELIMINACIÓN
// ─────────────────────────────────────────────
async function eliminarRegistro(tipo, id) {
    const nombreSingular = { usuarios: 'usuario', libros: 'libro', generos: 'género' }[tipo] || tipo;
    if (!confirm(`¿Estás seguro de que quieres eliminar este ${nombreSingular}?`)) return;

    try {
        const res = await fetch(`${API_URLS[tipo]}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            cargarVista(tipo);
        } else {
            const msg = res.status === 409
                ? 'No se puede eliminar: tiene datos asociados.'
                : `Error del servidor (${res.status}).`;
            alert(msg);
        }
    } catch (e) {
        alert('Error de red al intentar eliminar.');
    }
}

async function eliminarResena(resenaId, libroId, titulo) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reseña?')) return;

    try {
        const res = await fetch(`${API_URLS.resenas}/${resenaId}`, { method: 'DELETE' });
        if (res.ok) {
            verResenasDeLibro(libroId, titulo);
        } else {
            alert(`Error al eliminar la reseña (${res.status}).`);
        }
    } catch (e) {
        alert('Error de red al intentar eliminar la reseña.');
    }
}


function abrirModalNuevoUsuario() {
    // Evitar duplicados
    if (!document.getElementById('modalNuevoUsuario')) {
        document.body.insertAdjacentHTML('beforeend', plantillaModalNuevoUsuario());
    }
    // Limpiar el formulario antes de abrir
    document.getElementById('modalNuevoUsuario').querySelectorAll('input, select').forEach(el => el.value = el.defaultValue || '');
    document.getElementById('nuevoUsuarioError').classList.add('d-none');

    const modal = new bootstrap.Modal(document.getElementById('modalNuevoUsuario'));
    modal.show();
}

function plantillaModalNuevoUsuario() {
    return `
    <div class="modal fade" id="modalNuevoUsuario" tabindex="-1" aria-labelledby="modalNuevoUsuarioLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold" id="modalNuevoUsuarioLabel">
                        <i class="bi bi-person-plus-fill me-2 text-danger"></i>Nuevo usuario
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body pt-2">
                    <div id="nuevoUsuarioError" class="alert alert-danger d-none"></div>

                    <div id="formNuevoUsuario">
                        <div class="row g-3">

                            <div class="col-6">
                                <label class="form-label small fw-semibold">Nombre <span class="text-danger">*</span></label>
                                <input type="text" id="nu_nombre" class="form-control form-control-sm"
                                       placeholder="Ej: María" required>
                            </div>

                            <div class="col-6">
                                <label class="form-label small fw-semibold">Apellidos <span class="text-danger">*</span></label>
                                <input type="text" id="nu_apellidos" class="form-control form-control-sm"
                                       placeholder="Ej: García López" required>
                            </div>

                            <div class="col-12">
                                <label class="form-label small fw-semibold">Email <span class="text-danger">*</span></label>
                                <input type="email" id="nu_email" class="form-control form-control-sm"
                                       placeholder="correo@ejemplo.com" required>
                            </div>

                            <div class="col-6">
                                <label class="form-label small fw-semibold">Fecha de nacimiento <span class="text-danger">*</span></label>
                                <input type="date" id="nu_fecha" class="form-control form-control-sm" required>
                            </div>

                            <div class="col-6">
                                <label class="form-label small fw-semibold">Rol <span class="text-danger">*</span></label>
                                <select id="nu_rol" class="form-select form-select-sm">
                                    <option value="USER" selected>USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            <div class="col-12">
                                <label class="form-label small fw-semibold">Contraseña <span class="text-danger">*</span></label>
                                <div class="input-group input-group-sm">
                                    <input type="password" id="nu_clave" class="form-control"
                                           placeholder="Mínimo 5 caracteres" minlength="5" required>
                                    <button class="btn btn-outline-secondary" type="button"
                                            onclick="togglePasswordVisibility('nu_clave', this)">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="guardarNuevoUsuario()">
                        <i class="bi bi-person-check-fill me-1"></i>Crear usuario
                    </button>
                </div>

            </div>
        </div>
    </div>`;
}

async function guardarNuevoUsuario() {
    const errorDiv = document.getElementById('nuevoUsuarioError');
    errorDiv.classList.add('d-none');

    const nombre    = document.getElementById('nu_nombre').value.trim();
    const apellidos = document.getElementById('nu_apellidos').value.trim();
    const email     = document.getElementById('nu_email').value.trim();
    const fecha     = document.getElementById('nu_fecha').value;
    const rol       = document.getElementById('nu_rol').value;
    const clave     = document.getElementById('nu_clave').value;

    if (!nombre || !apellidos || !email || !fecha || !clave) {
        mostrarErrorModal('Por favor, rellena todos los campos obligatorios.');
        return;
    }
    if (clave.length < 5) {
        mostrarErrorModal('La contraseña debe tener al menos 5 caracteres.');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarErrorModal('El formato del email no es válido.');
        return;
    }
    if (new Date(fecha) >= new Date()) {
        mostrarErrorModal('La fecha de nacimiento debe ser una fecha pasada.');
        return;
    }

    const payload = { nombre, apellidos, email, fechaNacimiento: fecha, clave, rol };

    try {
        const res = await fetch(API_URLS.usuarios, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            bootstrap.Modal.getInstance(document.getElementById('modalNuevoUsuario')).hide();
            cargarVista('usuarios'); // Recargar tabla con el nuevo usuario
        } else if (res.status === 409) {
            mostrarErrorModal('Ya existe un usuario con ese email.');
        } else {
            const body = await res.text();
            mostrarErrorModal(`Error del servidor (${res.status}): ${body}`);
        }
    } catch (e) {
        mostrarErrorModal('No se pudo conectar con el servidor.');
    }
}

function mostrarErrorModal(mensaje) {
    const errorDiv = document.getElementById('nuevoUsuarioError');
    errorDiv.textContent = mensaje;
    errorDiv.classList.remove('d-none');
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    const esPassword = input.type === 'password';
    input.type = esPassword ? 'text' : 'password';
    btn.querySelector('i').className = esPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
}


// CAMBIO DE ROL


async function cambiarRolUsuario(id, rolActual, nombreCompleto) {
    const nuevoRol = rolActual === 'ADMIN' ? 'USER' : 'ADMIN';
    const accion   = rolActual === 'ADMIN' ? 'quitar permisos de administrador a' : 'hacer administrador a';

    if (!confirm(`¿Estás seguro de que quieres ${accion} ${nombreCompleto}?`)) return;

    try {
        const res = await fetch(`${API_URLS.usuarios}/${id}/rol`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rol: nuevoRol })
        });

        if (res.ok) {
            cargarVista('usuarios');
        } else {
            alert(`No se pudo cambiar el rol (${res.status}).`);
        }
    } catch (e) {
        alert('Error de red al cambiar el rol.');
    }
}

//--------------------------------------------------------------GENERO-----------------------------------------------------------

function abrirModalNuevoGenero() {
    if (!document.getElementById('modalNuevoGenero')) {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="modalNuevoGenero" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold">
                            <i class="bi bi-tags-fill me-2 text-danger"></i>Nuevo género
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body pt-2">
                        <div id="nuevoGeneroError" class="alert alert-danger d-none"></div>
                        <label class="form-label small fw-semibold">Nombre <span class="text-danger">*</span></label>
                        <input type="text" id="ng_nombre" class="form-control form-control-sm" placeholder="Ej: Ciencia ficción">
                    </div>
                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="guardarNuevoGenero()">
                            <i class="bi bi-check-lg me-1"></i>Crear género
                        </button>
                    </div>
                </div>
            </div>
        </div>`);
    }
    document.getElementById('ng_nombre').value = '';
    document.getElementById('nuevoGeneroError').classList.add('d-none');
    new bootstrap.Modal(document.getElementById('modalNuevoGenero')).show();
}

async function guardarNuevoGenero() {
    const nombre = document.getElementById('ng_nombre').value.trim();
    const errorDiv = document.getElementById('nuevoGeneroError');
    errorDiv.classList.add('d-none');

    if (!nombre) {
        errorDiv.textContent = 'El nombre no puede estar vacío.';
        errorDiv.classList.remove('d-none');
        return;
    }

    try {
        const res = await fetch(API_URLS.generos, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        });

        if (res.ok) {
            bootstrap.Modal.getInstance(document.getElementById('modalNuevoGenero')).hide();
            cargarVista('generos');
        } else {
            errorDiv.textContent = `Error del servidor (${res.status}).`;
            errorDiv.classList.remove('d-none');
        }
    } catch (e) {
        errorDiv.textContent = 'No se pudo conectar con el servidor.';
        errorDiv.classList.remove('d-none');
    }
}

//--------------------------------------LIBRO--------------------------------------------

async function abrirModalNuevoLibro() {
    if (!document.getElementById('modalNuevoLibro')) {
        // Cargar géneros primero
        const res = await fetch(API_URLS.generos);
        const generos = await res.json();

        const checkboxesGeneros = generos.map(g => `
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" value="${g.id}" id="gen_${g.id}">
                <label class="form-check-label small" for="gen_${g.id}">${g.nombre}</label>
            </div>`).join('');

        document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="modalNuevoLibro" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold">
                            <i class="bi bi-book-fill me-2 text-danger"></i>Nuevo libro
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body pt-2">
                        <div id="nuevoLibroError" class="alert alert-danger d-none"></div>
                        <div class="row g-3">
                            <div class="col-8">
                                <label class="form-label small fw-semibold">Título <span class="text-danger">*</span></label>
                                <input type="text" id="nl_titulo" class="form-control form-control-sm">
                            </div>
                            <div class="col-4">
                                <label class="form-label small fw-semibold">Autor <span class="text-danger">*</span></label>
                                <input type="text" id="nl_autor" class="form-control form-control-sm">
                            </div>
                            <div class="col-12">
                                <label class="form-label small fw-semibold">Sinopsis <span class="text-danger">*</span></label>
                                <textarea id="nl_sinopsis" class="form-control form-control-sm" rows="3" maxlength="5000"></textarea>
                            </div>
                            <div class="col-4">
                                <label class="form-label small fw-semibold">Páginas <span class="text-danger">*</span></label>
                                <input type="number" id="nl_paginas" class="form-control form-control-sm" min="1">
                            </div>
                            <div class="col-4">
                                <label class="form-label small fw-semibold">Fecha publicación <span class="text-danger">*</span></label>
                                <input type="date" id="nl_fecha" class="form-control form-control-sm">
                            </div>
                            <div class="col-4">
                                <label class="form-label small fw-semibold">Portada <span class="text-danger">*</span></label>
                                <input type="file" id="nl_portada" class="form-control form-control-sm" accept="image/*">
                            </div>
                            <div class="col-12">
                                <label class="form-label small fw-semibold">Géneros</label>
                                <div class="border rounded p-2" style="max-height:120px; overflow-y:auto">
                                    ${checkboxesGeneros}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="guardarNuevoLibro()">
                            <i class="bi bi-check-lg me-1"></i>Crear libro
                        </button>
                    </div>
                </div>
            </div>
        </div>`);
    } else {
        // Limpiar campos si el modal ya existe
        ['nl_titulo','nl_autor','nl_sinopsis','nl_paginas','nl_fecha'].forEach(id => document.getElementById(id).value = '');
        document.querySelectorAll('#modalNuevoLibro input[type=checkbox]').forEach(cb => cb.checked = false);
        document.getElementById('nuevoLibroError').classList.add('d-none');
    }

    new bootstrap.Modal(document.getElementById('modalNuevoLibro')).show();
}

async function abrirModalEditarLibro(libroId) {
    const res = await fetch(`/api/libros/${libroId}`);
    const libro = await res.json();

    if (!document.getElementById('modalEditarLibro')) {
        const resGeneros = await fetch(API_URLS.generos);
        const generos = await resGeneros.json();

        const checkboxesGeneros = generos.map(g => `
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" value="${g.id}" id="el_gen_${g.id}">
                <label class="form-check-label small" for="el_gen_${g.id}">${g.nombre}</label>
            </div>`).join('');

        document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="modalEditarLibro" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold">
                            <i class="bi bi-pencil-fill me-2 text-danger"></i>Editar libro
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body pt-2">
                        <input type="hidden" id="el_id">
                        <div id="editarLibroError" class="alert alert-danger d-none"></div>
                        <div class="row g-3">
                            <div class="col-8">
                                <label class="form-label small fw-semibold">Título <span class="text-danger">*</span></label>
                                <input type="text" id="el_titulo" class="form-control form-control-sm">
                            </div>
                            <div class="col-4">
                                <label class="form-label small fw-semibold">Autor <span class="text-danger">*</span></label>
                                <input type="text" id="el_autor" class="form-control form-control-sm">
                            </div>
                            <div class="col-12">
                                <label class="form-label small fw-semibold">Sinopsis <span class="text-danger">*</span></label>
                                <textarea id="el_sinopsis" class="form-control form-control-sm" rows="3" maxlength="5000"></textarea>
                            </div>
                            <div class="col-4">
                                <label class="form-label small fw-semibold">Páginas <span class="text-danger">*</span></label>
                                <input type="number" id="el_paginas" class="form-control form-control-sm" min="1">
                            </div>
                            <div class="col-4">
                                <label class="form-label small fw-semibold">Fecha publicación <span class="text-danger">*</span></label>
                                <input type="date" id="el_fecha" class="form-control form-control-sm">
                            </div>
                            <div class="col-4">
                                <label class="form-label small fw-semibold">Nueva portada <small class="text-muted">(opcional)</small></label>
                                <input type="file" id="el_portada" class="form-control form-control-sm" accept="image/*">
                            </div>
                            <div class="col-12">
                                <label class="form-label small fw-semibold">Géneros</label>
                                <div class="border rounded p-2" style="max-height:120px; overflow-y:auto">
                                    ${checkboxesGeneros}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="guardarEdicionLibro()">
                            <i class="bi bi-check-lg me-1"></i>Guardar cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>`);
    }

    // Rellenar con datos actuales
    document.getElementById('el_id').value      = libro.id;
    document.getElementById('el_titulo').value  = libro.titulo;
    document.getElementById('el_autor').value   = libro.autor;
    document.getElementById('el_sinopsis').value = libro.sinopis;
    document.getElementById('el_paginas').value = libro.paginas;
    document.getElementById('el_fecha').value   = libro.fechaPublicacion;
    document.getElementById('el_portada').value = '';
    document.getElementById('editarLibroError').classList.add('d-none');

    // Marcar géneros actuales
    document.querySelectorAll('#modalEditarLibro input[type=checkbox]').forEach(cb => cb.checked = false);
    if (libro.generos) {
        libro.generos.forEach(genero => {
            const nombre = typeof genero === 'string' ? genero : genero.nombre;
            document.querySelectorAll('#modalEditarLibro input[type=checkbox]').forEach(cb => {
                if (cb.nextElementSibling.textContent.trim() === nombre) cb.checked = true;
            });
        });
    }

    new bootstrap.Modal(document.getElementById('modalEditarLibro')).show();
}

async function guardarEdicionLibro() {
    const errorDiv = document.getElementById('editarLibroError');
    errorDiv.classList.add('d-none');

    const id       = document.getElementById('el_id').value;
    const titulo   = document.getElementById('el_titulo').value.trim();
    const autor    = document.getElementById('el_autor').value.trim();
    const sinopsis = document.getElementById('el_sinopsis').value.trim();
    const paginas  = document.getElementById('el_paginas').value;
    const fecha    = document.getElementById('el_fecha').value;
    const portada  = document.getElementById('el_portada').files[0];

    if (!titulo || !autor || !sinopsis || !paginas || !fecha) {
        errorDiv.textContent = 'Por favor, rellena todos los campos obligatorios.';
        errorDiv.classList.remove('d-none');
        return;
    }

    try {
        let nombrePortada = null;

        // Solo subir portada si se seleccionó una nueva
        if (portada) {
            const formData = new FormData();
            formData.append('file', portada);
            formData.append('titulo', titulo);
            const resPortada = await fetch('/api/libros/upload-portada', {
                method: 'POST',
                body: formData
            });
            if (!resPortada.ok) throw new Error('Error al subir la portada');
            nombrePortada = await resPortada.text();
        }

        const generosSeleccionados = [...document.querySelectorAll('#modalEditarLibro input[type=checkbox]:checked')]
            .map(cb => ({ id: parseInt(cb.value) }));

        const payload = {
            titulo, autor,
            sinopis: sinopsis,
            paginas: parseInt(paginas),
            fechaPublicacion: fecha,
            generos: generosSeleccionados
        };
        if (nombrePortada) payload.portada = nombrePortada;

        const res = await fetch(`${API_URLS.libros}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            bootstrap.Modal.getInstance(document.getElementById('modalEditarLibro')).hide();
            cargarVista('libros');
        } else {
            errorDiv.textContent = `Error del servidor (${res.status}).`;
            errorDiv.classList.remove('d-none');
        }
    } catch (e) {
        errorDiv.textContent = e.message || 'No se pudo conectar con el servidor.';
        errorDiv.classList.remove('d-none');
    }
}

async function guardarNuevoLibro() {
    const errorDiv = document.getElementById('nuevoLibroError');
    errorDiv.classList.add('d-none');

    const titulo   = document.getElementById('nl_titulo').value.trim();
    const autor    = document.getElementById('nl_autor').value.trim();
    const sinopsis = document.getElementById('nl_sinopsis').value.trim();
    const paginas  = document.getElementById('nl_paginas').value;
    const fecha    = document.getElementById('nl_fecha').value;
    const portada  = document.getElementById('nl_portada').files[0];

    if (!titulo || !autor || !sinopsis || !paginas || !fecha || !portada) {
        errorDiv.textContent = 'Por favor, rellena todos los campos obligatorios.';
        errorDiv.classList.remove('d-none');
        return;
    }

    try {
        // 1. Subir la portada primero
        const formData = new FormData();
        formData.append('file', portada);
        formData.append('titulo', titulo);
        const resPortada = await fetch('/api/libros/upload-portada', {
            method: 'POST',
            body: formData
        });
        if (!resPortada.ok) throw new Error('Error al subir la portada');
        const nombrePortada = await resPortada.text();

        // 2. Recoger géneros seleccionados
        const generosSeleccionados = [...document.querySelectorAll('#modalNuevoLibro input[type=checkbox]:checked')]
            .map(cb => ({ id: parseInt(cb.value) }));

        // 3. Crear el libro
        const payload = {
            titulo, autor,
            sinopis: sinopsis,
            paginas: parseInt(paginas),
            fechaPublicacion: fecha,
            portada: nombrePortada,
            generos: generosSeleccionados
        };

        const res = await fetch(API_URLS.libros, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            bootstrap.Modal.getInstance(document.getElementById('modalNuevoLibro')).hide();
            cargarVista('libros');
        } else {
            errorDiv.textContent = `Error del servidor (${res.status}).`;
            errorDiv.classList.remove('d-none');
        }
    } catch (e) {
        errorDiv.textContent = e.message || 'No se pudo conectar con el servidor.';
        errorDiv.classList.remove('d-none');
    }


}