/* 来自http://www.jb51.net/article/46976.htm */
function generateCompareTRs(iCol, sDataType) {
  return function compareTRs(oTR1, oTR2) {
    vValue1 = convert(oTR1.cells[iCol].firstChild.nodeValue, sDataType);
    vValue2 = convert(oTR2.cells[iCol].firstChild.nodeValue, sDataType);
    if (vValue1 < vValue2) {
      return -1;
    } if (vValue1 > vValue2) {
      return 1;
    }
    return 0;
  };
}
function convert(sValue, sDataType) {
  switch (sDataType) {
    case 'int':
      return parseInt(sValue);
    case 'float':
      return parseFloat(sValue);
    case 'date':
      return new Date(Date.parse(sValue));
    default:
      return sValue.toString();
  }
}
function sortTable(sTableID, iCol, sDataType) {
  const oTable = document.getElementById(sTableID);
  const oTBody = oTable.tBodies[0];
  const colDataRows = oTBody.rows;
  const aTRs = new Array();
  for (let i = 0; i < colDataRows.length; i++) {
    aTRs[i] = colDataRows[i];
  }
  if (oTable.sortCol == iCol) {
    aTRs.reverse();
  } else {
    aTRs.sort(generateCompareTRs(iCol, sDataType));
  }
  const oFragment = document.createDocumentFragment();
  for (let j = 0; j < aTRs.length; j++) {
    oFragment.appendChild(aTRs[j]);
  }
  oTBody.appendChild(oFragment);
  oTable.sortCol = iCol;
}
