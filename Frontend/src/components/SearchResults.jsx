import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from './ProductCard';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchResults = ({ query, onClose }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                // Assuming getAll handles search via params
                const response = await productsAPI.getAll({ search: query });
                setResults(response.data.data || []);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-80px)] animate-fade-in">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                            <FiSearch size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 dark:text-white">نتائج البحث عن: "{query}"</h2>
                            <p className="text-gray-500 dark:text-gray-400">تم العثور على {results.length} منتج</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400"
                    >
                        <FiX size={28} />
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-80 animate-pulse"></div>
                        ))}
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-8xl mb-6 opacity-20">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">لا توجد نتائج</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">لم نجد أي منتجات تطابق بحثك. جرب كلمات مفتاحية أخرى.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
