$(function(){
  $('#text').cleditor({
          width:        700, // width not including margins, borders or padding
          height:       300, // height not including margins, borders or padding
          controls:     // controls to add to the toolbar
                        "bold italic | " +
                        "style removeformat | bullets numbering | outdent " +
                        "indent | undo redo | " +
                        "image link unlink | cut copy paste pastetext | source",
   
          styles:       // styles in the style popup
                        [["Обычный текст", "<p>"], ["Заголовок 2", "<h2>"],
                        ["Заголовок 3", "<h3>"],  ["Заголовок 4","<h4>"],  ["Заголовок 5","<h5>"],
                        ["Заголовок 6","<h6>"]],
          useCSS:       true, // use CSS to style HTML when possible (not supported in ie)
          docType:      // Document type contained within the editor
                        '<!DOCTYPE HTML">',
          docCSSFile:   // CSS file used to style the document contained within the editor
                        "/css/bootstrap.min.css", 
          bodyStyle:    // style to assign to document body contained within the editor
                        "margin:4px; cursor:text"
        });
})