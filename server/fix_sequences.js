import pool from './config/postgres.js';

const fixSequences = async () => {
    const client = await pool.connect();
    try {
        console.log('🔄 Fixing PostgreSQL sequences...');

        // Get all tables and their serial columns
        const res = await client.query(`
            SELECT table_name, column_name, column_default
            FROM information_schema.columns
            WHERE column_default LIKE 'nextval%'
            AND table_schema = 'public'
        `);

        for (const row of res.rows) {
            const tableName = row.table_name;
            const columnName = row.column_name;

            // Extract sequence name from column_default
            // format is: nextval('users_id_seq'::regclass)
            const seqMatch = row.column_default.match(/'([^']+)'/);
            if (seqMatch) {
                const seqName = seqMatch[1];

                console.log(`  - Resetting ${seqName} for ${tableName}.${columnName}`);

                // Get max ID from the table
                const maxRes = await client.query(`SELECT MAX(${columnName}) FROM ${tableName}`);
                const maxId = maxRes.rows[0].max || 0;

                // Set the sequence to max ID + 1
                await client.query(`SELECT setval('${seqName}', ${maxId}, true)`);
                console.log(`    ✅ Set to ${maxId}`);
            }
        }

        console.log('🚀 All sequences fixed successfully!');
    } catch (err) {
        console.error('❌ Error fixing sequences:', err);
    } finally {
        client.release();
        process.exit(0);
    }
};

fixSequences();
