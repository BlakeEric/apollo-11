"use strict";

var tour = function () {
  var container = document.getElementById("tour-window");
  var isActive = false;

  /**
   * add appropriate classes to body element and sidebar container
   * depending on whether sidebar is active
  */
  var setClasses = function setClasses() {
    if (isActive) {
      container.classList.add('active');
      document.body.classList.add('no-scroll');
    } else {
      container.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  };
  
  /**
   * Open the mobile nav
  */
  var open = function open() {
    isActive = true;
    setClasses();
  };

  /**
   * Close the mobile nav
  */
  var close = function close() {
    isActive = false;
    setClasses();
  };

  /**
   * Close the mobile nav if open, and vice versa
  */
  var toggle = function toggle() {
    isActive = !isActive;
    setClasses();
  };

  /**
   * Initialize event handlers and scrollspy
  */
  var init = function init() {
    events.on('click', '.tour-toggle', function (event) {
      tour.toggle();
    });
    events.on('click', '.tour-close', function (event) {
      tour.close();
    });
    // tour.open();
    setTimeout(function() {
      tour.open();
    }, 3000)
  };

  // expose variables
  return {
    toggle: toggle,
    open: open,
    close: close,
    init: init
  };
}();
