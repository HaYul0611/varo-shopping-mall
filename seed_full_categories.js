const db = require('./db/database');

async function seed() {
  try {
    const data = [
      {
        name: 'OUTER', slug: 'outer',
        subs: ['자켓', '코트', '패딩', '점퍼', '레더/무스탕']
      },
      {
        name: 'SHIRT', slug: 'shirt',
        subs: ['반팔셔츠', '긴팔셔츠', '오버셔츠', '데님셔츠']
      },
      {
        name: 'TOP', slug: 'top',
        subs: ['반팔티', '긴팔티', '맨투맨', '후드티', '민소매']
      },
      {
        name: 'BOTTOM', slug: 'bottom',
        subs: ['데님팬츠', '슬랙스', '카고팬츠', '조거팬츠', '반바지']
      },
      {
        name: 'KNIT', slug: 'knit',
        subs: ['풀오버', '집업니트', '가디건', '니트베스트']
      },
      {
        name: 'SHOES', slug: 'shoes',
        subs: ['스니커즈', '로퍼', '샌들', '부츠']
      },
      {
        name: 'COMMUNITY', slug: 'community',
        subs: ['공지사항', 'FAQ', 'Q&A', '리뷰', '이벤트', '멤버십']
      },
      { name: 'BEST', slug: 'best', subs: [] },
      { name: 'NEW 5%', slug: 'new-5', subs: [] },
      { name: 'COLLECTION', slug: 'collection', subs: [] },
      { name: '1+1 EVENT', slug: 'event-1plus1', subs: [] }
    ];

    for (let i = 0; i < data.length; i++) {
      const parent = data[i];
      const parentOrder = i + 1;

      // Parent insert/update
      let parentId;
      const existingParent = await db.query("SELECT id FROM categories WHERE name = ?", [parent.name]);
      if (existingParent.length > 0) {
        parentId = existingParent[0].id;
        await db.execute(
          "UPDATE categories SET slug = ?, sort_order = ?, parent_id = NULL WHERE id = ?",
          [parent.slug, parentOrder, parentId]
        );
      } else {
        const res = await db.execute(
          "INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)",
          [parent.name, parent.slug, parentOrder]
        );
        parentId = res.insertId;
      }

      // Subs insert/update
      for (let j = 0; j < parent.subs.length; j++) {
        const subName = parent.subs[j];
        const subOrder = j + 1;
        const subSlug = `${parent.slug}-${j + 1}`;

        const existingSub = await db.query("SELECT id FROM categories WHERE name = ? AND parent_id = ?", [subName, parentId]);
        if (existingSub.length > 0) {
          await db.execute(
            "UPDATE categories SET slug = ?, sort_order = ? WHERE id = ?",
            [subSlug, subOrder, existingSub[0].id]
          );
        } else {
          await db.execute(
            "INSERT INTO categories (name, slug, sort_order, parent_id) VALUES (?, ?, ?, ?)",
            [subName, subSlug, subOrder, parentId]
          );
        }
      }
      console.log(`Synced: ${parent.name} with ${parent.subs.length} sub-categories`);
    }

    console.log('All categories and sub-categories synced successfully.');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    process.exit();
  }
}

seed();
