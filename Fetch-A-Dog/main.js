const gallery = document.getElementById('gallery');
const breedTags = document.getElementById('breedTags');
const search = document.getElementById('search');
const overlay = document.getElementById('imageOverlay');
const overlayImg = document.getElementById('overlayImg');
const downloadBtn = document.getElementById('downloadBtn');
const closeBtn = document.getElementById('closeBtn');

let breedList = [];
let currentBreed = '';
let loading = false;

// Fetch breed list on load
fetch('https://dog.ceo/api/breeds/list/all')
  .then(res => res.json())
  .then(data => {
    breedList = Object.keys(data.message);
    renderTags(breedList);
    loadRandomImages();
  });

// Render breed tags
function renderTags(breeds) {
  breedTags.innerHTML = '';
  breeds.forEach(breed => {
    const btn = document.createElement('button');
    btn.innerText = breed;
    btn.onclick = () => {
      currentBreed = breed;
      gallery.innerHTML = '';
      loadBreedImages(breed);
    };
    breedTags.appendChild(btn);
  });
}

// Load random dog images
function loadRandomImages() {
  loading = true;
  fetch('https://dog.ceo/api/breeds/image/random/20')
    .then(res => res.json())
    .then(data => {
      data.message.forEach(showImage);
      loading = false;
    });
}

// Load breed-specific images
function loadBreedImages(breed) {
  loading = true;
  fetch(`https://dog.ceo/api/breed/${breed}/images`)
    .then(res => res.json())
    .then(data => {
      data.message.slice(0, 20).forEach(showImage);
      loading = false;
    });
}

// Show image on UI
function showImage(url) {
  const img = document.createElement('img');
  img.src = url;
  img.onclick = () => showOverlay(url);
  gallery.appendChild(img);
}

// Show image overlay
function showOverlay(url) {
  overlayImg.src = url;
  downloadBtn.href = url;
  overlay.classList.remove('hidden');
}

// Close overlay
closeBtn.onclick = () => {
  overlay.classList.add('hidden');
};

// Filter breeds on search
search.addEventListener('input', () => {
  const value = search.value.toLowerCase();
  const filtered = breedList.filter(b => b.includes(value));
  renderTags(filtered);
});

// Infinite scroll
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
    if (currentBreed) {
      loadBreedImages(currentBreed);
    } else {
      loadRandomImages();
    }
  }
});