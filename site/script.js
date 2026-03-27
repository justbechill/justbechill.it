document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("photoModal");
    const modalImg = document.getElementById("expandedImg");
    const grid = document.getElementById("photo-grid");

    // FUNCTION TO OPEN MODAL
    function openModal(fullPath) {
        // Changing this to 'flex' centers the image based on our CSS
        modal.style.display = "flex"; 
        modalImg.src = fullPath;
    }

    // CLOSE LOGIC
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Ensure 'X' button also works if it exists
    const closeBtn = document.querySelector(".close");
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        };
    }

    async function loadImagesSequentially(maxCount) {
        const imagePromises = [];

        for (let i = 1; i <= maxCount; i++) {
            const imgNum = i.toString().padStart(2, '0');
            const thumbPath = `compressed/${imgNum}.webp`;
            const fullPath = `${imgNum}.jpg`;

            const promise = new Promise((resolve) => {
                const img = new Image();
                img.src = thumbPath;
                
                img.onload = () => {
                    const galleryDiv = document.createElement("div");
                    galleryDiv.className = "gallery";
                    galleryDiv.innerHTML = `<img src="${thumbPath}" alt="Japan Photo">`;
                    
                    // Trigger our updated openModal function
                    galleryDiv.onclick = () => openModal(fullPath);
                    resolve({ element: galleryDiv, index: i });
                };

                img.onerror = () => resolve(null);
            });

            imagePromises.push(promise);
        }

        const results = await Promise.all(imagePromises);

        results.forEach(result => {
            if (result && result.element) {
                grid.appendChild(result.element);
            }
        });
    }

    loadImagesSequentially(50);
});