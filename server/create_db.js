import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const createDatabase = async () => {
    // Connect to the default 'postgres' database first to create the new one
    const client = new Client({
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT || 5432,
        database: 'postgres' // Connect to default DB
    });

    try {
        await client.connect();
        const dbName = process.env.PGDATABASE || 'mini_store';
        
        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        
        if (res.rowCount === 0) {
            console.log(`🏗️  Creating database "${dbName}"...`);
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`✅ Database "${dbName}" created successfully!`);
        } else {
            console.log(`ℹ️  Database "${dbName}" already exists.`);
        }
    } catch (error) {
        console.error('❌ Error creating database:', error);
    } finally {
        await client.end();
    }
};

createDatabase();
