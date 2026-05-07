const libros = [
    { titulo: "El nombre del viento", autor: "Patrick Rothfuss" },
    { titulo: "El temor de un hombre sabio", autor: "Patrick Rothfuss" },
    { titulo: "Harry Potter", autor: "J.K. Rowling" },
    { titulo: "El señor de los anillos", autor: "Tolkien" },
    { titulo: "Dune", autor: "Frank Herbert" },
    { titulo: "1984", autor: "George Orwell" }
];

const input = document.getElementById("searchInput");
const results = document.getElementById("results");

input.addEventListener("input", () => {

    const value = input.value.toLowerCase().trim();

    results.innerHTML = "";

    if (value === "") return;

    const filtered = libros.filter(libro =>
        libro.titulo.toLowerCase().includes(value)
    );

    filtered.forEach(libro => {

        const div = document.createElement("div");
        div.classList.add("result-item");

        div.innerHTML = `
            <div>
                <div class="result-title">${libro.titulo}</div>
                <div class="result-author">${libro.autor}</div>
            </div>
            <i class="bi bi-book"></i>
        `;


        if (libro.titulo === "El nombre del viento") {
            div.style.cursor = "pointer";

            div.addEventListener("click", () => {
                window.location.href = "Libro.html";
            });
        }

        results.appendChild(div);
    });
});