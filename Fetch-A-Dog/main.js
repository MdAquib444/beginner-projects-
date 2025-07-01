const gallery = document.getElementById("gallery");
const breedList = document.getElementById("breedList");
const search = document.getElementById("search");
const imageOverlay = document.getElementById("imageOverlay");
const overlayImg = document.getElementById("overlayImg");
const downloadBtn = document.getElementById("downloadBtn");
const closeBtn = document.getElementById("closeBtn");

let allBreeds = [];

async function fetchBreeds() {
  const res = await fetch("https://dog.ceo/api/breeds/list/all");
  const data = await res.json();
  allBreeds = Object.keys(data.message);
  showBreedTags(allBreeds);
}

function showBreedTags(breeds) {
  breedList.innerHTML = "";
  breeds.forEach((breed) => {
    const btn = document.createElement("button");
    btn.textContent = breed;
    btn.onclick = () => fetchImagesByBreed(breed);
    breedList.appendChild(btn);
  });
}

async function fetchImagesByBreed(breed) {
  const res = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
  const data = await res.json();
  renderImages(data.message.slice(0, 20)); // limit for UI
}

async function fetchRandomImages() {
  const res = await fetch("https://dog.ceo/api/breeds/image/random/20");
  const data = await res.json();
  renderImages(data.message);
}

function renderImages(images) {
  gallery.innerHTML = "";
  images.forEach((url) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Dog";
    img.onclick = () => openOverlay(url);
    gallery.appendChild(img);
  });
}

function openOverlay(url) {
  overlayImg.src = url;
  downloadBtn.href = url;
  imageOverlay.classList.remove("hidden");
}

function closeOverlay() {
  imageOverlay.classList.add("hidden");
}

search.addEventListener("input", () => {
  const term = search.value.toLowerCase();
  const filtered = allBreeds.filter((b) => b.includes(term));
  showBreedTags(filtered);
});

closeBtn.addEventListener("click", closeOverlay);
imageOverlay.addEventListener("click", (e) => {
  if (e.target === imageOverlay) closeOverlay();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeOverlay();
});

// Init
fetchBreeds();
fetchRandomImages();