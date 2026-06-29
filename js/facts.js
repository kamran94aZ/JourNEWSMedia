document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (e) => {
        if (e.target.tagName === "IMG" && e.target.closest(".facts-block")) {
            let overlay = document.createElement("div");
            overlay.className = "img-overlay";
            overlay.innerHTML = `<img src="${e.target.src}">`;
            document.body.appendChild(overlay);
            overlay.onclick = () => overlay.remove();
        }
    });

    document.querySelectorAll(".pdf-grid a").forEach(link => {
        if (!link.textContent.trim()) {
            link.remove();
        }
    });
});
