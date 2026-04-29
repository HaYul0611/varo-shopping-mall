const ExcelJS = require('exceljs');
const fs = require('fs');

const filePath = 'c:\\Users\\admin\\Desktop\\HAYUL\\eclipse\\ShoppingMall\\tmp\\프로젝트 제출양식\\2. 프로젝트 결과 보고서\\20260428_개인 프로젝트 결과 보고서.xlsx';

async function run() {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1);

  worksheet.eachRow((row, rowNumber) => {
    const values = row.values.map(v => v ? String(v).replace(/\n/g, ' ') : '').join(' | ');
    console.log(`Row ${rowNumber}: ${values}`);
  });
}

run().catch(console.error);
