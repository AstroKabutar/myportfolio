const EMPTY_COVER = "src/clicks/cover_empty.jpg";

const categories = [
  {
    key: "astrophotography",
    title: "Astrophotography",
    folder: "src/clicks/astrophotgraphy",
    images: ["Moon2.jpg", "Moon.jpg", "Orion.jpg", "Polaris.jpg", "Star_Trails.jpg"]
  },
  {
    key: "landscape",
    title: "Landscape",
    folder: "src/clicks/landscape",
    images: []
  },
  {
    key: "lightpainting",
    title: "Light Painting",
    folder: "src/clicks/lightpainting",
    images: [
      "DSC00766.jpg",
      "DSC00767.jpg",
      "DSC00768.jpg",
      "DSC00772.jpg",
      "DSC00806.jpg",
      "DSC01074.jpg",
      "DSC01099.jpg"
    ]
  },
  {
    key: "miscellaneous",
    title: "Miscellaneous",
    folder: "src/clicks/miscellaneous",
    images: []
  }
];

const byKey = Object.fromEntries(categories.map((category) => [category.key, category]));

// Customize names and descriptions here whenever you want.
const photoDetails = {
  astrophotography: {
    "Moon2.jpg": { name: "Moon", description: "Took this photo with my 250mm lense with even lower exposure." },
    "Moon.jpg": { name: "Moon", description: "The same moon photo but with a bit more exposure for brightness to play around the lense." },
    "Orion.jpg": { name: "Orion", description: "I took a picture of Orion and if I remember well it was a stacked photo of 10 images. It was a long time ago." },
    "Polaris.jpg": { name: "Polaris", description: "About 1.5 hours of exposure with 16mm lense with 30 seconds exposure for each image. I messed up my shooting cauisng these wavy lines." },
    "Star_Trails.jpg": { name: "Star Trails", description: "This was my very first long exposure with 16mm stacked images, 30 seconds each image exposure. Don't remember exactly the total time it took." }
  },
  lightpainting: {
    "DSC00766.jpg": { name: "Plyaing with torch light 1", description: "While taking long exposure photos of sky I by mistake turned on the torch light and found out the light got printed so I started to play with it." },
    "DSC00767.jpg": { name: "Plyaing with torch light 2", description: "Testing out how far I can take this XD." },
    "DSC00768.jpg": { name: "Wavy floor painting with light", description: "I call it wavy light on the floor." },
    "DSC00772.jpg": { name: "Ghost steps", description: "Woooo, am I the only one seeing ghost steps?" },
    "DSC00806.jpg": { name: "Halo Light Painting while sitting", description: "The god has decended upon earth." },
    "DSC01074.jpg": { name: "Halo Light Painting while standing", description: "Person standing with halo light behind." },
    "DSC01099.jpg": { name: "Halo Light Painting while standing different person", description: "Person standing with halo light behind." }
  },
  landscape: {},
  miscellaneous: {}
};

function toText(fileName) {
  const trimmed = fileName.replace(/\.[^.]+$/, "");
  return trimmed.replace(/[_-]+/g, " ").trim();
}

function getPhotoMeta(categoryKey, fileName) {
  const custom = photoDetails[categoryKey]?.[fileName];
  if (custom) {
    return custom;
  }

  const auto = toText(fileName);
  return {
    name: auto,
    description: "Add your custom description here."
  };
}

function renderCategoryPage() {
  const container = document.getElementById("categoryGrid");
  if (!container) return;

  container.innerHTML = categories
    .map((category) => {
      const isEmpty = category.images.length === 0;
      const preview = isEmpty
        ? EMPTY_COVER
        : `${category.folder}/${category.images[0]}`;
      const href = isEmpty
        ? "#"
        : `photography-gallery.html?category=${encodeURIComponent(category.key)}`;
      const stateLabel = isEmpty ? "Empty folder" : `${category.images.length} image(s)`;
      const clickLabel = isEmpty ? "No photos yet" : "Open gallery";

      return `
        <a class="category-card ${isEmpty ? "empty" : ""}" href="${href}" ${isEmpty ? 'aria-disabled="true"' : ""}>
          <div class="card-image">
            <img src="${preview}" alt="${category.title} cover image">
          </div>
          <h2 class="card-title">${category.title}</h2>
          <p class="card-meta">${stateLabel}</p>
          <span class="card-pill">${clickLabel}</span>
        </a>
      `;
    })
    .join("");

  container.querySelectorAll(".category-card.empty").forEach((emptyCard) => {
    emptyCard.addEventListener("click", (event) => event.preventDefault());
  });
}

function renderGalleryPage() {
  const grid = document.getElementById("photoGrid");
  const titleNode = document.getElementById("galleryTitle");
  const metaNode = document.getElementById("galleryMeta");
  if (!grid || !titleNode || !metaNode) return;

  const params = new URLSearchParams(window.location.search);
  const categoryKey = params.get("category") || "";
  const category = byKey[categoryKey];

  if (!category || category.images.length === 0) {
    titleNode.textContent = "Category unavailable";
    metaNode.textContent = "This category is empty or does not exist.";
    grid.innerHTML = `
      <article class="photo-card">
        <img src="${EMPTY_COVER}" alt="Empty category cover image">
        <p class="photo-description">No photos found in this category.</p>
      </article>
    `;
    return;
  }

  titleNode.textContent = category.title;
  metaNode.textContent = `${category.images.length} photo(s)`;

  grid.innerHTML = category.images
    .map((file) => {
      const src = `${category.folder}/${file}`;
      const meta = getPhotoMeta(category.key, file);
      return `
        <article class="photo-card">
          <img class="gallery-photo" src="${src}" alt="${meta.name}" data-full-src="${src}" data-name="${meta.name}">
          <h3 class="photo-name">${meta.name}</h3>
          <p class="photo-description">${meta.description}</p>
        </article>
      `;
    })
    .join("");

  setupLightbox();
}

function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.getElementById("lightboxClose");
  const photos = document.querySelectorAll(".gallery-photo");
  if (!lightbox || !lightboxImage || !closeButton || photos.length === 0) return;

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
  }

  photos.forEach((photo) => {
    photo.addEventListener("click", () => {
      lightboxImage.src = photo.dataset.fullSrc || photo.src;
      lightboxImage.alt = photo.dataset.name || "Photo preview";
      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}

function setupImageProtection() {
  // Block common quick-save actions on images.
  document.addEventListener("contextmenu", (event) => {
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  });

  document.addEventListener("dragstart", (event) => {
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  });
}

renderCategoryPage();
renderGalleryPage();
setupImageProtection();
