let paragraph = document.querySelector("p");

window.onload = () => {
  setTimeout(() => {
    paragraph.innerHTML = "JavaScript Setup Successful.";
    paragraph.style.transition = "all 0.5s ease";
    paragraph.style.transform = "translateY(30px)";
    paragraph.style.color = "#15821c";
  }, 2000);
};