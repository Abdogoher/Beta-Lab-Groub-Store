import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { FiHeart } from 'react-icons/fi';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-sm border border-gray-100 dark:border-gray-700 max-w-lg mx-auto">
                        <div className="text-6xl mb-6 flex justify-center text-pink-500">
                            <FiHeart />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">قائمة المفضلة فارغة</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">لم تضف أي منتجات إلى المفضلة بعد. تصفح منتجاتنا وأضف ما يعجبك!</p>
                        <Link
                            to="/products"
                            className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-500/30"
                        >
                            تصفح المنتجات
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900 font-sans" dir="rtl">
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">قائمة المفضلة</h1>
                    <p className="text-gray-600 dark:text-gray-400">لديك {wishlist.length} منتج في المفضلة</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlist.map(product => (
                        <div key={product.id} className="transition-all hover:scale-[1.02]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
