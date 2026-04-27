const db = require('./db/database');

async function checkUsers() {
    try {
        const users = await db.query('SELECT id, name, is_admin FROM users');
        console.log('Users:', users);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        process.exit();
    }
}

checkUsers();
