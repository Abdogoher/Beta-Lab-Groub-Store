import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [loading, setLoading] = useState(false);

    // تحميل السلة من الخادم
    useEffect(() => {
        const loadCart = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const response = await cartAPI.get();
                    setCart(response.data.data || []);
                } catch (error) {
                    console.error('Failed to load cart:', error);
                    setCart([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setCart([]);
            }
        };

        loadCart();
    }, [user]);

    // إضافة منتج للسلة
    const addToCart = async (product, quantity = 1) => {
        // التحقق من تسجيل الدخول
        if (!user) {
            setShowAuthPrompt(true);
            return false;
        }

        try {
            const response = await cartAPI.add(product.id, quantity);
            setCart(response.data.data || []);
            return true;
        } catch (error) {
            console.error('Failed to add to cart:', error);
            return false;
        }
    };

    // إزالة منتج من السلة
    const removeFromCart = async (productId) => {
        try {
            await cartAPI.remove(productId);
            setCart(cart.filter(item => item.id !== productId));
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    };

    // تحديث كمية منتج
    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        try {
            await cartAPI.update(productId, quantity);
            setCart(cart.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            ));
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    // حساب المجموع
    const getTotal = () => {
        return cart.reduce((total, item) => {
            const itemPrice = item.discount_price || item.price;
            return total + (itemPrice * item.quantity);
        }, 0);
    };

    // عدد المنتجات
    const getItemCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    // إفراغ السلة
    const clearCart = async () => {
        try {
            await cartAPI.clear();
            setCart([]);
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    const value = {
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotal,
        getItemCount,
        clearCart,
        showAuthPrompt,
        setShowAuthPrompt
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
