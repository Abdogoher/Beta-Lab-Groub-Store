import { dbAll, dbGet, dbRun } from '../config/postgres.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { customer_name, customer_phone, customer_address, notes } = req.body;

        // Validate input
        if (!customer_name || !customer_phone || !customer_address) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء إدخال جميع البيانات المطلوبة',
            });
        }

        // Get cart items
        const cartItems = await dbAll(`
      SELECT c.*, p.price, p.discount_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [userId]);

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'السلة فارغة',
            });
        }

        // Calculate total
        const totalAmount = cartItems.reduce((sum, item) => {
            const price = item.discount_price || item.price;
            return sum + (price * item.quantity);
        }, 0);

        // Create order
        const orderResult = await dbRun(
            `INSERT INTO orders (user_id, total_amount, customer_name, customer_phone, customer_address, notes)
       VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
            [userId, totalAmount, customer_name, customer_phone, customer_address, notes || null]
        );

        const orderId = orderResult.lastID;

        // Create order items
        for (const item of cartItems) {
            const price = item.discount_price || item.price;
            await dbRun(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, price]
            );
        }

        // Clear cart
        await dbRun('DELETE FROM cart WHERE user_id = ?', [userId]);

        // Get complete order details
        const order = await dbGet(`
      SELECT * FROM orders WHERE id = ?
    `, [orderId]);

        const orderItems = await dbAll(`
      SELECT oi.*, p.name, p.name_ar, p.image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الطلب بنجاح',
            data: {
                order,
                items: orderItems,
            },
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في إنشاء الطلب',
        });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await dbAll(`
      SELECT * FROM orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);

        // Get items for each order
        for (const order of orders) {
            const items = await dbAll(`
        SELECT oi.*, p.name, p.name_ar, p.image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
            order.items = items;
        }

        res.json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب الطلبات',
        });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const order = await dbGet(`
      SELECT * FROM orders 
      WHERE id = ? AND user_id = ?
    `, [id, userId]);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'الطلب غير موجود',
            });
        }

        // Get order items
        const items = await dbAll(`
      SELECT oi.*, p.name, p.name_ar, p.image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);

        order.items = items;

        res.json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب الطلب',
        });
    }
};
