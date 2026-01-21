import sqlite3 from 'sqlite3';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const dbPath = join(__dirname, '../database.sqlite');
const sqliteDb = new sqlite3.Database(dbPath);

const pgPool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT || 5432,
});

const migrateTable = async (tableName) => {
    return new Promise((resolve, reject) => {
        sqliteDb.all(`SELECT * FROM ${tableName}`, async (err, rows) => {
            if (err) return reject(err);
            if (rows.length === 0) return resolve();

            const columns = Object.keys(rows[0]);
            const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
            const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;

            for (const row of rows) {
                const values = columns.map(col => row[col]);
                await pgPool.query(sql, values);
            }
            console.log(`✅ Migrated ${rows.length} rows from ${tableName}`);
            resolve();
        });
    });
};

const runMigration = async () => {
    try {
        const tables = ['users', 'categories', 'products', 'cart', 'wishlist', 'orders', 'order_items'];
        for (const table of tables) {
            await migrateTable(table);
        }
        console.log('🚀 Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

runMigration();
