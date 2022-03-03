import "../styles.scss";
import mammoth from "mammoth";
import { useState, useEffect } from "react";
import SuggestButton from "./SuggestButton";
import tableStyler from "../utils/tableStyler";

export default function DocParser() {
  const [renderedDoc, setRenderedDoc] = useState();
  const [possibleHeaderTitles, setPossibleHeaderTitles] = useState();
  const [possibleTables, setPossibleTables] = useState();

  const regExps = {
    h1: new RegExp("<(p*?)[^>]*>.*?</p\\1>|<.*?>"),
    posiblyH1: "<p><strong>[a-zA-Z\sáéíóú,\.]*<\/strong><\/p>",
    allP: "<p><strong>"
  }

  const matchClasses = {
    titleMatch: 'title-match',
    tableMatch: 'table-match'
  }
  
  function replaceWithTitleClass(rendered_str) {
    let rendered = rendered_str.replace('<p><strong>', `<p class="title ${matchClasses.titleMatch}"><strong>`)
    return rendered
  }

  function handleChangeFile(inputFileElement) {
    var files = inputFileElement.files || [];
    if (!files.length) return;
    var file = files[0]; // solo el 1er archivo

    var reader = new FileReader();
    reader.onloadend = function (event) {
      var arrayBuffer = reader.result;
      mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
        .then(function (resultObject) {
          let rendered = resultObject.value;
          // Before render: String pre-render
          rendered = replaceWithTitleClass(rendered)
          setRenderedDoc(rendered)
          
          // After render: DOM rendered elements
          const paragraphs = document.getElementsByTagName('p')
          const titleClassParagraphs = document.querySelectorAll('p.title')
          const tables = document.querySelectorAll('table')
          if(titleClassParagraphs !== null){
            setPossibleHeaderTitles(titleClassParagraphs ?? null)
            setPossibleTables(tables)
          }
        });
    };
    reader.readAsArrayBuffer(file);
  }

  function handleUpdateTitle(){
    if (possibleHeaderTitles) {
      // Nuevo nodo a H3
      const newH = document.createElement('h3')
      const newHText = document.createTextNode(possibleHeaderTitles.innerText)
      const indexAttr = document.createAttribute('match-index')
      indexAttr.value = 1
      newH.setAttributeNode(indexAttr)
      newH.appendChild(newHText)
      newH.style.textAlign = "center";
      newH.className = `title ${matchClasses.titleMatch}`;
      newH.c
      // Remplazo del nodo
      possibleHeaderTitles.parentNode.replaceChild(newH, possibleHeaderTitles)
      setPossibleHeaderTitles(document.querySelector('h3.title'))
    } else {
      console.warning('No se encontro un título')
    }
  }

  function handleUpdateTable(){
    if (possibleTables) {
      tableStyler(possibleTables)
    } else {
      console.warning('No se encontro una tabla')
    }
  }

  useEffect(() => {
    let p = document.querySelector('p.title')
    let h3 = document.querySelector('h3.title')
    if (p !== null) {
      setPossibleHeaderTitles(p) 
      console.log('Titulo tipo <p>')
    } else if (h3 !== null) {
      setPossibleHeaderTitles(h3)
      console.log('Titulo tipo <h3>')
    }
  }, [possibleHeaderTitles]);
  
  return (
    <div className="App container">
      <div className="header">
        <h1>DOCX to HTML</h1>
        <h2>Selecciona un archivo...</h2>
        <input type="file" onChange={(e) => handleChangeFile(e.target)} />
      </div>
      <div className="tools">
        <div className="suggests">
          { possibleHeaderTitles ?
            <SuggestButton callback={handleUpdateTitle} className={matchClasses.titleMatch} title='Se encontró un título' match={possibleHeaderTitles.innerText} matchIndex={''} /> : '' }
          { possibleTables ?
            <SuggestButton callback={handleUpdateTable} className={matchClasses.tableMatch} title='Se encontró' match={possibleTables.length + ' tablas'} matchIndex={''} /> : '' }
        </div> 
      </div>
      <div className="rendered-doc">
      {renderedDoc ? (
        <div dangerouslySetInnerHTML={{ __html: renderedDoc }} />
        ) : (
          ""
      )}
      </div>
    </div>
  );
}
