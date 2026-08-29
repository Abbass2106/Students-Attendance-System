import { NavLink } from 'react-router-dom'

function Sidebar() {

    const links = [
        { name: 'Dashboard', path: '/dashboard'},
        { name: 'Students', path: '/dashboard/students'},
        { name: 'Classes', path: '/dashboard/classes'},
        { name: 'Attendance', path: '/dashboard/attendance'},
        { name: 'Reports', path: '/dashboard/reports'},
        { name: 'Users', path: '/dashboard/users'}
    ]

    return (
        <aside className="flex w-64 flex-col bg-gray-900 text-white">

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6">

                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Menu
                </p>

                <div className="space-y-1">

                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.path === '/dashboard'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`
                            }
                        >
                            <span>
                                {link.name}
                            </span>
                        </NavLink>
                    ))}

                </div>

            </nav>

            {/* Bottom */}
            <div className="border-t border-gray-800 p-4">

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white">
                    Logout
                </button>

            </div>

        </aside>
    )
}

export default Sidebar
