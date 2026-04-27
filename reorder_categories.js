const db = require('./db/database');

async function reorder() {
  try {
    const correctOrder = [
      'BEST',
      'NEW 5%',
      'COLLECTION',
      'OUTER',
      'SHIRT',
      'TOP',
      'BOTTOM',
      'KNIT',
      'SHOES',
      '1+1 EVENT',
      'COMMUNITY'
    ];

    for (let i = 0; i < correctOrder.length; i++) {
      const name = correctOrder[i];
      const sortOrder = (i + 1) * 10; // Use 10, 20, 30 for safe gaps

      await db.execute(
        "UPDATE categories SET sort_order = ? WHERE name = ? AND parent_id IS NULL",
        [sortOrder, name]
      );
      console.log(`Reordered: ${name} -> ${sortOrder}`);
    }

    console.log('Main category order fixed successfully.');
  } catch (err) {
    console.error('Reorder failed:', err.message);
  } finally {
    process.exit();
  }
}

reorder();
