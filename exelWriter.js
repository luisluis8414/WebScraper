const Excel = require('exceljs');



function extractLinks(filePath) {
  return new Promise((resolve, reject) => {
    const workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filePath)
      .then(() => {
        const links = [];
        workbook.eachSheet((sheet, sheetId) => {
          sheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
              if (cell.type === Excel.ValueType.Hyperlink) {
                links.push(cell.hyperlink);
              }
            });
          });
        });
        resolve(links);
      })
      .catch(error => {
        reject(error);
      });
  });
}




module.exports = {
    extractLinks
  };
