import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'database.sqlite');

const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to the SQLite database.');
});

const tablesToClear = [
    'order_items',
    'cart_items',
    'wishlist_items',
    'products',
    'orders'
];

db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    tablesToClear.forEach(table => {
        db.run(`DELETE FROM ${table}`, (err) => {
            if (err) {
                console.error(`Error clearing table ${table}:`, err.message);
                // Continue despite errors for now, or you could rollback
            } else {
                console.log(`Cleared table: ${table}`);
            }
        });

        // Reset auto-increment counters
        db.run(`DELETE FROM sqlite_sequence WHERE name='${table}'`, (err) => {
            // Ignore errors here
        });
    });

    db.run("COMMIT", (err) => {
        if (err) {
            console.error('Error committing transaction:', err.message);
        } else {
            console.log('Data cleanup completed successfully.');
        }
        db.close();
    });
});
