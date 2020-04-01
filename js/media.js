const media = (function(){

  /**
   * remove audio/video media from the dom and save in state.mediaData for later
  */
  function pluckMediaFromDom() {

    const mediaElems = document.querySelectorAll('figure.video, figure.audio')

    const mediaData = {}

    mediaElems.forEach(function(item) {

      //Remove item from the DOM
      item.parentNode.removeChild(item);

      //Create controls and slap them onto the node
      var deleteButton = document.createElement("button");
      deleteButton.innerHTML = "×";
      deleteButton.classList.add("remove-from-queue", "button-standard")
      item.appendChild(deleteButton)

      var playButton = document.createElement("button");
      playButton.innerHTML = "Play";
      playButton.classList.add("play-media", "button-standard")
      item.appendChild(playButton)

      var pauseButton = document.createElement("button");
      pauseButton.innerHTML = "Pause";
      pauseButton.classList.add("pause-media", "button-standard")
      item.appendChild(pauseButton)

      mediaData[item.getAttribute('id')] = item;
    })

    state.set("mediaData", mediaData)

  }

  /**
   * play a media item in the queue
   * @param {String} id the id of the element
  */
  function playItem(id) {

    document.querySelectorAll('audio, video').forEach(function(item){
      item.pause()
    });

    let itemToPlay = state.queue.find(function(item) {
      return item.id == id;
    });

    document.querySelector('#' + id).classList.add('is-playing')

    itemToPlay.media.play()
  }


  /**
   * pause a playing media item in the queue
   * @param {String} id the id of the element
  */
  function pauseItem(id) {

    document.querySelectorAll('audio, video').forEach(function(item){
      item.pause()
    });

    let itemToPause = state.queue.find(function(item) {
      return item.id == id;
    });

    if (document.querySelector('.is-playing')) {
      document.querySelector('.is-playing').classList.remove('is-playing')
    }

    itemToPause.media.pause()
  }

  /**
   * render items to the media queue
   */
  function renderQueue() {

    var container = document.getElementById('queue');
    var countSpan = document.getElementById('media-count');
    var instructions = document.getElementById('queue-instructions');
    var downloadButton = document.getElementById('download-media');

    state.toggleStudyGuideDownloadButton();

    countSpan.innerHTML = state.queue.length;
    container.innerHTML = "";

    if (state.queue.length == 0) {
      instructions.style.display = 'block';
      return;
    }

    // If we make it this far there are items in the queue
    instructions.style.display = 'none';

    state.queue.forEach(function(item){
      var mediaElem = state.mediaData[item.id]
      container.appendChild(mediaElem)
    });

  }

  /**
   * add an item to the media queue (and rerender)
   * @param {String} id the id of the element
  */
  function addToQueue(id) {

    // Don't add to the queue if the item is already there
    if (state.queue.find(item => item.id === id)) {
      displayAlert("Item already in queue")
      return;
    }

    // Prep item data to be added to queue
    var item = {
      id,
      media: state.mediaData[id].querySelector("audio, video"),
    }

    // Add to queue array
    state.set("queue", state.queue.concat(item))

    renderQueue();
  }

  /**
   * remove an item from the media queue (and rerender)
   * @param {String} id the id of the element
  */
  function removeFromQueue(id) {

    let item = document.querySelector('#' + id)

    item.classList.remove('is-playing')

    queue = state.queue.filter(function(item) {
      return item.id !== id;
    });

    state.set("queue", queue)

    renderQueue()
  }


  /**
   * initialize event handlers
  */
  var init = function() {

    pluckMediaFromDom();

    renderQueue()

    events.on('click', '.toggleMedia', function (event) {
      event.preventDefault()
      var id = event.target.getAttribute("data-media")
      addToQueue(id)
    });

    events.on('click', '.remove-from-queue', function (event) {
      event.preventDefault()
      var id = event.target.parentNode.getAttribute("id")
      removeFromQueue(id)
    });

    events.on('click', '.play-media', function (event) {
      event.preventDefault()
      var id = event.target.parentNode.getAttribute("id")
      playItem(id)
    });

    events.on('click', '.pause-media', function (event) {
      event.preventDefault()
      var id = event.target.parentNode.getAttribute("id")
      pauseItem(id)
    });

    events.on('click', '#download-media', function (event) {
      event.preventDefault()
      download();
    });
  }


  // expose variables
  return {
    init
  };

}());
