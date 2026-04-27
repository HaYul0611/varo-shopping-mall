const db = require('./db/database');

async function fix() {
    try {
        console.log('Updating 관리자 user to is_admin = 1...');
        await db.execute('UPDATE users SET is_admin = 1 WHERE name = ?', ['관리자']);
        console.log('Update successful.');
    } catch (err) {
        console.error('Update failed:', err.message);
    } finally {
        process.exit();
    }
}

fix();
