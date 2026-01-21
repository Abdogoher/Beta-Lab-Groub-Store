import express from 'express';
import {
    getAllProducts,
    getFeaturedProducts,
    getProductById,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    getCompanies
} from '../controllers/productsController.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/companies', getCompanies);
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProductById);

// Admin routes
router.post('/', adminAuth, upload.single('image'), createProduct);
router.put('/:id', adminAuth, upload.single('image'), updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

export default router;
