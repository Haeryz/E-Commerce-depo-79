import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth'; // Assuming you have the Zustand store

// Updated ProtectedRoute as a wrapper
const ProtectedRoute = ({ element: Element, ...rest }) => {
    const { isAuthenticated } = useAuthStore.getState(); // Access the authentication state

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Element {...rest} />; // Render the passed component directly
};

export default ProtectedRoute;
