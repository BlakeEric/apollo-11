const notes = (function(){


  // Initialize vars
  var notesSummaryContainer = document.getElementById("notesSummary-window");
  var countSpan = document.getElementById('note-count');
  var state = {
    notes: [],
  }


  /**
   * display popover with buttons
   * @param {Object} event the mouseup or onselect end event object
  */
  var generateAddToNotesDialogue = function (event) {

    // Get coordinates
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    var x = event.clientX - 50;
    var y = event.clientY + scroll - 70;

    // Create the dialogue
    var span = document.createElement('span');

    span.classList.add("selected-add-note-dialogue");
    span.innerHTML =
    '<strong>Add note?</strong><br/>\
    <button class="button-standard copy-selected-to-note">Add</button>\
    <button class="button-standard clear-notes-dialogue">×</button>';

    // position the dialogue at where the user clicked
    span.style.position = "absolute";
    span.style.top = y.toString() + "px";
    span.style.left = x.toString() + "px";

    // add it to the div
    document.body.appendChild(span);
  }

  /**
   * Display notes in popup container and along side main text
  */
  var renderNotes = function () {

    var container = document.getElementById('notesSummary-window-currentNotes');
    container.innerHTML = '';

    state.notes.forEach(function(item) {

      // render note count
      countSpan.innerHTML = state.notes.length;

      var noteUi = document.createElement('div')
      noteUi.classList.add("note-fields");

      noteUi.innerHTML =
        `<label>${item.selectionText.trim()}</label>`;

      if (item.content) {
        noteUi.innerHTML += `<p data-noteId="${item.id}">${item.content}</p>`;
      } else {
        noteUi.innerHTML += `<br/><a href="#" class="edit-note" data-noteId="${item.id}">Add a note about this</a>`;
      }

      container.appendChild(noteUi)

      if (document.getElementById(item.id)) return;

      // If it doesn't exist already render inline note UI
      renderInlineNote(item);

    })

  }


  /**
   * Focus on a note textarea
   * @param {Object} item the note object from state
  */
  function renderInlineNote(item) {

    // Render the inline note in content if it wasn't rendered already
    var selectionWrapper = document.createElement('span')
    selectionWrapper.id = item.id;
    selectionWrapper.classList.add('highlighted')
    selectionWrapper.innerHTML = item.selectionText;

    // Surround selection with a span
    var range = item.range;
    range.surroundContents(selectionWrapper)

    // Add the note textarea
    var inlineNoteUi = document.createElement('div')
    inlineNoteUi.classList.add("inline-note");
    inlineNoteUi.id = item.id + "-comment";
    inlineNoteUi.innerHTML =
      `<textarea data-noteId="${item.id}" class="note-field" placeholder="Add your note here...">${item.content}</textarea>
      <button data-noteId="${item.id}" class="button-standard delete-note">Delete</button>`

    selectionWrapper.after(inlineNoteUi)

  }

  /**
   * Focus on a note textarea
   * @param {String} id the id of the note
  */
  function editNote(id) {
    document.getElementById("notesSummary-window").classList.remove("active");
    document.querySelector(`#${id}-comment textarea`).focus();
  }


  //
  // var viewNotesFromDialogue = function () {
  //   clearAddToNotesDialogue();
  // }

  /**
   * Add a note to state
   * @param {Object} selection the optional DOM selection object
   * @param {String} selectionText the optional DOM selection object
   * @param {Object} range the selection range object
   */
  var addNote = function(selection, selectionText, range) {

    const newNote = {
      id: "note-" + ID(),
      selection: selection ? selection : null,
      selectionText: selectionText,
      range: range,
      content: "",
    }

    state.notes = state.notes.concat(newNote);

    renderNotes()

    editNote(newNote.id);

  }


  /**
   * Delete a note from state and remove from UI
   * @param {String} id the id of the note to delete
   */
  function deleteNote(id) {
    state.notes = state.notes.filter(function(note) {
      return id != note.id;
    })

    // Replace the whole wrapper with its own contents
    var wrapper = document.getElementById(id);
    wrapper.outerHTML = wrapper.innerHTML;

    // Remove the textarea
    var noteEditorElem = document.getElementById(id + "-comment");
    noteEditorElem.parentNode.removeChild(noteEditorElem);

    renderNotes()
  }

  /**
   * Generate a random id
   * @returns {String} the generated id
   */
   var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random().toString(36).substr(2, 9);
  };

  /**
   * Delete a note from state and remove from UI
   * @param {Object} event the onkeyup event object from the
   */
  var handleNoteChange = function (event) {

    const index = state.notes.findIndex(function(note) {
      return note.id == event.target.getAttribute('data-noteId')
    });

    state.notes[index].content = event.target.value;

    renderNotes()
  }

  /**
   * Create a new note from the selected text
   */
  var copySelectedToNote = function () {
    var selection = window.getSelection();
    var selectedText = selection.toString();
    var range = selection.getRangeAt(0);

    addNote(selection, selectedText, range);

    // update text in the popover
    document.querySelector('.selected-add-note-dialogue').innerHTML =
    'Note added <button class="clear-notes-dialogue button-standard">×</button>';

    clearDocumentSelection()

    setTimeout(function() {
      clearAddToNotesDialogue()
    }, 2000)

  }

  /**
   * Unselect highlighted text
   */
  var clearDocumentSelection = function () {
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE?
      document.selection.empty();
    }
  }

  /**
   * remove popover from DOM
  */
  var clearAddToNotesDialogue = function () {
    var popover = document.querySelector('.selected-add-note-dialogue');
    if (popover) {
      popover.parentNode.removeChild(popover);
    }
  }

  /**
   * Open the notes summary popover
  */
  var openNotesSummary = function() {
    notesSummaryContainer.classList.add('active')
  }

  /**
   * Close the notes summary popover
  */
  var closeNotesSummary = function() {
    notesSummaryContainer.classList.remove('active')
  }

  /**
   * Close the notes summary popover if open, and vice versa
  */
  var toggleNotesSummary = function() {
    notesSummaryContainer.classList.toggle('active')
  }


  /**
   * Initialize event handlers
  */
  var init = function () {
    events.on('click', '.copy-selected-to-note', function (event) {
      event.preventDefault()
      copySelectedToNote();
    });

    events.on('click', '.clear-notes-dialogue', function (event) {
      event.preventDefault()
      clearAddToNotesDialogue();
    });

    events.on('click', '.notes-summary-toggle', function (event) {
      event.preventDefault()
      toggleNotesSummary();
    });

    events.on('click', '.note-fields > p, a.edit-note', function (event) {
      event.preventDefault()
      var id = event.target.getAttribute('data-noteId')
      editNote(id);
    });

    events.on('click', 'span.highlighted', function (event) {
      event.preventDefault()
      var id = event.target.getAttribute('id')
      editNote(id);
    });

    events.on('click', '.delete-note', function (event) {
      event.preventDefault()
      var id = event.target.getAttribute('data-noteId')
      deleteNote(id);
    });

    events.on('keyup', '.note-field', function (event) {
      event.preventDefault()
      handleNoteChange(event);
    });

    events.on('mouseup', '#content', function (event) {
      event.preventDefault()
      if (window.getSelection().type === "Range") {
          clearAddToNotesDialogue()
          generateAddToNotesDialogue(event)
      } else if (document.selection) {
          console.log(document.selection.createRange().text);
      }
    });
  }

  //expose vars
  return {
    init
  }

}());
