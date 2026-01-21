import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="loading-spinner">جاري التحميل...</div>;
    }

    if (!user) {
        // Not logged in, redirect to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user.isAdmin) {
        // Logged in but not admin, redirect to home
        return <Navigate to="/" replace />;
    }

    // Authorized
    return children;
};

export default AdminRoute;
