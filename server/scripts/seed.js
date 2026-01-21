import { dbRun, dbGet, dbAll } from '../config/postgres.js';
import { initializePostgres } from '../config/init_db.js';
import bcrypt from 'bcryptjs';

const sampleImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500',
];

const seedPostgres = async () => {
    try {
        console.log('🌱 Starting PostgreSQL database seeding...');

        // Initialize tables first
        await initializePostgres();

        // Seed Categories
        const categoriesData = [
            { name: 'Cards', name_ar: 'كروت', description: 'Gift cards and prepaid cards' },
            { name: 'Chemistry', name_ar: 'كيمياء', description: 'Chemical products and materials' },
            { name: 'Supplies', name_ar: 'مستلزمات', description: 'General supplies and tools' },
            { name: 'Devices', name_ar: 'أجهزة', description: 'Electronic and laboratory devices' },
        ];

        console.log('📦 Seeding categories...');
        for (const cat of categoriesData) {
            await dbRun(
                'INSERT INTO categories (name, name_ar, description) VALUES (?, ?, ?) ON CONFLICT (name_ar) DO NOTHING',
                [cat.name, cat.name_ar, cat.description]
            );
        }

        // Get category IDs
        const categories = await dbAll('SELECT id, name_ar FROM categories');
        const getCatId = (nameAr) => categories.find(c => c.name_ar === nameAr)?.id;

        // Seed Products with Companies
        const products = [
            { name: 'Card A', name_ar: 'كارت شحن أ', price: 100, category_id: getCatId('كروت'), company: 'Vodafone', image: sampleImages[0] },
            { name: 'Card B', name_ar: 'كارت شحن ب', price: 200, category_id: getCatId('كروت'), company: 'Orange', image: sampleImages[1] },
            { name: 'Chemical X', name_ar: 'مادة كيميائية س', price: 500, category_id: getCatId('كيمياء'), company: 'Sigma', image: sampleImages[2] },
            { name: 'Tool Y', name_ar: 'أداة مستلزمات ص', price: 50, category_id: getCatId('مستلزمات'), company: 'Bosch', image: sampleImages[3] },
            { name: 'Device Z', name_ar: 'جهاز مختبر ع', price: 5000, category_id: getCatId('أجهزة'), company: 'Thermo Fisher', image: sampleImages[0] },
        ];

        console.log('🎁 Seeding products...');
        for (const p of products) {
            await dbRun(
                `INSERT INTO products (name, name_ar, price, category_id, company, image)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [p.name, p.name_ar, p.price, p.category_id, p.company, p.image]
            );
        }

        // Users
        const adminPassword = await bcrypt.hash('admin123', 10);
        await dbRun(`
            INSERT INTO users (name, email, password, is_admin)
            VALUES (?, ?, ?, ?) ON CONFLICT (email) DO NOTHING
        `, ['Admin', 'admin@store.com', adminPassword, true]);

        console.log('✅ Seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedPostgres();
