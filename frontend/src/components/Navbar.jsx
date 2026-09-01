import { useEffect, useState } from "react"
import { Search, Bell } from "lucide-react"
import api from '../Services/api'

function Navbar() {

    const [user, setUser] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {

        const fetchUser = async () => {

            try {
                const response = await api.get('/users/me')
                setUser(response.data)
            }

            catch (error) {
                console.log(error)
                setError('unable to get user information')
            }
        }

        fetchUser()
    }, [])

    if (error) {
        console.log(error)
    }

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A'

    return (
        <header className="flex h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white/80 px-6 backdrop-blur-sm">

            {/* Search */}
            <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-500 sm:flex">
                <Search size={16} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search students, classes..."
                    className="w-full bg-transparent outline-none placeholder:text-gray-400"
                />
            </div>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-4">

                {/* Notification */}
                <button className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700">
                    <Bell size={19} />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                {/* User */}
                <div className="flex items-center gap-3 border-l border-gray-200 pl-4">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-900 font-semibold text-white shadow-sm">
                        {initial}
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold leading-tight text-gray-800">
                            {user?.name || 'Loading...'}
                        </p>

                        <p className="text-xs capitalize leading-tight text-gray-500">
                            {user?.role?.toLowerCase() || ''}
                        </p>
                    </div>

                </div>

            </div>

        </header>
    )
}

export default Navbar
