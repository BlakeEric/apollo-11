const PDFDocument = require('pdfkit');
var fs = require('fs');

const body = {
  queue: [
      {
        id: "eagle landing",
        media: {
          currentSrc: "https://res.cloudinary.com/hwm0fktg3/video/upload/v1580494115/apollo-11/A_New_Look_at_the_Apollo_11_Landing_Site.mp4"
        }
      },
      {
        id: "eagle landing",
        media: {
          currentSrc: "https://res.cloudinary.com/hwm0fktg3/video/upload/v1580494115/apollo-11/A_New_Look_at_the_Apollo_11_Landing_Site.mp4"
        }
      }
    ],
  notes: [
      {
        content: 'This is something',
        selectionText: "om directly mentioning taking communion on the Moon. Aldrin was an elder at the Webster Presbyterian Church, and his communion ki",

      },
      {
        content: 'This is something too',
        selectionText: "om directly mentioning taking communion on the Moon. Aldrin was an elder at the Webster Presbyterian Church, and his communion ki",
      }
    ]
}


module.exports = (req, res) => {
  // Create a document
  const doc = new PDFDocument;

  filename = encodeURIComponent("study-guide") + '.pdf'
  // Setting response to 'attachment' (download).
  // If you use 'inline' here it will automatically open the PDF
  res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
  res.setHeader('Content-type', 'application/pdf')

  // Pipe its output somewhere, like to a file or HTTP response
  // See below for browser usage
  doc.pipe(fs.createWriteStream('output.pdf'));

  // Embed a font, set the font size, and render some text
  doc.font('Helvetica-Bold')
     .fontSize(25)
     .text('My Study Guide', {
       width: 480,
       align: 'center'
     });

  if (body.notes.length) {
    doc.moveDown();

    // Embed a font, set the font size, and render some text
    doc.font('Helvetica-Bold')
       .fontSize(18)
       .text('Notes', {
         width: 480,
         align: 'left'
       });

    doc.moveDown();

    body.notes.forEach(function(note) {
      doc.font('Helvetica')
         .fontSize(14)
         .text('"' + note.selectionText + '"', {
           width: 480,
           align: 'left'
         });

      doc.moveDown();

      doc.font('Helvetica-Oblique')
         .fontSize(14)
         .text(note.content, {
           width: 480,
           align: 'left'
         });

      doc.moveDown();
    });
  }

  if (body.queue.length) {
    // Embed a font, set the font size, and render some text
    doc.font('Helvetica-Bold')
       .fontSize(18)
       .text('Media', {
         width: 480,
         align: 'left'
       });

    doc.moveDown();

    body.queue.forEach(function(item) {
      doc.font('Helvetica')
         .fillColor("black")
         .fontSize(14)
         .text(item.id + ":", {
           width: 480,
           align: 'left'
         });

      doc.font('Helvetica-Bold')
         .fontSize(14)
         .fillColor("blue")
         .text(item.media.currentSrc, {
           width: 480,
           align: 'left',
           link: item.media.currentSrc
         })

      doc.moveDown();
    });
  }



  // Finalize PDF file
  doc.pipe(res)
  doc.end();
}
