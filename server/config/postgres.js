import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT || 5432,
});

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Helper to convert '?' placeholders to '$1, $2, ...' for PostgreSQL
const convertPlaceholders = (sql) => {
    let count = 1;
    return sql.replace(/\?/g, () => `$${count++}`);
};

// Helper functions to mimic SQLite-like interface for easier migration
export const dbRun = async (sql, params = []) => {
    try {
        const convertedSql = convertPlaceholders(sql);
        const result = await pool.query(convertedSql, params);
        // Note: To get lastID, you should use RETURNING id in your SQL
        return { lastID: result.rows[0]?.id || null, changes: result.rowCount };
    } catch (error) {
        console.error('dbRun Error:', error.message);
        console.error('SQL:', sql);
        console.error('Params:', params);
        throw error;
    }
};

export const dbGet = async (sql, params = []) => {
    try {
        const convertedSql = convertPlaceholders(sql);
        const result = await pool.query(convertedSql, params);
        return result.rows[0];
    } catch (error) {
        console.error('dbGet Error:', error.message);
        console.error('SQL:', sql);
        console.error('Params:', params);
        throw error;
    }
};

export const dbAll = async (sql, params = []) => {
    try {
        const convertedSql = convertPlaceholders(sql);
        const result = await pool.query(convertedSql, params);
        return result.rows;
    } catch (error) {
        console.error('dbAll Error:', error.message);
        console.error('SQL:', sql);
        console.error('Params:', params);
        throw error;
    }
};

export default pool;
