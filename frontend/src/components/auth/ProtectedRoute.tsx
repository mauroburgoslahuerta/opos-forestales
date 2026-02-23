import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
    const { user, role, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-earth-50">
                <Loader className="w-10 h-10 text-forest-600 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // User authorized but wrong role (e.g. Dario trying to access Admin)
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
