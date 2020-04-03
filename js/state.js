const state = (function(){

  var notes = [];
  var queue = [];
  var mediaData = {};

  /**
   * disable/enable the study guide download button based on whether values exist in state
  */
  var toggleStudyGuideDownloadButton = function () {
    if (!this.notes.length && !this.queue.length) {
      document.getElementById('download-studyGuide').setAttribute('disabled', 'disabled');
    } else {
      document.getElementById('download-studyGuide').removeAttribute('disabled');
    }
  }

  /**
   * replace a value in state
   * @param {String} key the id of the element
   * @param          newData the new value
  */
  var set = function (key, newData) {
    this[key] = newData;
  }

  /**
   * send a POST request to the API to generate a PDF file for download
  */
  var downloadPDF = function() {
    var data = {
      queue: state.queue.map(function(item) {
        return {
          id: item.id,
          description: item.description,
          src: item.media.currentSrc
        }
      }),
      notes: state.notes
    }

    fetch("https://apollo-11-api.herokuapp.com/",
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(function (response) {

      // The API call was successful!
      return response.blob();

    }).then(function(blob) {

      download(blob, "studyguide.pdf", "application/pdf");

    }).catch(function (err) {
      // There was an error
      console.warn('Something went wrong.', err);
    });
  }

  /**
   * initialize event handlers
  */
  var init = function() {
    events.on('click', '.download-studyGuide', function (event) {
      event.preventDefault()
      downloadPDF();
    });
  }

  return {
    notes,
    queue,
    mediaData,
    toggleStudyGuideDownloadButton,
    set,
    init
  }

}() );
