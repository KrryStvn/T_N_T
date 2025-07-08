document.addEventListener("DOMContentLoaded", () => {
    const placeholder = document.getElementById("sidebar-placeholder");

    fetch("sidebar.html")
        .then(response => response.text())
        .then(html => {
            placeholder.innerHTML = html;

            // Resaltar el ítem activo
            const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
            const links = placeholder.querySelectorAll(".nav-link");

            links.forEach(link => {
                if (link.dataset.page === currentPage) {
                    link.classList.add("active");
                }
            });
        });
});
