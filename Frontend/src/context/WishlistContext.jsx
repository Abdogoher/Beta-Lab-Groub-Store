import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { wishlistAPI } from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    // تحميل المفضلة من الخادم
    useEffect(() => {
        const loadWishlist = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const response = await wishlistAPI.get();
                    setWishlist(response.data.data || []);
                } catch (error) {
                    console.error('Failed to load wishlist:', error);
                    setWishlist([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setWishlist([]);
            }
        };

        loadWishlist();
    }, [user]);

    // إضافة للمفضلة
    const addToWishlist = async (product) => {
        if (!user) {
            return false;
        }

        try {
            await wishlistAPI.add(product.id);
            setWishlist([...wishlist, product]);
            return true;
        } catch (error) {
            console.error('Failed to add to wishlist:', error);
            return false;
        }
    };

    // إزالة من المفضلة
    const removeFromWishlist = async (productId) => {
        try {
            await wishlistAPI.remove(productId);
            setWishlist(wishlist.filter(item => item.id !== productId));
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
    };

    // التحقق من وجود المنتج في المفضلة
    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    // عدد المنتجات في المفضلة
    const getWishlistCount = () => {
        return wishlist.length;
    };

    const value = {
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
