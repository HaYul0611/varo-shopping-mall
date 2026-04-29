const ExcelJS = require('exceljs');
const path = require('path');
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

  let targetRow = -1;

  // 'coupons' 텍스트가 있는 행 찾기
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      if (cell.value && String(cell.value).trim() === 'coupons') {
        targetRow = rowNumber;
      }
    });
  });

  if (targetRow === -1) {
    console.error("Could not find 'coupons' table in the worksheet.");
    return;
  }

  console.log(`Found 'coupons' at row ${targetRow}`);

  // 'No', '컬럼명 (영문)' 헤더는 targetRow + 2에 위치할 가능성이 높음 (이미지 참조)
  // 데이터는 targetRow + 3부터 삽입
  const startRow = targetRow + 3;

  const columns = [
    [1, 'id', '쿠폰ID', 'INT', 11, 'PK, NN, AUTO_INCREMENT', '쿠폰 고유 번호'],
    [2, 'name', '쿠폰명', 'VARCHAR', 100, 'NN', '쿠폰 이름'],
    [3, 'type', '할인유형', 'VARCHAR', 20, 'NN', '정액/정률 구분'],
    [4, 'discount', '할인금액/율', 'INT', 11, 'NN', '할인액 또는 할인율(%)'],
    [5, 'minOrder', '최소주문금액', 'INT', 11, '', '쿠폰 사용 가능 최소 금액'],
    [6, 'expiry', '만료일', 'DATE', '', '', '쿠폰 사용 만료 날짜'],
    [7, 'target', '발급대상', 'VARCHAR', 50, '', '발급 대상 회원 그룹'],
    [8, 'used', '사용수량', 'INT', 11, '', '현재까지 사용된 수량'],
    [9, 'total', '발급수량', 'INT', 11, 'NN', '총 발급 가능 수량'],
    [10, 'code', '프로모션코드', 'VARCHAR', 50, '', '고유 프로모션 코드'],
    [11, 'status', '상태', 'VARCHAR', 20, '', '쿠폰 상태 (진행중/만료 등)']
  ];

  for (let i = 0; i < columns.length; i++) {
    const rowData = columns[i];
    const currentRow = startRow + i;
    
    // 기존 셀 서식을 유지하기 위해 행 전체를 덮어쓰지 않고 셀별로 값만 삽입
    worksheet.getCell(`B${currentRow}`).value = rowData[0]; // No (B열부터 시작할 가능성 높음, 이미지 확인 필요)
    worksheet.getCell(`C${currentRow}`).value = rowData[1]; // 컬럼명 (영문)
    worksheet.getCell(`D${currentRow}`).value = rowData[2]; // 컬럼명 (한글)
    worksheet.getCell(`E${currentRow}`).value = rowData[3]; // 타입
    worksheet.getCell(`F${currentRow}`).value = rowData[4]; // 길이
    worksheet.getCell(`G${currentRow}`).value = rowData[5]; // 제약조건/Key
    worksheet.getCell(`H${currentRow}`).value = rowData[6]; // 설명
  }

  await workbook.xlsx.writeFile(filePath);
  console.log('Successfully updated coupons table definition.');
}

run().catch(console.error);
