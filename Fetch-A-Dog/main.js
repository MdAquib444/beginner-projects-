const breedList = document.getElementById("breedList");
const imageContainer = document.getElementById("imageContainer");
const searchInput = document.getElementById("searchInput");

const overlay = document.getElementById("imageOverlay");
const overlayImg = document.getElementById("overlayImage");
const imageURLText = document.getElementById("imageURL");
const closeBtn = document.getElementById("closeBtn");
const downloadBtn = document.getElementById("downloadBtn");

// Load breeds
fetch("https://dog.ceo/api/breeds/list/all")
  .then(res => res.json())
  .then(data => {
    const breeds = Object.keys(data.message);
    breeds.forEach(breed => {
      const btn = document.createElement("button");
      btn.textContent = breed;
      btn.onclick = () => loadBreedImages(breed);
      breedList.appendChild(btn);
    });
  });

// Load initial random images
loadRandomImages();

// Search filter
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const buttons = breedList.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.style.display = btn.textContent.toLowerCase().includes(term)
      ? "inline-block"
      : "none";
  });
});

// Load breed-specific images
function loadBreedImages(breed) {
  fetch(`https://dog.ceo/api/breed/${breed}/images`)
    .then(res => res.json())
    .then(data => {
      imageContainer.innerHTML = "";
      renderImages(data.message);
    });
}

// Load random/mixed images
function loadRandomImages() {
  fetch("https://dog.ceo/api/breeds/image/random/30")
    .then(res => res.json())
    .then(data => {
      imageContainer.innerHTML = "";
      renderImages(data.message);
    });
}

// Render image grid
function renderImages(images) {
  images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Dog Image";
    img.onclick = () => openOverlay(url);
    imageContainer.appendChild(img);
  });
}

// Overlay open
function openOverlay(url) {
  overlay.classList.remove("hidden");
  overlayImg.src = url;
  imageURLText.textContent = url;
  downloadBtn.onclick = () => downloadImage(url);
}

// Close overlay
closeBtn.onclick = () => {
  overlay.classList.add("hidden");
};

// Download handler
function downloadImage(url) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "dog.jpg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}