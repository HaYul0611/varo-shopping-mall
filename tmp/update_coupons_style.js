const ExcelJS = require('exceljs');
const fs = require('fs');

const filePath = 'c:\\Users\\admin\\Desktop\\HAYUL\\eclipse\\ShoppingMall\\tmp\\프로젝트 제출양식\\2. 프로젝트 결과 보고서\\20260428_테이블정의서.xlsx';

async function run() {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1);

  // 기존 정상 서식의 셀 (예: user_addresses 테이블의 100행)
  const cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  // coupons 테이블의 시작 행은 107행 (104행 coupons, 105행 설명, 106행 헤더, 107행부터 데이터)
  // 107행부터 117행까지 데이터가 들어있음
  for (let row = 107; row <= 117; row++) {
    for (const col of cols) {
      const targetCell = worksheet.getCell(`${col}${row}`);
      const sourceCell = worksheet.getCell(`${col}100`); // 100행의 서식을 원본으로 사용
      
      if (sourceCell) {
        if (sourceCell.font) targetCell.font = JSON.parse(JSON.stringify(sourceCell.font));
        if (sourceCell.border) targetCell.border = JSON.parse(JSON.stringify(sourceCell.border));
        if (sourceCell.fill) targetCell.fill = JSON.parse(JSON.stringify(sourceCell.fill));
        if (sourceCell.alignment) targetCell.alignment = JSON.parse(JSON.stringify(sourceCell.alignment));
      }
    }
  }

  await workbook.xlsx.writeFile(filePath);
  console.log('Successfully unified cell styles for coupons table.');
}

run().catch(console.error);
