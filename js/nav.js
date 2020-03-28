const nav = (function(){

  var navContainer = document.getElementById("sidebar-wrap");

  var isActive = false;

  /**
   * add appropriate classes to body element and sidebar container
   * depending on whether sidebar is active
  */
  var setClasses = function() {
    if (isActive) {
      navContainer.classList.add('active')
      document.body.classList.add('no-scroll');
    } else {
      navContainer.classList.remove('active')
      document.body.classList.remove('no-scroll');
    }
  }

  /**
   * Open the mobile nav
  */
  var open = function() {
    isActive = true;
    setClasses()
  }

  /**
   * Close the mobile nav
  */
  var close = function() {
    isActive = false;
    setClasses()
  }

  /**
   * Close the mobile nav if open, and vice versa
  */
  var toggle = function() {
    isActive = !isActive;
    setClasses()
  }

  /**
   * Initialize event handlers and scrollspy
  */
  var init = function() {
    //enable scrollspy
    var spy = new Gumshoe('#tableOfContents a');

    //enable event handlers
    events.on('click', '#mobile-nav-toggle, #mobile-nav-toggle *', function (event) {
      nav.toggle();
    });

    events.on('click', '#tableOfContents a', function (event) {
      nav.close();
    });
  }

  // expose variables
  return {
    toggle,
    open,
    close,
    init
  };

}());
