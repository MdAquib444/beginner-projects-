const breedTags = document.getElementById("breed-tags");
const imageGrid = document.getElementById("image-grid");
const searchInput = document.getElementById("search");
const overlay = document.getElementById("overlay");
const overlayImg = document.getElementById("overlay-img");
const overlayInfo = document.getElementById("overlay-info");
const downloadBtn = document.getElementById("download-btn");
const closeBtn = document.getElementById("close-btn");

let allBreeds = [];
let isLoading = false;
let currentBreed = "";

fetch("https://dog.ceo/api/breeds/list/all")
  .then(res => res.json())
  .then(data => {
    allBreeds = Object.keys(data.message);
    renderBreeds(allBreeds);
    loadImages();
  });

function renderBreeds(breeds) {
  breedTags.innerHTML = "";
  breeds.forEach(breed => {
    const btn = document.createElement("button");
    btn.textContent = breed;
    btn.onclick = () => {
      currentBreed = breed;
      imageGrid.innerHTML = "";
      loadImages();
    };
    breedTags.appendChild(btn);
  });
}

function loadImages() {
  if (isLoading) return;
  isLoading = true;

  for (let i = 0; i < 10; i++) createSkeleton();

  const url = currentBreed
    ? `https://dog.ceo/api/breed/${currentBreed}/images/random/10`
    : `https://dog.ceo/api/breeds/image/random/10`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      data.message.forEach(url => renderImage(url));
      isLoading = false;
    });
}

function renderImage(url) {
  const card = document.createElement("div");
  card.className = "dog-card";

  const skeleton = document.createElement("div");
  skeleton.className = "skeleton";
  card.appendChild(skeleton);

  const img = document.createElement("img");
  img.className = "dog-img";
  img.src = url;
  img.onload = () => {
    skeleton.remove();
    img.style.display = "block";
  };
  img.onclick = () => showOverlay(url);

  card.appendChild(img);
  imageGrid.appendChild(card);
}

function createSkeleton() {
  const skeleton = document.createElement("div");
  skeleton.className = "dog-card skeleton";
  imageGrid.appendChild(skeleton);
}

function showOverlay(url) {
  overlay.style.display = "flex";
  overlayImg.src = url;
  overlayInfo.textContent = url;
  downloadBtn.onclick = () => downloadImage(url);
}

function downloadImage(url) {
  const link = document.createElement("a");
  link.href = url;
  link.download = "dog.jpg";
  link.click();
}

closeBtn.onclick = () => {
  overlay.style.display = "none";
};

searchInput.oninput = () => {
  const q = searchInput.value.toLowerCase();
  const filtered = allBreeds.filter(b => b.includes(q));
  renderBreeds(filtered);
};

// Infinite scroll
window.onscroll = () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !isLoading
  ) {
    loadImages();
  }
};