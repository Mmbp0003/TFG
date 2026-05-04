document.addEventListener("DOMContentLoaded", () => {


    document.querySelectorAll(".book-item").forEach(book => {

        book.addEventListener("click", () => {

            const bookId = book.dataset.id;

            if (!bookId) {
                console.error("El libro no tiene data-id");
                return;
            }

            // Guardar libro seleccionado (opcional)
            localStorage.setItem("selectedBook", bookId);

            // Ir a página de libro
            window.location.href = `Libro.html?id=${bookId}`;
        });

    });

});