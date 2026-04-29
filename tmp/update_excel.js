const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const baseDir = 'c:\\Users\\admin\\Desktop\\HAYUL\\eclipse\\ShoppingMall\\tmp\\프로젝트 제출양식\\2. 프로젝트 결과 보고서';

async function updateRequirements() {
  const files = ['20260428_요구사항일람.xlsx', '20260428_요구사항정의서.xlsx'];
  
  for (const file of files) {
    const filePath = path.join(baseDir, file);
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      continue;
    }
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1); // 첫 번째 시트
    
    // 마지막 행 찾기
    let lastRowNumber = worksheet.lastRow ? worksheet.lastRow.number : 0;
    
    // 데이터 추가
    worksheet.addRow(['FR-11', '쿠폰 발급 수량 제어', '관리자가 쿠폰별 총 발급 수량을 동적으로 설정 가능', '구현완료']);
    worksheet.addRow(['FR-12', '쿠폰 발급 대상 확장', '리뷰 작성자 타겟팅 발급 기능', '구현완료']);
    worksheet.addRow(['FR-13', '프로모션 코드 연동', '쿠폰별 고유 영문 코드 매핑', '구현완료']);
    worksheet.addRow(['FR-14', '자동 회원 등급제', '구매 금액별 등급 자동 승급 로직', '구현완료']);
    
    await workbook.xlsx.writeFile(filePath);
    console.log(`Updated ${file}`);
  }
}

async function updateTableDefinition() {
  const file = '20260428_테이블정의서.xlsx';
  const filePath = path.join(baseDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1);
  
  // coupons 테이블 영역 찾기 (단순히 파일 끝에 추가하거나, 특정 행을 찾아야 하지만
  // 구조를 모르므로 파일 끝에 새 테이블 정의 형태로 추가하거나 기존 행 아래에 추가)
  // 안전하게 파일 끝에 추가
  worksheet.addRow([]);
  worksheet.addRow(['[추가 컬럼 - coupons 테이블]']);
  worksheet.addRow(['컬럼명', '데이터 타입', 'Null 여부', '설명']);
  worksheet.addRow(['total', 'INT', 'NO', '쿠폰 총 발급 수량 (기본값 1000)']);
  worksheet.addRow(['code', 'VARCHAR(50)', 'YES', '프로모션 코드']);
  
  await workbook.xlsx.writeFile(filePath);
  console.log(`Updated ${file}`);
}

async function run() {
  await updateRequirements();
  await updateTableDefinition();
}

run().catch(console.error);
