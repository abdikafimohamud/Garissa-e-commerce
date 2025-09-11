import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
    const { user, isAuthenticated, loading } = useContext(AuthContext);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to admin login
    if (!isAuthenticated || !user) {
        console.log("AdminProtectedRoute: Not authenticated, redirecting to admin login", {
            isAuthenticated,
            user: user ? "exists" : "null"
        });
        return <Navigate to="/admin" replace />;
    }

    // If authenticated but not admin, redirect to admin login
    if (user.account_type !== 'admin' || !user.is_admin) {
        console.log("AdminProtectedRoute: Not admin user, redirecting to admin login", {
            account_type: user.account_type,
            is_admin: user.is_admin
        });
        return <Navigate to="/admin" replace />;
    }

    // If admin, render the requested page
    console.log("AdminProtectedRoute: Admin authenticated, rendering children", {
        user: user.email,
        account_type: user.account_type,
        is_admin: user.is_admin
    });
    return children;
}
