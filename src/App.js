import "./styles.css";
import mammoth from "mammoth";
import { useState, useEffect } from "react";
import SuggestButton from "./components/SuggestButton";

// const Suggest = ({className, callback, title, match}) => {
//   return(
//     <button className={"suggest "+className} onClick={callback}>
//       <b className="">{title}: </b>
//       <span className="">{match}</span>
//   </button>
//   )
// }

const styles = {
  hFontSize: '14px'
}

export default function App() {
  const [renderedDoc, setRenderedDoc] = useState();
  const [possibleHeaderTitles, setPossibleHeaderTitles] = useState();
  const [possibleTables, setPossibleTables] = useState();

  const regExps = {
    h1: new RegExp("<(p*?)[^>]*>.*?</p\\1>|<.*?>"),
    posiblyH1: "<p><strong>[a-zA-Z\sáéíóú,\.]*<\/strong><\/p>",
    allP: "<p><strong>"
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

  const matchClasses = {
    titleMatch: 'title-match',
    tableMatch: 'table-match'
  }

  function handleUpdateTitle(){
    if (possibleHeaderTitles) {
      // Nuevo nodo 
      const newH = document.createElement('h3')
      const newHText = document.createTextNode(possibleHeaderTitles.innerText)
      newH.appendChild(newHText)
      newH.style.textAlign = "center";
      newH.className = `title ${matchClasses.titleMatch}`;
      // Remplazo del nodo
      possibleHeaderTitles.parentNode.replaceChild(newH, possibleHeaderTitles)
      setPossibleHeaderTitles(document.querySelector('h3.title'))
    } else {
      console.warning('No se encontro un título')
    }
  }

  function handleUpdateTable(){
    if (possibleTables) {
      possibleTables.forEach(possibleTable => {
        possibleTable.style.backGroundColor = "black";
        possibleTable.className = `title ${matchClasses.tableMatch}`;
      });
      possibleTables[0].focus()
      window.scrollBy({ 
        top: possibleTables[0].offsetHeight, // Scroll the the end of the tabele's height
        behavior: 'smooth' 
      });
      // Nuevo nodo 
      // const newH = document.createElement('h3')
      // const newHText = document.createTextNode(possibleHeaderTitles.innerText)
      // newH.appendChild(newHText)
      // Remplazo del nodo
      // possibleHeaderTitles.parentNode.replaceChild(newH, possibleHeaderTitles)
      // setPossibleTables(document.querySelector('h3.title'))
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
           <SuggestButton callback={handleUpdateTitle} className={matchClasses.titleMatch} title='Se encontró un título' match={possibleHeaderTitles.innerText} /> : '' }
          { possibleTables ?
            <SuggestButton callback={handleUpdateTable} className={matchClasses.tableMatch} title='Se encontró' match={possibleTables.length + ' tablas'} /> : '' }
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
