const db = require('./db/database');

async function seed() {
  try {
    const menuItems = [
      { name: 'BEST', slug: 'best' },
      { name: 'NEW 5%', slug: 'new-5' },
      { name: 'COLLECTION', slug: 'collection' },
      { name: 'OUTER', slug: 'outer' },
      { name: 'SHIRT', slug: 'shirt' },
      { name: 'TOP', slug: 'top' },
      { name: 'BOTTOM', slug: 'bottom' },
      { name: 'KNIT', slug: 'knit' },
      { name: 'SHOES', slug: 'shoes' },
      { name: '1+1 EVENT', slug: 'event-1plus1' },
      { name: 'COMMUNITY', slug: 'community' }
    ];

    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i];
      const sortOrder = i + 1;

      // 1. 이름이나 슬러그가 일치하는 항목이 있는지 확인
      const existing = await db.query(
        "SELECT id FROM categories WHERE name = ? OR slug = ?",
        [item.name, item.slug]
      );

      if (existing.length > 0) {
        // 업데이트
        await db.execute(
          "UPDATE categories SET name = ?, slug = ?, sort_order = ? WHERE id = ?",
          [item.name, item.slug, sortOrder, existing[0].id]
        );
        console.log(`Updated existing category: ${item.name}`);
      } else {
        // 신규 추가
        await db.execute(
          "INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)",
          [item.name, item.slug, sortOrder]
        );
        console.log(`Inserted new category: ${item.name}`);
      }
    }

    console.log('Main menu categories synced successfully.');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    process.exit();
  }
}

seed();
