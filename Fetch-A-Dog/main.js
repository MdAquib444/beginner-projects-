const breedSelect = document.getElementById('breedSelect');
const subBreedSelect = document.getElementById('subBreedSelect');
const imageContainer = document.getElementById('imageContainer');

// Load breed list on page load
window.onload = () => {
  fetch('https://dog.ceo/api/breeds/list/all')
    .then(res => res.json())
    .then(data => {
      const breeds = data.message;
      for (const breed in breeds) {
        const option = document.createElement('option');
        option.value = breed;
        option.textContent = breed;
        breedSelect.appendChild(option);
      }
    });
};

// On breed change, check sub-breeds
breedSelect.addEventListener('change', () => {
  const breed = breedSelect.value;
  if (!breed) return;

  fetch(`https://dog.ceo/api/breed/${breed}/list`)
    .then(res => res.json())
    .then(data => {
      const subBreeds = data.message;
      subBreedSelect.innerHTML = `<option value="">-- Select Sub-breed --</option>`;
      if (subBreeds.length > 0) {
        subBreeds.forEach(sb => {
          const option = document.createElement('option');
          option.value = sb;
          option.textContent = sb;
          subBreedSelect.appendChild(option);
        });
        subBreedSelect.style.display = 'inline-block';
      } else {
        subBreedSelect.style.display = 'none';
      }
    });
});

// Load random dog image
function loadRandomDog() {
  fetch('https://dog.ceo/api/breeds/image/random')
    .then(res => res.json())
    .then(data => {
      imageContainer.innerHTML = '';
      const img = document.createElement('img');
      img.src = data.message;
      imageContainer.appendChild(img);
    });
}

// Load images for selected breed or sub-breed
function loadBreedImages() {
  const breed = breedSelect.value;
  const subBreed = subBreedSelect.value;
  if (!breed) return;

  let url = subBreed
    ? `https://dog.ceo/api/breed/${breed}/${subBreed}/images`
    : `https://dog.ceo/api/breed/${breed}/images`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      imageContainer.innerHTML = '';
      data.message.slice(0, 30).forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        imageContainer.appendChild(img);
      });
    });
}