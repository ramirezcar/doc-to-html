import "./styles.scss";
import mammoth from "mammoth";
import { useState } from "react";

export default function App() {
  const [renderedDoc, setRenderedDoc] = useState();

  const h1 = new RegExp("<(S*?)[^>]*>.*?</\1>|<.*?/>");

  function getFirstChild(string) {
    let output = h1.exec(string);
    // console.log("getFirstChild", string);
    console.log("getFirstChild", output);
  }

  function parseWordDocxFile(inputElement) {
    var files = inputElement.files || [];
    if (!files.length) return;
    var file = files[0]; // solo el 1er archivo

    console.time();
    var reader = new FileReader();
    reader.onloadend = function (event) {
      var arrayBuffer = reader.result;
      mammoth
        .convertToHtml({ arrayBuffer: arrayBuffer })
        .then(function (resultObject) {
          let rendered = resultObject.value;
          console.log(rendered);
          setRenderedDoc(rendered);
          getFirstChild(rendered);
        });
      console.timeEnd();

      mammoth
        .extractRawText({ arrayBuffer: arrayBuffer })
        .then(function (resultObject) {
          // result2.innerHTML = resultObject.value
          // console.log(resultObject.value);
        });

      mammoth
        .convertToMarkdown({ arrayBuffer: arrayBuffer })
        .then(function (resultObject) {
          // result3.innerHTML = resultObject.value
          // console.log(resultObject.value);
        });
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="App">
      <div className="header">
        <h1>DOCX to HTML</h1>
        <h2>Selecciona un archivo...</h2>
        <input type="file" onChange={(e) => parseWordDocxFile(e.target)} />
        {/* <button onClick={parseWordDocxFile(deafultFile)}> Recargar </button> */}
      </div>
      {renderedDoc ? (
        <div className="rendered-doc">
          <div className="tools">
            <button className="">🖊</button>
            <button className="">🏁</button>
            <button className="">📑</button>
          </div>
          <div dangerouslySetInnerHTML={{ __html: renderedDoc }} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
