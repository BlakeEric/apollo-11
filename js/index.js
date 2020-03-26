function init() {

  // Reveal js-only items
  document.querySelectorAll(".js-only").forEach(function(item) {
    item.style.display = "block";
  });
  document.querySelector('body').classList.add('js-enabled');

  nav.init();
}

init();
