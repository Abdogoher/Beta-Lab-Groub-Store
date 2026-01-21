import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center max-w-md w-full">
                    <div className="text-6xl mb-6 text-indigo-200">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">سلة المشتريات فارغة</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">تبدو سلتك فارغة حالياً. هل ترغب في تصفح منتجاتنا؟</p>
                    <Link to="/products" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30">
                        ابدأ التسوق
                        <FiArrowLeft className="rotate-180" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-2">سلة المشتريات</h1>
                    <p className="text-gray-500 dark:text-gray-400">لديك {cart.length} منتج في السلة</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => {
                            const hasDiscount = !!item.discount_price;
                            const currentPrice = hasDiscount ? item.discount_price : item.price;

                            // Fix image URL
                            const imageUrl = item.image?.startsWith('http')
                                ? item.image
                                : `http://localhost:3000${item.image}`;

                            return (
                                <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-shadow">
                                    <div className="w-full sm:w-24 h-24 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-700 flex-shrink-0">
                                        <img src={imageUrl} alt={item.name_ar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <div className="flex-1 text-center sm:text-right">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{item.name_ar}</h3>
                                        <div className="text-sm text-gray-400 mb-2">{item.category_name_ar || 'تصنيف عام'}</div>

                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                            <span className="text-indigo-600 font-bold text-lg">{currentPrice} ج.م</span>
                                            {hasDiscount && (
                                                <span className="text-gray-400 text-sm line-through">{item.price} ج.m</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1 h-10">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-600 text-gray-500 transition-colors"
                                            >
                                                <FiMinus />
                                            </button>
                                            <span className="w-10 text-center font-bold text-gray-800 dark:text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-600 text-gray-500 transition-colors"
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-400 hover:text-red-500 p-2 transition-colors flex items-center gap-1 text-sm font-medium"
                                        >
                                            <FiTrash2 />
                                            <span className="sm:hidden lg:inline">حذف</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border-2 border-indigo-50 dark:border-gray-700 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">ملخص الطلب</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                    <span>المجموع الفرعي</span>
                                    <span className="font-bold">{getTotal()} ج.م</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                    <span>الشحن</span>
                                    <span className="text-green-500 font-bold">مجاناً</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-8">
                                <div className="flex justify-between items-center text-gray-800 dark:text-white text-xl">
                                    <span className="font-black">الإجمالي</span>
                                    <span className="font-black text-indigo-600">{getTotal()} ج.م</span>
                                </div>
                            </div>

                            <button
                                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                                onClick={() => navigate('/checkout')}
                            >
                                <FiShoppingBag size={20} />
                                إتمام الطلب
                            </button>

                            <Link
                                to="/products"
                                className="mt-4 w-full flex justify-center text-gray-400 text-sm hover:text-indigo-600 transition-colors"
                            >
                                متابعة التسوق
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
