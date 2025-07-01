let paragraph = document.querySelector("p");

window.onload = () => {
  const randomDelay = Math.random() * (2000 - 500) + 500; // 500ms to 2000ms

  setTimeout(() => {
    paragraph.innerHTML = "JavaScript Setup Successful.";
    paragraph.style.transition = "all 0.5s ease";
    paragraph.style.transform = "translateY(30px)";
    paragraph.style.color = "#15821c";
  }, randomDelay);
};