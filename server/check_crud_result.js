import { dbAll } from './config/postgres.js';

async function checkProduct() {
    try {
        const products = await dbAll("SELECT * FROM products WHERE name = 'CRUD Test'");
        console.log('Found Products:', JSON.stringify(products, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkProduct();
