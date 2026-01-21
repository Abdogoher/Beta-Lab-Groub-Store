import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiMapPin, FiCheck, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { sendWhatsAppOrder, STORE_WHATSAPP_NUMBER } from '../utils/whatsappService';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getTotal, clearCart } = useCart();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        fullName: user?.name || user?.fullName || '',
        phone: user?.phone || '',
        address: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب';
        if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
        if (!formData.address.trim()) newErrors.address = 'العنوان التفصيلي مطلوب';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSubmitting(true);
        try {
            const orderData = {
                customer_name: formData.fullName,
                customer_phone: formData.phone,
                customer_address: formData.address,
                notes: formData.notes
            };

            await ordersAPI.create(orderData);
            sendWhatsAppOrder(cart, formData, getTotal(), STORE_WHATSAPP_NUMBER);
            await clearCart();

            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            console.error('Failed to create order:', error);
            setErrors({ submit: 'حدث خطأ أثناء إنشاء الطلب. الرجاء المحاولة مرة أخرى' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900" dir="rtl">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-10 text-center sm:text-right">
                    <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-2">إتمام الطلب</h1>
                    <p className="text-gray-500 dark:text-gray-400">أدخل بياناتك لإتمام عملية الشراء بنجاح</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Form Component */}
                    <div className="lg:col-span-3">
                        <form className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6" onSubmit={handleSubmit}>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-50 dark:border-gray-700 pb-4">
                                <span className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400"><FiMapPin /></span>
                                معلومات التوصيل
                            </h2>

                            {errors.submit && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30">
                                    {errors.submit}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mr-1">الاسم الكامل</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><FiUser /></div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className={`w-full pr-10 pl-4 py-3 bg-gray-50 dark:bg-gray-700 border ${errors.fullName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none transition-all`}
                                            placeholder="أحمد محمد علي"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errors.fullName && <span className="text-red-500 text-xs mt-1 mr-1">{errors.fullName}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mr-1">رقم الهاتف</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><FiPhone /></div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className={`w-full pr-10 pl-4 py-3 bg-gray-50 dark:bg-gray-700 border ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none transition-all`}
                                            placeholder="01234567890"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errors.phone && <span className="text-red-500 text-xs mt-1 mr-1">{errors.phone}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mr-1">العنوان التفصيلي</label>
                                    <textarea
                                        name="address"
                                        className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${errors.address ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none transition-all resize-none`}
                                        placeholder="المنطقة، الشارع، رقم المبنى، الدور..."
                                        rows="3"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                    {errors.address && <span className="text-red-500 text-xs mt-1 mr-1">{errors.address}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mr-1">ملاحظات إضافية (اختياري)</label>
                                    <textarea
                                        name="notes"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none transition-all resize-none"
                                        placeholder="أي ملاحظات أو طلبات خاصة بخصوص التوصيل..."
                                        rows="2"
                                        value={formData.notes}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-[0.98] disabled:opacity-50"
                                disabled={submitting}
                            >
                                <FiCheck size={24} />
                                {submitting ? 'جاري الإرسال...' : 'تأكيد الطلب عبر واتساب'}
                            </button>
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                سيتم توجيهك إلى واتساب لإرسال تفاصيل طلبك
                            </div>
                        </form>
                    </div>

                    {/* Summary Component */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                <FiShoppingBag className="text-indigo-600" />
                                ملخص الطلب
                            </h3>

                            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                                {cart.map(item => {
                                    const currentPrice = item.discount_price || item.price;
                                    const imageUrl = item.image?.startsWith('http')
                                        ? item.image
                                        : `http://localhost:3000${item.image}`;

                                    return (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 flex-shrink-0 border border-gray-100 dark:border-gray-600">
                                                <img src={imageUrl} alt={item.name_ar} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-800 dark:text-white truncate">{item.name_ar}</h4>
                                                <p className="text-xs text-gray-400">الكمية: {item.quantity}</p>
                                            </div>
                                            <div className="text-sm font-bold text-gray-800 dark:text-white">
                                                {(currentPrice * item.quantity).toFixed(0)} ج.م
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-6 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">المجموع الفرعي</span>
                                    <span className="font-bold text-gray-800 dark:text-white">{getTotal().toFixed(0)} ج.م</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">الشحن</span>
                                    <span className="text-green-500 font-bold">مجاناً</span>
                                </div>
                                <div className="flex justify-between items-center text-lg pt-2">
                                    <span className="font-black text-gray-800 dark:text-white">الإجمالي</span>
                                    <span className="font-black text-indigo-600">{getTotal().toFixed(0)} ج.م</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
