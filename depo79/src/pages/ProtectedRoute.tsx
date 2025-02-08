import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth'; // Assuming you have the Zustand store

// Updated ProtectedRoute as a wrapper
import { ComponentType } from 'react';

const ProtectedRoute = ({ element: Element, ...rest }: { element: ComponentType<any> }) => {
    const { isAuthenticated } = useAuthStore.getState(); // Access the authentication state

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Element {...rest} />; // Render the passed component directly
};

export default ProtectedRoute;
