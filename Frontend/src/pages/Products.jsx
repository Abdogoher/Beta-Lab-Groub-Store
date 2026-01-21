import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { productsAPI, categoriesAPI } from '../services/api';
import { FiSliders, FiX, FiFilter } from 'react-icons/fi';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [loadingCompanies, setLoadingCompanies] = useState(false);

    // Load initial categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await categoriesAPI.getAll();
                setCategories(response.data.data || []);
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
        loadCategories();
    }, []);

    // Load companies whenever selectedCategory changes
    useEffect(() => {
        const loadCompanies = async () => {
            try {
                setLoadingCompanies(true);
                const response = await productsAPI.getCompanies(selectedCategory);
                setCompanies(response.data.data || []);
                // Reset selected company if it's no longer in the new companies list
                if (selectedCompany && !response.data.data?.includes(selectedCompany)) {
                    setSelectedCompany(null);
                }
            } catch (error) {
                console.error('Failed to load companies:', error);
            } finally {
                setLoadingCompanies(false);
            }
        };

        loadCompanies();
    }, [selectedCategory]);

    // Reset company when category changes
    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
        setSelectedCompany(null);
    };

    // Load products with filters
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const params = {
                    sort: sortBy,
                };

                if (selectedCategory) params.category = selectedCategory;
                if (selectedCompany) params.company = selectedCompany;
                if (priceRange.min) params.min_price = priceRange.min;
                if (priceRange.max) params.max_price = priceRange.max;

                const response = await productsAPI.getAll(params);
                setProducts(response.data.data || []);
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [selectedCategory, selectedCompany, priceRange, sortBy]);

    return (
        <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900" dir="rtl">
            <div className="container mx-auto px-4">
                {/* 1. Top Categories Buttons (5 columns) */}
                <div className="grid grid-cols-2 md:px-80 md:grid-cols-5 gap-4 mb-10">
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={`py-2 px-2 rounded-3xl transition-all shadow-lg flex flex-col items-center justify-center gap-3 border-4 ${!selectedCategory
                            ? 'bg-indigo-600 border-indigo-200 text-white scale-105 shadow-indigo-100'
                            : 'bg-white dark:bg-gray-800 border-white dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:border-indigo-100'
                            }`}
                    >
                        <span className="text-xl font-black">الكل</span>
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`py-2 px-2 rounded-3xl transition-all shadow-lg flex flex-col items-center justify-center gap-3 border-4 ${selectedCategory === cat.id
                                ? 'bg-indigo-600 border-indigo-200 text-white scale-105 shadow-indigo-100'
                                : 'bg-white dark:bg-gray-800 border-white dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:border-indigo-100'
                                }`}
                        >
                            <span className="text-xl font-black">{cat.name_ar || cat.name}</span>
                        </button>
                    ))}
                    {!categories.length && [1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-3xl"></div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row-reverse gap-8">
                    {/* 2. Companies Sidebar (Right Side) */}
                    <aside className="w-full md:w-80 order-1 md:order-2">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24">
                            <div className="flex items-center gap-2 mb-8 border-b pb-4">
                                <FiFilter className="text-indigo-600 text-2xl" />
                                <h3 className="text-2xl font-black text-gray-800 dark:text-white">الشركات</h3>
                            </div>

                            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar px-1">
                                <button
                                    onClick={() => setSelectedCompany(null)}
                                    className={`w-full text-right px-5 py-4 rounded-2xl transition-all border-2 ${!selectedCompany
                                        ? 'bg-indigo-50 border-indigo-100 text-indigo-700 font-bold shadow-sm'
                                        : 'bg-gray-50 dark:bg-gray-900 border-transparent text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:border-gray-200'}`}
                                >
                                    جميع الشركات
                                </button>

                                {loadingCompanies ? (
                                    [1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-2xl"></div>)
                                ) : companies.length > 0 ? (
                                    companies.map(company => (
                                        <button
                                            key={company}
                                            onClick={() => setSelectedCompany(company)}
                                            className={`w-full text-right px-5 py-4 rounded-2xl transition-all border-2 ${selectedCompany === company
                                                ? 'bg-indigo-50 border-indigo-100 text-indigo-700 font-bold shadow-sm'
                                                : 'bg-gray-50 dark:bg-gray-900 border-transparent text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:border-gray-200'}`}
                                        >
                                            {company}
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                        <span className="text-3xl block mb-2">🏢</span>
                                        <p className="text-sm text-gray-400">لا توجد شركات</p>
                                    </div>
                                )}
                            </div>

                            {/* Price Filters */}
                            <div className="mt-10 pt-8 border-t dark:border-gray-700">
                                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
                                    <FiSliders className="text-indigo-400" /> فلترة السعر
                                </h4>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-400 mb-1 block mr-1">من</label>
                                        <input
                                            type="number"
                                            className="w-full p-3 rounded-xl border-2 border-gray-100 dark:bg-gray-700 dark:border-gray-600 text-sm focus:border-indigo-500 outline-none transition-colors"
                                            value={priceRange.min}
                                            onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-400 mb-1 block mr-1">إلى</label>
                                        <input
                                            type="number"
                                            className="w-full p-3 rounded-xl border-2 border-gray-100 dark:bg-gray-700 dark:border-gray-600 text-sm focus:border-indigo-500 outline-none transition-colors"
                                            value={priceRange.max}
                                            onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* 3. Products Grid */}
                    <main className="flex-1 order-2 md:order-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2">
                                    {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name_ar : 'جميع المنتجات'}
                                </h2>
                                {selectedCompany && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold">
                                        <FiX className="cursor-pointer" onClick={() => setSelectedCompany(null)} />
                                        شركة: {selectedCompany}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <span className="text-sm text-gray-500 mr-2">ترتيب:</span>
                                <select
                                    className="bg-transparent border-none text-sm font-bold focus:ring-0 outline-none"
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                >
                                    <option value="newest">الأحدث أولاً</option>
                                    <option value="price_asc">السعر (أقل)</option>
                                    <option value="price_desc">السعر (أعلى)</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl h-96 animate-pulse border border-gray-100 dark:border-gray-700"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-gray-800 rounded-[3rem] text-center border-4 border-dashed border-gray-100 dark:border-gray-700 shadow-sm">
                                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-8">
                                    <span className="text-6xl">🔍</span>
                                </div>
                                <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-4">لا توجد منتجات تطابق بحثك</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-10 text-lg">جرب اختيار تصنيف مختلف أو العودة لعرض جميع المنتجات المتاحة لدينا.</p>
                                <button
                                    onClick={() => handleCategoryChange(null)}
                                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200"
                                >
                                    عرض جميع المنتجات
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Products;
