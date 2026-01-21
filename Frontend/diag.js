import pool from './server/config/postgres.js';

async function check() {
    try {
        console.log('--- Database Connection Check ---');
        const u = await pool.query('SELECT id, email, is_admin FROM users');
        console.log('Users Table:');
        console.table(u.rows);

        const p = await pool.query('SELECT id, name, price FROM products LIMIT 5');
        console.log('Products Table Sample:');
        console.table(p.rows);

        const c = await pool.query('SELECT id, name_ar FROM categories');
        console.log('Categories Table:');
        console.table(c.rows);

    } catch (e) {
        console.error('Diagnostic Error:', e);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

check();
