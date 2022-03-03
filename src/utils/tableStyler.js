import matchclasses from "./match-classes";
import colors from "./colors";

const tableStyler = (possibleTables) => {
  possibleTables.forEach(possibleTable => {
    possibleTable.className = `title ${matchclasses.tableMatch}`;
    possibleTable.style.margin = '20px auto'
    const tableRows = possibleTable.rows
    for(let row of tableRows) {
      for(let cell of row.cells) {
        cell.style.borderBottom = `1px solid ${colors.table.border}`
        cell.style.borderLeft = `1px solid ${colors.table.border}`
        cell.style.borderRight = `1px solid ${colors.table.border}`
      }
    }
    const tableFirstRow = tableRows[0]
    tableFirstRow.style.borderTop = `1px solid ${colors.table.border}`
    tableFirstRow.style.backgroundColor = colors.table.th;
    tableFirstRow.style.color = 'white';
    console.log(tableFirstRow) 
  });
  // Focus
  // possibleTables[0].focus()
  window.scrollBy({
    top: possibleTables[0].offsetHeight, // Scroll the the end of the tabele's height
    behavior: 'smooth'
  });
}

export default tableStyler;