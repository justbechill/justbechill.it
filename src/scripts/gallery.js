// Native dialog provides modal semantics, Escape handling, and focus containment.
for (const gallery of document.querySelectorAll("[data-gallery]")) {
  const links = [...gallery.querySelectorAll("[data-photo]")];
  const grid = gallery.querySelector(".photo-grid");
  if (grid) {
    const figures = [...grid.querySelectorAll("figure")];
    function centerColumns() {
      if (!figures.length) return;
      // Multicolumn balancing can leave trailing columns empty.
      grid.style.setProperty("--gallery-offset", "0px");
      const bounds = grid.getBoundingClientRect();
      const occupied = figures.map(figure => figure.getBoundingClientRect());
      const left = Math.min(...occupied.map(rect => rect.left));
      const right = Math.max(...occupied.map(rect => rect.right));
      const offset = (bounds.left + bounds.right - left - right) / 2;
      grid.style.setProperty("--gallery-offset", `${offset}px`);
    }
    new ResizeObserver(centerColumns).observe(grid);
    grid.addEventListener("load", centerColumns, true);
    centerColumns();
  }
  const dialog = gallery.querySelector("dialog");
  if (!dialog || typeof dialog.showModal !== "function") continue;
  let image = dialog.querySelector("[data-expanded]");
  let pendingImage;
  const status = dialog.querySelector("[data-status]");
  const caption = dialog.querySelector("[data-caption-text]");
  const original = dialog.querySelector("[data-original]");
  let index = 0;
  let trigger;
  let previousOverflow;

  function show(next) {
    index = (next + links.length) % links.length;
    const link = links[index];
    const thumbnail = link.querySelector("img");
    const preview = image.cloneNode(false);
    preview.alt = thumbnail.alt;
    preview.src = thumbnail.currentSrc || thumbnail.src;
    image.replaceWith(preview);
    image = preview;

    // Switch photos immediately; upgrade only the currently selected preview.
    if (pendingImage) {
      pendingImage.onload = null;
      pendingImage.removeAttribute("src");
    }
    const fullImage = new Image();
    pendingImage = fullImage;
    fullImage.onload = () => {
      if (image === preview && dialog.open) {
        preview.src = fullImage.src;
      }
      if (pendingImage === fullImage) pendingImage = undefined;
    };
    fullImage.src = link.href;
    original.href = link.href;
    caption.textContent = link.dataset.caption;
    status.textContent = `${index + 1} / ${links.length}`;
  }
  links.forEach((link, i) =>
    link.addEventListener("click", (event) => {
      // Preserve opening the original in a new tab and the no-JS fallback.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      trigger = link;
      show(i);
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();
      dialog.querySelector("[data-close]").focus();
    }),
  );
  dialog
    .querySelector("[data-close]")
    .addEventListener("click", () => dialog.close());
  dialog
    .querySelector("[data-previous]")
    .addEventListener("click", () => show(index - 1));
  dialog
    .querySelector("[data-next]")
    .addEventListener("click", () => show(index + 1));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(index + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  dialog.addEventListener("click", (event) => {
    if (!event.target.closest("img, button, a")) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    if (pendingImage) {
      pendingImage.onload = null;
      pendingImage.removeAttribute("src");
      pendingImage = undefined;
    }
    image.removeAttribute("src");
    trigger?.focus({ preventScroll: true });
  });
}
