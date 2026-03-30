document.addEventListener("DOMContentLoaded", () => {


    const toggleSort = document.getElementById("toggleSort");
    const sortForm = document.getElementById("sortForm");

    if (toggleSort && sortForm) {
        toggleSort.addEventListener("click", () => {
            sortForm.classList.toggle("active");
        });
    }


    const toggleFilter = document.querySelector(".toggle-filter-menu");
    const filterForm = document.querySelector(".filter-form");

    if (toggleFilter && filterForm) {
        toggleFilter.addEventListener("click", () => {
            filterForm.classList.toggle("active");
        });
    }

});


function applySort() {
    const selected = document.querySelector("input[name='sort']:checked");

    if (!selected) {
        alert("Selecciona un tipo de orden");
        return;
    }

    console.log("Orden seleccionado:", selected.value);
}


function resetSort() {
    document.querySelectorAll("input[name='sort']")
        .forEach(r => r.checked = false);
}


function getFilters() {
    const checkboxes = document.querySelectorAll(".filter-menu input[type='checkbox']:checked");

    const values = Array.from(checkboxes).map(cb => cb.value);

    console.log("Filtros:", values);
}