/* ADD OR REMOVE FIXED CLASS TO NAVBAR WHEN SCROLLED */

var scrollPosition = window.scrollY;
var logoContainer = document.getElementById("subtabs--container");

window.addEventListener("scroll", function () {
  scrollPosition = window.scrollY;

  if (scrollPosition >= 30) {
    logoContainer.classList.add("fixed");
  } else {
    logoContainer.classList.remove("fixed");
  }
});