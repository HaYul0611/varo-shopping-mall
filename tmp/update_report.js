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

  // 9행의 데이터 읽어와서 고도화 내용 추가
  const row9 = worksheet.getRow(9);
  
  // 3번째 셀(C열)에 기능 요약이 들어있을 가능성이 큼 (Row 9: | | 기능 | ...)
  // 안전하게 B, C, D열에 모두 반영하거나, C열에 반영
  const originalValue = worksheet.getCell('C9').value || '';
  
  const newValue = String(originalValue) + '\n- 쿠폰 고도화(프로모션 코드, 발급 수량 제어, 리뷰 작성자 타겟팅) 및 구매 금액별 자동 회원 등급 갱신 시스템 구축';
  
  worksheet.getCell('C9').value = newValue;
  worksheet.getCell('D9').value = newValue; // 병합된 셀일 수 있으므로 주변 셀도 업데이트
  worksheet.getCell('E9').value = newValue;
  
  await workbook.xlsx.writeFile(filePath);
  console.log('Successfully updated Personal Project Report.');
}

run().catch(console.error);
