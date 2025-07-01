// Get reference to the image element
const img = document.getElementById('dogImage');

// Function to fetch a new random dog image
function fetchDog() {
  fetch('https://dog.ceo/api/breeds/image/random')
    .then(response => response.json())
    .then(data => {
      img.src = data.message;
    })
    .catch(error => {
      console.error('Error fetching dog image:', error);
      alert('Could not load dog image.');
    });
}

// Load a dog image when the page loads
window.onload = fetchDog;