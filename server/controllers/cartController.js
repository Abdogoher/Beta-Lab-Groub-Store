import { dbAll, dbGet, dbRun } from '../config/postgres.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cartItems = await dbAll(`
      SELECT 
        c.id as cart_id,
        c.quantity,
        p.*,
        cat.name as category_name,
        cat.name_ar as category_name_ar
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `, [userId]);

        res.json({
            success: true,
            count: cartItems.length,
            data: cartItems,
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب السلة',
        });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity = 1 } = req.body;

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

        // Check if already in cart
        const existingItem = await dbGet(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, product_id]
        );

        if (existingItem) {
            // Update quantity
            await dbRun(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity, userId, product_id]
            );
        } else {
            // Add new item
            await dbRun(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, product_id, quantity]
            );
        }

        // Return updated cart
        const cartItems = await dbAll(`
      SELECT 
        c.id as cart_id,
        c.quantity,
        p.*,
        cat.name as category_name,
        cat.name_ar as category_name_ar
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE c.user_id = ?
    `, [userId]);

        res.json({
            success: true,
            message: 'تمت الإضافة للسلة بنجاح',
            data: cartItems,
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في إضافة المنتج للسلة',
        });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'الكمية غير صحيحة',
            });
        }

        await dbRun(
            'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [quantity, userId, productId]
        );

        res.json({
            success: true,
            message: 'تم تحديث الكمية بنجاح',
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في تحديث السلة',
        });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        await dbRun(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        res.json({
            success: true,
            message: 'تم حذف المنتج من السلة',
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في حذف المنتج من السلة',
        });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        await dbRun('DELETE FROM cart WHERE user_id = ?', [userId]);

        res.json({
            success: true,
            message: 'تم تفريغ السلة بنجاح',
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في تفريغ السلة',
        });
    }
};
