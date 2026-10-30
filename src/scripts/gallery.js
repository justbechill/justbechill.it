// Native dialog provides modal semantics, Escape handling, and focus containment.
for (const gallery of document.querySelectorAll("[data-gallery]")) {
  const links = [...gallery.querySelectorAll("[data-photo]")];
  const dialog = gallery.querySelector("dialog");
  if (!dialog || typeof dialog.showModal !== "function") continue;
  const image = dialog.querySelector("[data-expanded]");
  const status = dialog.querySelector("[data-status]");
  const caption = dialog.querySelector("[data-caption-text]");
  const original = dialog.querySelector("[data-original]");
  let index = 0;
  let trigger;
  let previousOverflow;

  function show(next) {
    index = (next + links.length) % links.length;
    const link = links[index];
    image.alt = link.querySelector("img").alt;
    image.src = link.href;
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
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    image.removeAttribute("src");
    trigger?.focus({ preventScroll: true });
  });
}
