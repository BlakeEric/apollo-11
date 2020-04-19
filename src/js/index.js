"use strict";

var smoothScroll;

function init() {

  // Reveal js-only items
  document.querySelectorAll(".js-only").forEach(function (item) {
    item.style.display = "block";
  });

  document.querySelector('body').classList.add('js-enabled');

  rangy.init();
  state.init(); 
  nav.init();
  media.init();
  notes.init();
}

// initialize global smooth scroll
smoothScroll = new SmoothScroll('a[href*="#"]', {
  speed: 300,
  speedAsDuration: true,
});

init();
