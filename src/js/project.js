(function setupProjectMediaLightbox() {
  const lightbox = document.getElementById("mediaLightbox");
  const closeBtn = document.getElementById("mediaLightboxClose");
  const imgEl = document.getElementById("mediaLightboxImage");
  const openers = document.querySelectorAll(".project-media-open");

  if (!lightbox || !closeBtn || !imgEl || openers.length === 0) return;

  let lastOpener = null;

  function setExpanded(opener, value) {
    if (opener) opener.setAttribute("aria-expanded", value ? "true" : "false");
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    imgEl.hidden = true;
    imgEl.src = "";
    imgEl.alt = "";
    setExpanded(lastOpener, false);
    lastOpener = null;
  }

  function openImage(src, alt) {
    imgEl.hidden = false;
    imgEl.src = src;
    imgEl.alt = alt || "Project preview";
  }

  openers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      lastOpener = btn;
      const fullSrc = btn.dataset.fullSrc;
      const label = btn.dataset.mediaLabel || "Project preview";
      if (!fullSrc) return;
      openImage(fullSrc, label);
      lightbox.setAttribute("aria-label", "Image preview");
      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      setExpanded(btn, true);
      document.body.style.overflow = "hidden";
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
})();
