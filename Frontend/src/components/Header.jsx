import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiLogOut, FiMenu, FiX, FiSettings } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ onSearchChange, searchQuery }) => {
    const navigate = useNavigate();
    const { getItemCount } = useCart();
    const { getWishlistCount } = useWishlist();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSearch = (e) => {
        const query = e.target.value;
        if (onSearchChange) {
            onSearchChange(query);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-white group">
                        <span className="text-3xl group-hover:scale-110 transition-transform">👜</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Bag Store</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 text-gray-600 dark:text-gray-300 font-medium">
                        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">الرئيسية</Link>
                        <Link to="/products" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">المنتجات</Link>
                        <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">من نحن</Link>
                    </nav>

                    {/* Search Bar */}
                    <div className="hidden md:block flex-1 max-w-md mx-4 relative">
                        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="ابحث عن منتجاتك المفضلة..."
                            className="w-full pl-4 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-full focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all text-gray-800 dark:text-white placeholder-gray-400"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {user ? (
                            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                                {user.isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors"
                                        title="لوحة التحكم"
                                    >
                                        <FiSettings size={20} />
                                    </Link>
                                )}
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                                    <span>{user.name || user.fullName}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                    title="تسجيل خروج"
                                >
                                    <FiLogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                            >
                                <FiUser />
                                <span>دخول</span>
                            </Link>
                        )}

                        <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-pink-500 dark:text-gray-300 transition-colors">
                            <FiHeart size={24} />
                            {getWishlistCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                                    {getWishlistCount()}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-300 transition-colors">
                            <FiShoppingCart size={24} />
                            {getItemCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                                    {getItemCount()}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search - Visible only on mobile */}
                <div className="md:hidden mt-3 pb-2">
                    <div className="relative">
                        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="بحث..."
                            className="w-full pl-4 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-lg text-gray-800 dark:text-white placeholder-gray-400"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg py-4 px-4 flex flex-col gap-4 animate-fade-in">
                    <nav className="flex flex-col gap-2">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-white font-medium">الرئيسية</Link>
                        <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-white font-medium">المنتجات</Link>
                        <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-white font-medium">من نحن</Link>
                        {user ? (
                            <>
                                {user.isAdmin && (
                                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium">لوحة التحكم</Link>
                                )}
                                <button onClick={handleLogout} className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg font-medium text-right w-full flex items-center justify-between">
                                    <span>تسجيل خروج ({user.name})</span>
                                    <FiLogOut />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium text-center">
                                تسجيل الدخول
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
