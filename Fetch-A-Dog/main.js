const imageContainer = document.getElementById("imageContainer");
const breedList = document.getElementById("breedList");
const searchInput = document.getElementById("searchInput");
const imageOverlay = document.getElementById("imageOverlay");
const overlayImage = document.getElementById("overlayImage");
const imageURL = document.getElementById("imageURL");
const downloadBtn = document.getElementById("downloadBtn");
const closeBtn = document.getElementById("closeBtn");

// Fetch breeds and populate scroll tags
fetch("https://dog.ceo/api/breeds/list/all")
  .then(res => res.json())
  .then(data => {
    const breeds = Object.keys(data.message);
    breeds.forEach(breed => {
      const button = document.createElement("button");
      button.textContent = breed;
      button.onclick = () => loadBreedImages(breed);
      breedList.appendChild(button);
    });
  });

// Load random images on page load
loadRandomImages();

function loadRandomImages() {
  fetch("https://dog.ceo/api/breeds/image/random/20")
    .then(res => res.json())
    .then(data => renderImages(data.message));
}

function loadBreedImages(breed) {
  fetch(`https://dog.ceo/api/breed/${breed}/images/random/20`)
    .then(res => res.json())
    .then(data => renderImages(data.message));
}

function renderImages(images) {
  imageContainer.innerHTML = "";
  images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Dog image";
    img.onclick = () => showOverlay(url);
    imageContainer.appendChild(img);
  });
}

function showOverlay(url) {
  imageOverlay.classList.remove("hidden");
  overlayImage.src = url;
  imageURL.textContent = url;
  downloadBtn.onclick = () => downloadImage(url);
}

closeBtn.onclick = () => {
  imageOverlay.classList.add("hidden");
};

function downloadImage(url) {
  const link = document.createElement("a");
  link.href = url;
  link.download = "dog-image.jpg";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Search breeds
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const buttons = breedList.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.style.display = btn.textContent.toLowerCase().includes(query)
      ? "inline-block"
      : "none";
  });
});