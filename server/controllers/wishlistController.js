import { dbAll, dbGet, dbRun } from '../config/postgres.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlistItems = await dbAll(`
      SELECT 
        w.id as wishlist_id,
        p.*,
        cat.name as category_name,
        cat.name_ar as category_name_ar
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `, [userId]);

        res.json({
            success: true,
            count: wishlistItems.length,
            data: wishlistItems,
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب المفضلة',
        });
    }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء تحديد المنتج',
            });
        }

        // Check if product exists
        const product = await dbGet('SELECT * FROM products WHERE id = ?', [product_id]);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'المنتج غير موجود',
            });
        }

        // Check if already in wishlist
        const existingItem = await dbGet(
            'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );

        if (existingItem) {
            return res.status(400).json({
                success: false,
                message: 'المنتج موجود بالفعل في المفضلة',
            });
        }

        // Add to wishlist
        await dbRun(
            'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
            [userId, product_id]
        );

        res.status(201).json({
            success: true,
            message: 'تمت الإضافة للمفضلة بنجاح',
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في إضافة المنتج للمفضلة',
        });
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        await dbRun(
            'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        res.json({
            success: true,
            message: 'تم حذف المنتج من المفضلة',
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في حذف المنتج من المفضلة',
        });
    }
};
