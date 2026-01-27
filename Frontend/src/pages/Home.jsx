import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import Offers from '../components/Offers';
import { productsAPI } from '../services/api';
import Buy from '../components/Buy';

const Home = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeaturedProducts = async () => {
            try {
                const response = await productsAPI.getFeatured();
                setBestSellers(response.data.data || []);
            } catch (error) {
                console.error('Failed to load featured products:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFeaturedProducts();
    }, []);

    return (
        <div className="min-h-screen pb-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 pt-6">
                <HeroSlider />

                <section className="mb-12">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">✨ المنتجات المميزة</h2>
                        <p className="text-gray-600 dark:text-gray-400">اكتشف المنتجات الأكثر طلباً من عملائنا الكرام</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-80 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {bestSellers.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                    <Offers />
                </section>

            </div>
            <Buy />
        </div>
    );
};

export default Home;
