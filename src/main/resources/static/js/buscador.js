const input = document.getElementById("searchInput");
const results = document.getElementById("results");

input.addEventListener("input", () => {
    const value = input.value.trim();
    results.innerHTML = "";
    if (value === "") return;

    fetch(`/api/libros/buscarInteligente?titulo=${encodeURIComponent(value)}`, { credentials: "include" })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(libros => {
            if (libros.length === 0) {
                results.innerHTML = "<p class='text-muted ps-2'>No se encontraron libros</p>";
                return;
            }

            libros.forEach(libro => {
                const div = document.createElement("div");
                div.classList.add("result-item");
                div.style.cursor = "pointer";

                div.innerHTML = `
                    <div>
                        <div class="result-title">${libro.titulo}</div>
                        <div class="result-author">${libro.autor}</div>
                    </div>
                    <i class="bi bi-book"></i>
                `;

                div.addEventListener("click", () => {
                    window.location.href = `../Vistas/Libro.html`;
                });

                results.appendChild(div);
            });
        })
        .catch(err => {
            console.error(err);
            results.innerHTML = `<p class='text-danger'>Error al buscar: ${err.message}</p>`;
        });
});