const db = require('./db/database');

async function check() {
    try {
        const rows = await db.query('SELECT * FROM categories');
        console.log(JSON.stringify(rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
check();
