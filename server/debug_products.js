import { dbAll } from './config/postgres.js';

async function checkProducts() {
    try {
        const products = await dbAll('SELECT * FROM products');
        console.log(`Total products found: ${products.length}`);
        if (products.length > 0) {
            console.log('Sample product:', JSON.stringify(products[0], null, 2));
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkProducts();
