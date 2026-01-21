import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'لا يوجد توكن، غير مصرح بالدخول'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        console.log('Admin Auth Decoded:', decoded);

        // Check if user is admin
        if (decoded.isAdmin) {
            req.user = decoded;
            next();
        } else {
            console.log('Admin Auth Failed: User is not admin', decoded);
            return res.status(403).json({
                success: false,
                message: 'غير مصرح لك بالقيام بهذا الإجراء (Admin Only)'
            });
        }
    } catch (error) {
        console.error('Admin Auth Middleware Error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'توكن غير صالح'
        });
    }
};
