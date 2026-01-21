import pool from './config/postgres.js';

const checkStatus = async () => {
    const client = await pool.connect();
    try {
        console.log('🔍 Checking Database Status...');

        // 1. Check Users
        const users = await client.query('SELECT id, email, is_admin FROM users');
        console.log('\n👥 Users:');
        console.table(users.rows);

        // 2. Check Products
        const productsCount = await client.query('SELECT COUNT(*) FROM products');
        console.log(`\n📦 Total Products: ${productsCount.rows[0].count}`);

        // 3. Check Order Items (potential deletion blockers)
        const orderItems = await client.query('SELECT product_id, COUNT(*) as usage_count FROM order_items GROUP BY product_id');
        console.log('\n🛒 Product Usage in Orders:');
        console.table(orderItems.rows);

        // 4. Check sequences
        const sequences = await client.query(`
            SELECT relname as sequence_name 
            FROM pg_class 
            WHERE relkind = 'S'
        `);
        console.log('\n🔄 Sequences:');
        console.table(sequences.rows);

    } catch (err) {
        console.error('❌ Error checking status:', err);
    } finally {
        client.release();
        process.exit(0);
    }
};

checkStatus();
