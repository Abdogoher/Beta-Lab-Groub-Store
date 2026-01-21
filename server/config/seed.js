import { dbRun, dbGet, initializeDatabase } from './database.js';
import bcrypt from 'bcryptjs';

// Sample product images (using placeholder images)
const sampleImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500',
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Initialize database
        await initializeDatabase();

        // Check if data already exists
        const existingCategory = await dbGet('SELECT id FROM categories LIMIT 1');
        if (existingCategory) {
            console.log('⚠️  Database already seeded. Skipping...');
            return;
        }

        // Seed Categories
        const categories = [
            { name: 'Electronics', name_ar: 'إلكترونيات', description: 'Electronic devices and gadgets' },
            { name: 'Fashion', name_ar: 'أزياء', description: 'Clothing and accessories' },
            { name: 'Accessories', name_ar: 'إكسسوارات', description: 'Fashion accessories' },
            { name: 'Home Decor', name_ar: 'ديكور منزلي', description: 'Home decoration items' },
            { name: 'Sports', name_ar: 'رياضة', description: 'Sports equipment and gear' },
            { name: 'Books', name_ar: 'كتب', description: 'Books and literature' },
        ];

        console.log('📦 Seeding categories...');
        for (const cat of categories) {
            await dbRun(
                'INSERT INTO categories (name, name_ar, description) VALUES (?, ?, ?)',
                [cat.name, cat.name_ar, cat.description]
            );
        }

        // Seed Products
        const products = [
            // Electronics
            { name: 'Wireless Headphones', name_ar: 'سماعات لاسلكية', description: 'Premium wireless headphones with noise cancellation', description_ar: 'سماعات لاسلكية فاخرة مع عزل الضوضاء', price: 299.99, discount_price: 249.99, category_id: 1, image: sampleImages[0], stock_quantity: 50, is_featured: 1 },
            { name: 'Smart Watch', name_ar: 'ساعة ذكية', description: 'Fitness tracker smartwatch', description_ar: 'ساعة ذكية لتتبع اللياقة', price: 199.99, discount_price: null, category_id: 1, image: sampleImages[1], stock_quantity: 30, is_featured: 1 },
            { name: 'Bluetooth Speaker', name_ar: 'سماعة بلوتوث', description: 'Portable bluetooth speaker', description_ar: 'سماعة بلوتوث محمولة', price: 79.99, discount_price: 59.99, category_id: 1, image: sampleImages[2], stock_quantity: 100, is_featured: 0 },

            // Fashion
            { name: 'Sunglasses', name_ar: 'نظارة شمسية', description: 'Stylish UV protection sunglasses', description_ar: 'نظارة شمسية عصرية مع حماية من الأشعة', price: 89.99, discount_price: null, category_id: 2, image: sampleImages[3], stock_quantity: 75, is_featured: 1 },
            { name: 'Leather Bag', name_ar: 'حقيبة جلدية', description: 'Premium leather handbag', description_ar: 'حقيبة يد جلدية فاخرة', price: 149.99, discount_price: 129.99, category_id: 2, image: sampleImages[4], stock_quantity: 40, is_featured: 0 },

            // Sports
            { name: 'Running Shoes', name_ar: 'حذاء رياضي', description: 'Professional running shoes', description_ar: 'حذاء رياضي احترافي للجري', price: 129.99, discount_price: null, category_id: 5, image: sampleImages[5], stock_quantity: 60, is_featured: 1 },
            { name: 'Yoga Mat', name_ar: 'سجادة يوغا', description: 'Non-slip yoga mat', description_ar: 'سجادة يوغا مانعة للانزلاق', price: 39.99, discount_price: 29.99, category_id: 5, image: sampleImages[6], stock_quantity: 80, is_featured: 0 },

            // Accessories
            { name: 'Luxury Watch', name_ar: 'ساعة فاخرة', description: 'Elegant luxury watch', description_ar: 'ساعة فاخرة أنيقة', price: 499.99, discount_price: 399.99, category_id: 3, image: sampleImages[7], stock_quantity: 20, is_featured: 1 },
        ];

        console.log('🎁 Seeding products...');
        for (const product of products) {
            await dbRun(
                `INSERT INTO products (name, name_ar, description, description_ar, price, discount_price, category_id, image, stock_quantity, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [product.name, product.name_ar, product.description, product.description_ar, product.price, product.discount_price, product.category_id, product.image, product.stock_quantity, product.is_featured]
            );
        }

        // Create demo user
        const hashedPassword = await bcrypt.hash('demo123', 10);
        await dbRun(`
      INSERT OR IGNORE INTO users (name, email, password, phone, is_admin)
      VALUES (?, ?, ?, ?, ?)
    `, ['Demo User', 'demo@jawhar.com', hashedPassword, '0123456789', 0]);

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        await dbRun(`
      INSERT OR IGNORE INTO users (name, email, password, phone, is_admin)
      VALUES (?, ?, ?, ?, ?)
    `, ['Admin User', 'admin@jawhar.com', adminPassword, '0000000000', 1]);

        console.log('👤 Seeding users completed...');
        console.log('✅ Database seeding completed successfully!');
        console.log('\n📝 Demo User Credentials:');
        console.log('   Email: demo@jawhar.com');
        console.log('   Password: demo123\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        process.exit(0);
    }
};

seedDatabase();
