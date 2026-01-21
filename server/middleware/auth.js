import jwt from 'jsonwebtoken';
import { dbGet } from '../config/postgres.js';

export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'لا يوجد رمز مصادقة، الرجاء تسجيل الدخول'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            // Get user from database
            const user = await dbGet(
                'SELECT id, email, name, phone, is_admin FROM users WHERE id = ?',
                [decoded.id]
            );

            // Normalize isAdmin boolean
            if (user) {
                user.isAdmin = !!user.is_admin;
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'المستخدم غير موجود'
                });
            }

            // Add user to request object
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'رمز المصادقة غير صالح'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في المصادقة'
        });
    }
};
