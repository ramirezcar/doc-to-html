import mammoth from "mammoth";

const parse = async () => {
  mammoth
    .convertToHtml({ path: "./test.docx" })
    .then(function (result) {
      var html = result.value; // The generated HTML
      var messages = result.messages; // Any messages, such as warnings during conversion
      console.log(messages);
    })
    .done();
};

// <input type="file" onchange="parseWordDocxFile(this)">
function parseWordDocxFile(inputElement) {
  var files = inputElement || [];
  if (!files.length) return;
  var file = files[0];

  console.time();
  var reader = new FileReader();
  reader.onloadend = function (event) {
    var arrayBuffer = reader.result;
    // debugger

    mammoth
      .convertToHtml({ arrayBuffer: arrayBuffer })
      .then(function (resultObject) {
        // result1.innerHTML = resultObject.value
        console.log(resultObject.value);
      });
    console.timeEnd();

    mammoth
      .extractRawText({ arrayBuffer: arrayBuffer })
      .then(function (resultObject) {
        // result2.innerHTML = resultObject.value
        console.log(resultObject.value);
      });

    mammoth
      .convertToMarkdown({ arrayBuffer: arrayBuffer })
      .then(function (resultObject) {
        // result3.innerHTML = resultObject.value
        console.log(resultObject.value);
      });
  };
  reader.readAsArrayBuffer(file);
}

export default parseWordDocxFile;
