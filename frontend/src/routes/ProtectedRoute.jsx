import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


function ProtectedRoute({ children, roles }) {
    const { user, loading, isAuthenticated } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    if (roles && roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

export default ProtectedRoute
