import { dbAll, dbGet } from '../config/postgres.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req, res) => {
    try {
        const categories = await dbAll('SELECT * FROM categories ORDER BY name');

        res.json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب الفئات',
        });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await dbGet('SELECT * FROM categories WHERE id = ?', [id]);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'الفئة غير موجودة',
            });
        }

        res.json({
            success: true,
            data: category,
        });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب الفئة',
        });
    }
};
