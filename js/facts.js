document.addEventListener("DOMContentLoaded", () => {

    const videoSources = [
        "/Session1/public/videos/5ecd9jUFWr0.mp4",
        "/Session1/public/videos/asdTucUqJbE.ia.mp4",
        "/Session1/public/videos/B4XftW6Tfu8.ia.mp4",
        "/Session1/public/videos/BYrurcHkzMk.ia.mp4",
        "/Session1/public/videos/Minneapolis_Minute_June_26_2017.HD.mov",
        "/Session1/public/videos/P7tUAf7UPf8.ia.mp4",
        "/Session1/public/videos/pVbjDtE43MQ.ia.mp4"
    ];

  
    const gallery = document.createElement("div");
    gallery.id = "videoGallery";
    document.querySelector(".training-block").prepend(gallery);

    videoSources.forEach(src => {
        let card = document.createElement("div");
        card.className = "video-card";

        card.innerHTML = `
            <video muted>
                <source src="${src}" type="video/mp4">
            </video>
        `;

     
        card.onclick = () => openVideoModal(src);

        gallery.appendChild(card);
    });


   
    const modal = document.createElement("div");
    modal.id = "videoModal";
    modal.innerHTML = `
        <div id="closeModal">X</div>
        <video id="modalVideo" controls></video>
    `;
    document.body.appendChild(modal);

    document.getElementById("closeModal").onclick = () => {
        modal.style.display = "none";
        document.getElementById("modalVideo").pause();
    };

    function openVideoModal(src) {
        const modalVideo = document.getElementById("modalVideo");
        modalVideo.src = src;
        modal.style.display = "flex";
        modalVideo.play();
    }
});


document.addEventListener("click", function (e) {
    if (e.target.tagName === "IMG" && e.target.closest(".training-block")) {
        let src = e.target.src;

        let overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0,0,0,0.8)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.cursor = "zoom-out";

        let img = document.createElement("img");
        img.src = src;
        img.style.maxWidth = "80%";
        img.style.borderRadius = "12px";

        overlay.appendChild(img);
        document.body.appendChild(overlay);

        overlay.onclick = () => overlay.remove();
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".pdf-grid a");

    links.forEach(link => {
        if (!link.textContent.trim()) {
            link.remove();
        }
    });
});
