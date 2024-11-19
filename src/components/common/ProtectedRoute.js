import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, user, loading }) => {
    const location = useLocation();
    
    if (loading) {
        return <div>Loading...</div>;
    }

    // Only protect admin routes
    if (!user && location.pathname.startsWith('/admin')) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
