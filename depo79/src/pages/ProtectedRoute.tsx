import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuthStore } from '../store/auth'; // Assuming you have the Zustand store

// Updated ProtectedRoute as a wrapper
const ProtectedRoute = ({ element: Element, ...rest }) => {
    const { isAuthenticated } = useAuthStore.getState(); // Access the authentication state

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    return <Route {...rest} element={<Element />} />;
};

export default ProtectedRoute;
