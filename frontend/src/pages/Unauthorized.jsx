import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Unauthorized() {
    const { user } = useAuth()

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <ShieldAlert size={30} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
                You don't have access to this page
            </h1>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
                {user
                    ? `Your account role (${user.role}) doesn't have permission to view this section.`
                    : 'Please sign in to continue.'}
            </p>
            <Link
                to="/dashboard"
                className="mt-6 rounded-lg bg-gradient-to-r from-emerald-600 to-green-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-700 hover:to-green-950"
            >
                Back to dashboard
            </Link>
        </div>
    )
}

export default Unauthorized
