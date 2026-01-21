import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { HiUserCircle, HiUserAdd } from 'react-icons/hi';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLogin = () => {
        navigate('/login');
        onClose();
    };

    const handleRegister = () => {
        navigate('/register');
        onClose();
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal glass" onClick={(e) => e.stopPropagation()}>
                <button className="auth-modal-close" onClick={onClose}>
                    <FiX />
                </button>

                <div className="auth-modal-content">
                    <div className="auth-modal-icon">
                        🔒
                    </div>
                    <h2>يجب تسجيل الدخول أولاً</h2>
                    <p>للاستمتاع بتجربة تسوق كاملة وإضافة المنتجات إلى سلة المشتريات، يرجى تسجيل الدخول أو إنشاء حساب جديد</p>

                    <div className="auth-modal-actions">
                        <button className="btn btn-primary" onClick={handleLogin}>
                            <HiUserCircle />
                            تسجيل الدخول
                        </button>
                        <button className="btn btn-accent" onClick={handleRegister}>
                            <HiUserAdd />
                            إنشاء حساب جديد
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
