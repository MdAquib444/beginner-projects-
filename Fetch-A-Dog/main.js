const imageContainer = document.getElementById("imageContainer");
const breedTagsContainer = document.getElementById("breedTagsContainer");
const searchInput = document.getElementById("searchInput");

let allBreeds = {};

// Load all breeds
async function fetchBreeds() {
  const res = await fetch("https://dog.ceo/api/breeds/list/all");
  const data = await res.json();
  allBreeds = data.message;
  showBreedTags();
}

// Show breed tags horizontally
function showBreedTags() {
  for (let breed in allBreeds) {
    const btn = document.createElement("button");
    btn.textContent = breed;
    btn.onclick = () => loadBreedImages(breed);
    breedTagsContainer.appendChild(btn);
  }
}

// Load images of a specific breed
async function loadBreedImages(breed) {
  clearImages();
  const res = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
  const data = await res.json();
  renderImages(data.message);
}

// Load random images on page load
async function loadRandomDogs() {
  clearImages();
  const res = await fetch("https://dog.ceo/api/breeds/image/random/30");
  const data = await res.json();
  renderImages(data.message);
}

// Render images to grid
function renderImages(images) {
  images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    imageContainer.appendChild(img);
  });
}

// Clear current images
function clearImages() {
  imageContainer.innerHTML = "";
}

// Search for a breed
function searchBreed() {
  const query = searchInput.value.toLowerCase();
  if (query && allBreeds[query]) {
    loadBreedImages(query);
  } else {
    alert("Breed not found!");
  }
}

// Initial load
fetchBreeds();
loadRandomDogs();