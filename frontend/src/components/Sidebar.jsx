import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    ClipboardCheck,
    BarChart3,
    UserCog,
    LogOut,
    School,
    Building2,
    ClipboardList,
} from 'lucide-react'
import { useAuth, ROLES } from '../context/AuthContext'

// Every link declares which roles can see it. Admin sees everything;
// Teacher sees class/attendance-level tools; Student only sees their portal.
const ALL_LINKS = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT] },
    { name: 'Students', path: '/dashboard/students', icon: GraduationCap, roles: [ROLES.ADMIN, ROLES.TEACHER] },
    { name: 'Classes', path: '/dashboard/classes', icon: School, roles: [ROLES.ADMIN, ROLES.TEACHER] },
    { name: 'Enrollments', path: '/dashboard/enrollments', icon: ClipboardList, roles: [ROLES.ADMIN, ROLES.TEACHER] },
    { name: 'Attendance', path: '/dashboard/attendance', icon: ClipboardCheck, roles: [ROLES.ADMIN, ROLES.TEACHER] },
    { name: 'Reports', path: '/dashboard/reports', icon: BarChart3, roles: [ROLES.ADMIN, ROLES.TEACHER] },
    { name: 'Academic Structure', path: '/dashboard/academic-structure', icon: Building2, roles: [ROLES.ADMIN] },
    { name: 'Users', path: '/dashboard/users', icon: UserCog, roles: [ROLES.ADMIN] },
]

function Sidebar() {
    const { role, logout } = useAuth()
    const navigate = useNavigate()

    const links = ALL_LINKS.filter((link) => link.roles.includes(role))

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <aside className="flex w-64 shrink-0 flex-col bg-slate-950 text-white">

            {/* Brand */}
            <div className="flex items-center gap-3 px-5 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-900 shadow-lg shadow-emerald-900/40">
                    <GraduationCap size={20} className="text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold leading-tight text-white">
                        RollBook
                    </p>
                    <p className="text-xs leading-tight text-slate-400">
                        Attendance Management System
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2">

                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Menu
                </p>

                <div className="space-y-1">

                    {links.map((link) => {
                        const Icon = link.icon

                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.path === '/dashboard'}
                                className={({ isActive }) =>
                                    `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-gradient-to-r from-emerald-600 to-green-900 text-white shadow-md shadow-emerald-900/30'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                <Icon size={18} className="shrink-0" />
                                <span>{link.name}</span>
                            </NavLink>
                        )
                    })}

                </div>

            </nav>

            {/* Bottom */}
            <div className="border-t border-white/10 p-3">

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                    <LogOut size={18} />
                    Logout
                </button>

            </div>

        </aside>
    )
}

export default Sidebar