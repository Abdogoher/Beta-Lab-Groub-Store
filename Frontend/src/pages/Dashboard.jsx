import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI, adminAPI } from '../services/api';
import { FiEdit, FiTrash2, FiPlus, FiX, FiCheck, FiUpload } from 'react-icons/fi';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        name_ar: '',
        description: '',
        description_ar: '',
        price: '',
        discount_value: '',
        category_id: '',
        stock_quantity: '',
        is_featured: false,
        company: '',
        imageFile: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                productsAPI.getAll({ sort: 'newest' }),
                categoriesAPI.getAll()
            ]);
            setProducts(productsRes.data.data || []);
            setCategories(categoriesRes.data.data || []);
        } catch (err) {
            console.error('Failed to load data', err);
            setError('فشل في تحميل البيانات');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            if (file) {
                setFormData({ ...formData, imageFile: file });
                setImagePreview(URL.createObjectURL(file));
            }
        } else if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('name_ar', formData.name_ar);
            data.append('description', formData.description);
            data.append('description_ar', formData.description_ar);
            data.append('price', formData.price);
            if (formData.discount_value) data.append('discount_value', formData.discount_value);
            data.append('category_id', formData.category_id);
            data.append('stock_quantity', formData.stock_quantity);
            data.append('is_featured', formData.is_featured ? 1 : 0);
            data.append('company', formData.company);

            if (formData.imageFile) {
                data.append('image', formData.imageFile);
            } else if (editingProduct && editingProduct.image) {
                // If editing and no new file, backend preserves old one usually, 
                // but we might need to send image URL if we want to be explicit? 
                // Actually our controller code handles "no file" by using existing if not provided.
                // But we should check logic. Controller: 
                // if (req.file) ... else if (req.body.image) ...
                // So if we don't send anything, it might default to undefined in req.body.image.
                // In updateProduct: "let image = existingProduct.image; if (file) ... else if (body.image) ..."
                // So not sending anything preserves existing. Good.
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (editingProduct) {
                await adminAPI.updateProduct(editingProduct.id, data, config);
                setSuccess('تم تحديث المنتج بنجاح');
            } else {
                await adminAPI.createProduct(data, config);
                setSuccess('تم إضافة المنتج بنجاح');
            }

            setShowForm(false);
            setEditingProduct(null);
            resetForm();
            loadData();
        } catch (err) {
            console.error('Operation failed', err);
            setError('حدث خطأ أثناء تنفيذ العملية. تأكد من صحة البيانات.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            try {
                await adminAPI.deleteProduct(id);
                setSuccess('تم حذف المنتج بنجاح');
                loadData();
            } catch (err) {
                console.error('Delete failed', err);
                setError('فشل حذف المنتج');
            }
        }
    };

    const startEdit = (product) => {
        setEditingProduct(product);
        // Calculate discount value from price - discount_price
        let discountVal = '';
        if (product.discount_price) {
            discountVal = (product.price - product.discount_price).toFixed(2);
        }

        setFormData({
            name: product.name,
            name_ar: product.name_ar,
            description: product.description,
            description_ar: product.description_ar,
            price: product.price,
            discount_value: discountVal,
            category_id: product.category_id,
            stock_quantity: product.stock_quantity,
            is_featured: product.is_featured === 1,
            company: product.company || '',
            imageFile: null
        });

        // Show existing image
        // Fix image URL if it's a relative path (uploads)
        const imgUrl = product.image?.startsWith('http')
            ? product.image
            : `http://localhost:3000${product.image}`;
        setImagePreview(imgUrl);

        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            name_ar: '',
            description: '',
            description_ar: '',
            price: '',
            discount_value: '',
            category_id: '',
            stock_quantity: '',
            is_featured: false,
            company: '',
            imageFile: null
        });
        setImagePreview(null);
    };

    const cancelEdit = () => {
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">لوحة التحكم</h1>
                <button
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${showForm
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                    onClick={() => {
                        if (showForm) {
                            cancelEdit();
                        } else {
                            resetForm();
                            setEditingProduct(null);
                            setShowForm(true);
                        }
                    }}
                >
                    {showForm ? <><FiX /> إغلاق</> : <><FiPlus /> إضافة منتج جديد</>}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 relative">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 relative">
                    {success}
                </div>
            )}

            {showForm && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                        {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الاسم (إنجليزي)</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الاسم (عربي)</label>
                                <input
                                    type="text"
                                    name="name_ar"
                                    value={formData.name_ar}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">السعر</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    step="0.01"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">قيمة الخصم (وليس السعر النهائي)</label>
                                <input
                                    type="number"
                                    name="discount_value"
                                    value={formData.discount_value}
                                    onChange={handleChange}
                                    step="0.01"
                                    placeholder="مثلاً: 20"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الفئة</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">اختر الفئة</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name_ar} - {cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الكمية</label>
                                <input
                                    type="number"
                                    name="stock_quantity"
                                    value={formData.stock_quantity}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الشركة</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    placeholder="مثلاً: Vodafone, Sigma, Bosch"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">صورة المنتج</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                        <FiUpload className="text-gray-600 dark:text-gray-300" />
                                        <span className="text-gray-700 dark:text-gray-300">اختر صورة</span>
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الوصف (إنجليزي)</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                ></textarea>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الوصف (عربي)</label>
                                <textarea
                                    name="description_ar"
                                    value={formData.description_ar}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_featured"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="is_featured" className="text-gray-700 dark:text-gray-300 font-medium">
                                منتج مميز
                            </label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                {editingProduct ? 'تحديث' : 'حفظ'}
                            </button>
                            <button type="button" className="px-6 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={cancelEdit}>
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">قائمة المنتجات ({products.length})</h3>
                {loading ? (
                    <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="pb-3 text-gray-500 font-medium">الصورة</th>
                                    <th className="pb-3 text-gray-500 font-medium">الاسم</th>
                                    <th className="pb-3 text-gray-500 font-medium">السعر</th>
                                    <th className="pb-3 text-gray-500 font-medium">الشركة</th>
                                    <th className="pb-3 text-gray-500 font-medium">الكمية</th>
                                    <th className="pb-3 text-gray-500 font-medium">مميز</th>
                                    <th className="pb-3 text-gray-500 font-medium">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {products.map(product => {
                                    const imgUrl = product.image?.startsWith('http')
                                        ? product.image
                                        : `http://localhost:3000${product.image}`;

                                    return (
                                        <tr key={product.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="py-3">
                                                <img src={imgUrl} alt={product.name} className="h-12 w-12 object-cover rounded-lg" />
                                            </td>
                                            <td className="py-3">
                                                <div className="text-gray-800 dark:text-gray-200 font-medium">{product.name_ar}</div>
                                                <div className="text-gray-500 text-sm">{product.name}</div>
                                            </td>
                                            <td className="py-3">
                                                {product.discount_price ? (
                                                    <div className="flex flex-col">
                                                        <span className="line-through text-gray-400 text-xs">{product.price}</span>
                                                        <span className="text-red-600 font-bold">{product.discount_price}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-800 dark:text-gray-200">{product.price}</span>
                                                )}
                                            </td>
                                            <td className="py-3 text-gray-600 dark:text-gray-400">{product.company}</td>
                                            <td className="py-3 text-gray-600 dark:text-gray-400">{product.stock_quantity}</td>
                                            <td className="py-3">
                                                {product.is_featured ?
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <FiCheck className="mr-1" /> مميز
                                                    </span>
                                                    : <span className="text-gray-400">-</span>
                                                }
                                            </td>
                                            <td className="py-3 flex gap-2">
                                                <button
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    onClick={() => startEdit(product)}
                                                    title="تعديل"
                                                >
                                                    <FiEdit size={18} />
                                                </button>
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    onClick={() => handleDelete(product.id)}
                                                    title="حذف"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
