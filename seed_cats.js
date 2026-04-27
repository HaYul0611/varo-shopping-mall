const db = require('./db/database');

async function seed() {
  try {
    // 1. 기존 카테고리 '아우터'를 'OUTER'로 이름 변경
    await db.execute("UPDATE categories SET name = 'OUTER' WHERE id = 1");
    await db.execute("UPDATE categories SET name = 'SHIRT' WHERE id = 2");

    // 2. OUTER(id: 1)의 서브 카테고리들 추가 (없으면 추가)
    const subs = [
      { name: '자켓', slug: 'jacket', order: 1 },
      { name: '코트', slug: 'coat', order: 2 },
      { name: '패딩', slug: 'padding', order: 3 },
      { name: '점퍼', slug: 'jumper', order: 4 },
      { name: '레더/무스탕', slug: 'leather-mustang', order: 5 }
    ];

    for (const s of subs) {
      // 이미 있는지 확인
      const existing = await db.query("SELECT id FROM categories WHERE parent_id = 1 AND name = ?", [s.name]);
      if (existing.length === 0) {
        await db.execute(
          "INSERT INTO categories (parent_id, name, slug, sort_order) VALUES (1, ?, ?, ?)",
          [s.name, s.slug, s.order]
        );
        console.log(`Added sub-category: ${s.name}`);
      }
    }

    console.log('Category seed completed successfully.');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    process.exit();
  }
}

seed();
