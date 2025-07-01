const gallery = document.getElementById("gallery");
const breedTags = document.getElementById("breedTags");
const searchInput = document.getElementById("searchInput");

const imageOverlay = document.getElementById("imageOverlay");
const overlayImage = document.getElementById("overlayImage");
const imageURL = document.getElementById("imageURL");
const downloadBtn = document.getElementById("downloadBtn");
const closeBtn = document.getElementById("closeBtn");

// Fetch all breeds
async function loadBreeds() {
  const res = await fetch("https://dog.ceo/api/breeds/list/all");
  const data = await res.json();
  const breeds = Object.keys(data.message);
  breeds.forEach(breed => {
    const btn = document.createElement("button");
    btn.textContent = breed;
    btn.onclick = () => loadBreedImages(breed);
    breedTags.appendChild(btn);
  });
}

// Load random images (mix)
async function loadRandomImages() {
  const res = await fetch("https://dog.ceo/api/breeds/image/random/20");
  const data = await res.json();
  showImages(data.message);
}

// Load images for a specific breed
async function loadBreedImages(breed) {
  const res = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
  const data = await res.json();
  showImages(data.message.slice(0, 20));
}

// Show images in gallery
function showImages(images) {
  gallery.innerHTML = "";
  images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Dog";
    img.onclick = () => showOverlay(url);
    gallery.appendChild(img);
  });
}

// Show overlay with image and download
function showOverlay(url) {
  imageOverlay.classList.remove("hidden");
  overlayImage.src = url;
  imageURL.textContent = url;
  downloadBtn.onclick = () => downloadImage(url);
}

// Download handler
function downloadImage(url) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "dog.jpg";
  a.click();
}

// Close overlay
closeBtn.onclick = () => {
  imageOverlay.classList.add("hidden");
};

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const buttons = breedTags.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.style.display = btn.textContent.toLowerCase().includes(query)
      ? "inline-block"
      : "none";
  });
});

// Initialize
loadBreeds();
loadRandomImages();