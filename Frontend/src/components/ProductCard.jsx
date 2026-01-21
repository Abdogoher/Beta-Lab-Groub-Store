import React from 'react';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const inWishlist = isInWishlist(product.id);
    const hasDiscount = !!product.discount_price;

    // Fix image URL
    const imageUrl = product.image?.startsWith('http')
        ? product.image
        : `http://localhost:3000${product.image}`;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 relative flex flex-col h-full">
            {/* Badges */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                {hasDiscount && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                        خصم {((product.price - product.discount_price) / product.price * 100).toFixed(0)}%
                    </span>
                )}
                {product.is_featured === 1 && (
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <HiOutlineSparkles />
                        مميز
                    </span>
                )}
            </div>

            {/* Wishlist Button */}
            <button
                className={`absolute top-3 left-3 z-20 p-2 rounded-full shadow-sm transition-colors ${inWishlist
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:text-pink-500 backdrop-blur-sm'
                    }`}
                onClick={handleWishlistToggle}
            >
                <FiHeart className={inWishlist ? 'fill-current' : ''} />
            </button>

            {/* Image Link */}
            <Link to={`/product/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700 block">
                <img
                    src={imageUrl}
                    alt={product.name_ar}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay Add to Cart */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <button
                        className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-gray-900 px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-indigo-600 hover:text-white"
                        onClick={handleAddToCart}
                    >
                        <FiShoppingCart />
                        أضف للسلة
                    </button>
                </div>
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="text-gray-500 text-xs mb-1">{product.category_name_ar || product.category_name || 'عام'} - {product.company}</div>
                <Link to={`/product/${product.id}`} className="hover:text-indigo-600">
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2 line-clamp-1" title={product.name_ar}>{product.name_ar}</h3>
                </Link>

                <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                        {hasDiscount ? (
                            <>
                                <span className="text-gray-400 text-sm line-through font-medium">{product.price} ج.م</span>
                                <span className="text-red-600 font-bold text-xl">{product.discount_price} <span className="text-sm font-normal">ج.م</span></span>
                            </>
                        ) : (
                            <span className="text-gray-800 dark:text-white font-bold text-xl">{product.price} <span className="text-sm font-normal">ج.م</span></span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
