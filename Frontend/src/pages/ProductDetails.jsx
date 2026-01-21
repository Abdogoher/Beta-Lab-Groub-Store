import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { FiChevronRight, FiCheck, FiShoppingCart, FiArrowRight, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const inWishlist = product ? isInWishlist(product.id) : false;

    // Fix image URL
    const imageUrl = product?.image?.startsWith('http')
        ? product.image
        : `http://localhost:3000${product?.image}`;

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
        }
    };

    const handleWishlistToggle = () => {
        if (product) {
            if (inWishlist) {
                removeFromWishlist(product.id);
            } else {
                addToWishlist(product);
            }
        }
    };

    useEffect(() => {
        const loadProductData = async () => {
            try {
                setLoading(true);
                const response = await productsAPI.getById(id);
                const productData = response.data.data;
                setProduct(productData);

                // Load related products by company
                if (productData.company) {
                    const relatedRes = await productsAPI.getAll({ company: productData.company });
                    setRelatedProducts(relatedRes.data.data.filter(p => p.id !== parseInt(id)));
                }
            } catch (error) {
                console.error('Failed to load product details:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProductData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>;
    }

    if (!product) {
        return <div className="min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
            <Link to="/products" className="text-indigo-600 flex items-center gap-2">
                <FiArrowRight /> العودة للمنتجات
            </Link>
        </div>;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pb-20" dir="rtl">
            {/* Breadcrumbs */}
            <div className="bg-gray-50 dark:bg-gray-800 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-gray-500 gap-2">
                        <Link to="/" className="hover:text-indigo-600">الرئيسية</Link>
                        <FiChevronRight />
                        <Link to="/products" className="hover:text-indigo-600">المنتجات</Link>
                        <FiChevronRight />
                        <span className="text-gray-900 dark:text-white font-medium">{product.name_ar}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden aspect-square border shadow-sm relative">
                        <img
                            src={imageUrl}
                            alt={product.name_ar}
                            className="w-full h-full object-cover"
                        />
                        {/* Wishlist Button */}
                        <button
                            onClick={handleWishlistToggle}
                            className={`absolute top-6 left-6 p-4 rounded-2xl shadow-xl transition-all ${inWishlist
                                ? 'bg-pink-500 text-white'
                                : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:text-pink-500 backdrop-blur-md'
                                }`}
                        >
                            <FiHeart size={24} className={inWishlist ? 'fill-current' : ''} />
                        </button>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-3">
                                {product.company}
                            </span>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                                {product.name_ar}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                {product.discount_price ? (
                                    <>
                                        <span className="text-3xl font-black text-red-600">
                                            {product.discount_price} ج.م
                                        </span>
                                        <span className="text-xl text-gray-400 line-through">
                                            {product.price} ج.م
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-black text-indigo-600">
                                        {product.price} ج.م
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                                {product.description_ar || product.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto border-t pt-8">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center border rounded-2xl p-2 bg-gray-50 dark:bg-gray-800">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-xl font-bold"
                                    >-</button>
                                    <span className="w-12 text-center font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-xl font-bold"
                                    >+</button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                >
                                    <FiShoppingCart size={24} />
                                    إضافة للسلة
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <FiCheck /> متوفر في المخزن
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <FiCheck /> شحن سريع
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Slider */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black border-r-4 border-indigo-600 pr-4">
                                منتجات أخرى من {product.company}
                            </h2>
                        </div>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={24}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 4 },
                            }}
                            className="pb-12"
                        >
                            {relatedProducts.map(item => (
                                <SwiperSlide key={item.id}>
                                    <ProductCard product={item} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
