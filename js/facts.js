document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".facts-block");
    const videoSources = [
        <img src="factsdocument/2 (1).bmp" width="200" alt="image">
            <img src="factsdocument/2 (10).bmp" width="200" alt="image">
            <img src="factsdocument/2 (11).bmp" width="200" alt="image">
            <img src="factsdocument/2 (12).bmp" width="200" alt="image">
            <img src="factsdocument/2 (13).bmp" width="200" alt="image">
            <img src="factsdocument/2 (14).bmp" width="200" alt="image">
            <img src="factsdocument/2 (15).bmp" width="200" alt="image">
            <img src="factsdocument/2 (16).bmp" width="200" alt="image">
            <img src="factsdocument/2 (17).bmp" width="200" alt="image">
            <img src="factsdocument/2 (19).bmp" width="200" alt="image">
            <img src="factsdocument/2 (20).bmp" width="200" alt="image">
            <img src="factsdocument/2 (21).bmp" width="200" alt="image">
            <img src="factsdocument/2 (21).bmp" width="200" alt="image">
            <img src="factsdocument/2 (22).bmp" width="200" alt="image">
            <img src="factsdocument/2 (23).bmp" width="200" alt="image">
            <img src="factsdocument/2 (24).bmp" width="200" alt="image">
            <img src="factsdocument/2 (25).bmp" width="200" alt="image">
            <img src="factsdocument/2 (26).bmp" width="200" alt="image">
            <img src="factsdocument/2 (27).bmp" width="200" alt="image">
            <img src="factsdocument/2 (28).bmp" width="200" alt="image">
            <img src="factsdocument/2 (29).bmp" width="200" alt="image">
            <img src="factsdocument/2 (30).bmp" width="200" alt="image">
            <img src="factsdocument/2 (3).bmp" width="200" alt="image">
            <img src="factsdocument/2 (4).bmp" width="200" alt="image">
            <img src="factsdocument/2 (5).bmp" width="200" alt="image">
            <img src="factsdocument/2 (5).jpg" width="200" alt="image">
            <img src="factsdocument/2 (4).jpg" width="200" alt="image">
            <img src="factsdocument/2 (5).bmp" width="200" alt="image">
            <img src="factsdocument/2 (5).bmp" width="200" alt="image">
            <img src="factsdocument/2 (6).bmp" width="200" alt="image">
            <img src="factsdocument/2 (7).bmp" width="200" alt="image">
            <img src="factsdocument/2 (8).bmp" width="200" alt="image">
            <img src="factsdocument/2 (9).bmp" width="200" alt="image">
            <img src="factsdocument/IMG-20260502-WA0012.jpg" width="200" alt="image">
            <img src="factsdocument/IMG-20260502-WA0013.jpg" width="200" alt="image">
            <img src="factsdocument/Screenshot_20260425_183313_Chrome.jpg" width="200" alt="image">
            <img src="factsdocument/Screenshot_20260425_183630_Chrome.jpg" width="200" alt="image">
            <img src="factsdocument/Screenshot_20260425_183630_Chrome.jpg" width="200" alt="image">
            <img src="factsdocument/Screenshot_20260425_183630_Chrome.jpg" width="200" alt="image">"
    ];

    if (container) {
        const gallery = document.createElement("div");
        gallery.id = "videoGallery";
        container.prepend(gallery);

        videoSources.forEach(src => {
            let card = document.createElement("div");
            card.className = "video-card";
            card.innerHTML = `<video muted><source src="${src}" type="video/mp4"></video>`;
            card.onclick = () => openVideoModal(src);
            gallery.appendChild(card);
        });
    }

    // 2. Video Modal
    const modal = document.createElement("div");
    modal.id = "videoModal";
    modal.innerHTML = `<div id="closeModal">X</div><video id="modalVideo" controls></video>`;
    document.body.appendChild(modal);

    document.getElementById("closeModal").onclick = () => {
        modal.style.display = "none";
        document.getElementById("modalVideo").pause();
    };

    function openVideoModal(src) {
        const mv = document.getElementById("modalVideo");
        mv.src = src;
        modal.style.display = "flex";
        mv.play();
    }

    // 3. Şəkillərin böyüdülməsi (Sənin HTML-dəki bütün img-lər üçün)
    document.addEventListener("click", (e) => {
        if (e.target.tagName === "IMG" && e.target.closest(".facts-block")) {
            let overlay = document.createElement("div");
            overlay.className = "img-overlay";
            overlay.innerHTML = `<img src="${e.target.src}">`;
            document.body.appendChild(overlay);
            overlay.onclick = () => overlay.remove();
        }
    });

    // 4. PDF Linklərini təmizlə
    document.querySelectorAll(".pdf-grid a").forEach(link => {
        if (!link.textContent.trim()) link.remove();
    });
});
