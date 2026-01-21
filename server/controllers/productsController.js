import { dbAll, dbGet, dbRun } from '../config/postgres.js';

// @desc    Get all products with filtering and sorting
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
    try {
        const {
            category,
            search,
            company,
            sort = 'newest',
            min_price,
            max_price,
            featured
        } = req.query;

        let query = `
      SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
        const params = [];

        // Filter by category
        if (category) {
            query += ' AND p.category_id = ?';
            params.push(category);
        }

        // Filter by company
        if (company) {
            query += ' AND p.company = ?';
            params.push(company);
        }

        // Filter by search
        if (search) {
            query += ' AND (p.name LIKE ? OR p.name_ar LIKE ? OR p.description LIKE ? OR p.description_ar LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        // Filter by price range
        if (min_price) {
            query += ' AND p.price >= ?';
            params.push(parseFloat(min_price));
        }
        if (max_price) {
            query += ' AND p.price <= ?';
            params.push(parseFloat(max_price));
        }

        // Filter by featured
        if (featured === 'true') {
            query += ' AND p.is_featured = TRUE';
        }

        // Sorting
        switch (sort) {
            case 'price_asc':
                query += ' ORDER BY p.price ASC';
                break;
            case 'price_desc':
                query += ' ORDER BY p.price DESC';
                break;
            case 'name':
                query += ' ORDER BY p.name ASC';
                break;
            case 'newest':
            default:
                query += ' ORDER BY p.created_at DESC';
                break;
        }

        const products = await dbAll(query, params);

        res.json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب المنتجات',
        });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
    try {
        const products = await dbAll(`
      SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = TRUE
      ORDER BY p.created_at DESC
    `);

        res.json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب المنتجات المميزة',
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await dbGet(`
      SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'المنتج غير موجود',
            });
        }

        res.json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب المنتج',
        });
    }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const products = await dbAll(`
      SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ?
      ORDER BY p.created_at DESC
    `, [categoryId]);

        res.json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب منتجات الفئة',
        });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req, res) => {
    try {
        const { name, name_ar, description, description_ar, price, discount_value, category_id, stock_quantity, is_featured, company } = req.body;

        let image = req.body.image; // Fallback if no file uploaded (legacy support)
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        // Basic validation
        if (!name || !price || !category_id) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء إدخال الحقول المطلوبة (الاسم، السعر، الفئة)'
            });
        }

        // Normalize values for PostgreSQL
        const numPrice = Number(price);
        const numCategoryId = Number(category_id);
        const numStock = Number(stock_quantity || 0);
        const boolIsFeatured = is_featured === true || is_featured === 'true' || is_featured === 1 || is_featured === '1';

        // Calculate discount price
        let discount_price = null;
        if (discount_value && Number(discount_value) > 0) {
            discount_price = numPrice - Number(discount_value);
        }

        const result = await dbRun(
            `INSERT INTO products (name, name_ar, description, description_ar, price, discount_price, category_id, image, stock_quantity, is_featured, company)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
            [name, name_ar, description, description_ar, numPrice, discount_price, numCategoryId, image, numStock, boolIsFeatured, company]
        );

        const newProduct = await dbGet('SELECT * FROM products WHERE id = ?', [result.lastID]);

        res.status(201).json({
            success: true,
            message: 'تم إضافة المنتج بنجاح',
            data: newProduct
        });
    } catch (error) {
        console.error('Create product error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'خطأ في إضافة المنتج',
            error: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, name_ar, description, description_ar, price, discount_value, category_id, stock_quantity, is_featured, company } = req.body;

        // Check if product exists
        const existingProduct = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'المنتج غير موجود'
            });
        }

        let image = existingProduct.image;
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            // Allow updating image via URL if provided explicitly, though API usually sends file or nothing
            image = req.body.image;
        }

        // Normalize values for PostgreSQL
        const numPrice = Number(price);
        const numCategoryId = Number(category_id);
        const numStock = Number(stock_quantity || 0);
        const boolIsFeatured = is_featured === true || is_featured === 'true' || is_featured === 1 || is_featured === '1';

        // Calculate discount price
        let discount_price = null;
        if (discount_value && Number(discount_value) > 0) {
            discount_price = numPrice - Number(discount_value);
        }

        await dbRun(
            `UPDATE products 
             SET name = ?, name_ar = ?, description = ?, description_ar = ?, price = ?, discount_price = ?, category_id = ?, image = ?, stock_quantity = ?, is_featured = ?, company = ?
             WHERE id = ?`,
            [name, name_ar, description, description_ar, numPrice, discount_price, numCategoryId, image, numStock, boolIsFeatured, company, id]
        );

        const updatedProduct = await dbGet('SELECT * FROM products WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'تم تحديث المنتج بنجاح',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Update product error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'خطأ في تحديث المنتج',
            error: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if product exists
        const existingProduct = await dbGet('SELECT id FROM products WHERE id = ?', [id]);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'المنتج غير موجود'
            });
        }

        await dbRun('DELETE FROM products WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'تم حذف المنتج بنجاح'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'خطأ في حذف المنتج',
            error: error.message
        });
    }
};
// @desc    Get all unique companies
// @route   GET /api/products/companies
// @access  Public
export const getCompanies = async (req, res) => {
    try {
        const { categoryId } = req.query;
        let query = 'SELECT DISTINCT company FROM products WHERE company IS NOT NULL AND company != \'\'';
        const params = [];

        if (categoryId) {
            query += ' AND category_id = ?';
            params.push(categoryId);
        }

        query += ' ORDER BY company ASC';

        const companies = await dbAll(query, params);
        res.json({
            success: true,
            data: companies.map(c => c.company),
        });
    } catch (error) {
        console.error('Get companies error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب الشركات',
        });
    }
};
