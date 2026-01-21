import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductDetails from './pages/ProductDetails';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import SearchResults from './components/SearchResults';

function AppContent() {
    const { showAuthPrompt, setShowAuthPrompt } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    const handleCloseSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header onSearchChange={setSearchQuery} searchQuery={searchQuery} />
            <main className="flex-grow">
                {searchQuery ? (
                    <SearchResults query={searchQuery} onClose={handleCloseSearch} />
                ) : (
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products searchQuery={searchQuery} />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/admin" element={
                            <AdminRoute>
                                <Dashboard />
                            </AdminRoute>
                        } />
                    </Routes>
                )}
            </main>
            {!searchQuery && (
                <footer className="bg-gray-800 text-white py-6 mt-auto">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-gray-400">جميع الحقوق محفوظة © 2024 Bag Store - متجرك الإلكتروني للشنط</p>
                    </div>
                </footer>
            )}
            <AuthModal
                isOpen={showAuthPrompt}
                onClose={() => setShowAuthPrompt(false)}
            />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <AppContent />
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
