import { useAuth } from '../context/AuthContext'
import { ROLES } from '../context/AuthContext'
import AdminDashboard from './adminDashboard'
import TeacherDashboard from './teacherDashboard'
import StudentDashboard from './studentDashboard'

// Renders a different dashboard depending on the logged-in user's role.
function Dashboard() {
    const { role } = useAuth()

    if (role === ROLES.ADMIN) return <AdminDashboard />
    if (role === ROLES.TEACHER) return <TeacherDashboard />
    if (role === ROLES.STUDENT) return <StudentDashboard />

    return null
}

export default Dashboard
