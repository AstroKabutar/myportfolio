const glassBoxes = document.querySelectorAll(".top-links-group .top-link-box");

const setGlowPosition = (box, event) => {
  const rect = box.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  box.style.setProperty("--glow-x", `${x}%`);
  box.style.setProperty("--glow-y", `${y}%`);
};

glassBoxes.forEach((box) => {
  box.addEventListener("mouseenter", () => {
    box.classList.add("is-glow-active");
  });

  box.addEventListener("mousemove", (event) => {
    setGlowPosition(box, event);
  });

  box.addEventListener("mouseleave", () => {
    box.classList.remove("is-glow-active");
    box.style.setProperty("--glow-x", "50%");
    box.style.setProperty("--glow-y", "50%");
  });
});
