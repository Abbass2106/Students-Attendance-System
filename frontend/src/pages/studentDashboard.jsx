import { useEffect, useState } from 'react'
import { AlertTriangle, GraduationCap, CalendarCheck, TrendingDown } from 'lucide-react'
import api from '../Services/api'
import { useAuth } from '../context/AuthContext'

// Backed by the student self-service endpoints added to the backend:
//   GET /api/students/me              -> the Students profile linked to this user (by email)
//   GET /api/students/me/enrollments  -> this student's enrollments
//   GET /api/students/me/attendance   -> per-class attendance summary + percentage
function StudentDashboard() {
    const { user } = useAuth()
    const [status, setStatus] = useState('loading') // loading | no-profile | error | ready
    const [profile, setProfile] = useState(null)
    const [enrollments, setEnrollments] = useState([])
    const [attendance, setAttendance] = useState([])

    useEffect(() => {
        const load = async () => {
            try {
                const [profileRes, enrollmentsRes, attendanceRes] = await Promise.all([
                    api.get('/students/me'),
                    api.get('/students/me/enrollments'),
                    api.get('/students/me/attendance'),
                ])

                setProfile(profileRes.data)
                setEnrollments(enrollmentsRes.data)
                setAttendance(attendanceRes.data)
                setStatus('ready')
            }
            catch (err) {
                if (err.response?.status === 404) {
                    // No Students record is linked to this account's email yet.
                    setStatus('no-profile')
                }
                else {
                    console.error(err)
                    setStatus('error')
                }
            }
        }

        load()
    }, [])

    if (status === 'loading') {
        return <div className="p-6 text-sm text-gray-500">Loading your dashboard...</div>
    }

    if (status === 'no-profile') {
        return (
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
                    <p className="mt-1 text-gray-500">Your student portal</p>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-amber-900">
                            No student profile linked to your account
                        </h2>
                        <p className="mt-1 text-sm text-amber-800">
                            We couldn't find a student record matching {user?.email}. Ask an
                            administrator to create your student profile using this same email
                            address so it links to your login.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                    Something went wrong loading your dashboard. Please try again shortly.
                </div>
            </div>
        )
    }

    const overallPercentage = attendance.length > 0
        ? Math.round(
            (attendance.reduce((sum, a) => sum + a.attendancePercentage, 0) / attendance.length) * 10
        ) / 10
        : 0

    const atRiskClasses = attendance.filter((a) => a.totalSessions > 0 && a.attendancePercentage < 75)

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome, {profile.firstName} {profile.lastName}
                </h1>
                <p className="mt-1 text-gray-500">
                    Student No. {profile.studentNumber}
                </p>
            </div>

            {atRiskClasses.length > 0 && (
                <div className="mb-6 flex items-start gap-4 rounded-xl border border-red-200 bg-red-50 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <TrendingDown size={20} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-red-900">Low attendance alert</h2>
                        <p className="mt-1 text-sm text-red-800">
                            Your attendance is below 75% in {atRiskClasses.length}{' '}
                            {atRiskClasses.length === 1 ? 'class' : 'classes'}:{' '}
                            {atRiskClasses.map((a) => a.classCode).join(', ')}.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-500">Enrolled Classes</p>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <GraduationCap size={18} />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-800">{enrollments.length}</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-500">Overall Attendance</p>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                            <CalendarCheck size={18} />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-800">{overallPercentage}%</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-500">Status</p>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-800">{profile.status}</p>
                </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h2 className="font-semibold text-gray-800">My Attendance by Class</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-3">Class</th>
                                <th className="px-6 py-3">Present</th>
                                <th className="px-6 py-3">Absent</th>
                                <th className="px-6 py-3">Late</th>
                                <th className="px-6 py-3">Excused</th>
                                <th className="px-6 py-3">Attendance %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {attendance.map((a) => (
                                <tr key={a.enrollmentId}>
                                    <td className="px-6 py-4 font-medium text-gray-800">{a.classCode || `Class #${a.classId}`}</td>
                                    <td className="px-6 py-4 text-gray-500">{a.presentCount}</td>
                                    <td className="px-6 py-4 text-gray-500">{a.absentCount}</td>
                                    <td className="px-6 py-4 text-gray-500">{a.lateCount}</td>
                                    <td className="px-6 py-4 text-gray-500">{a.excusedCount}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                a.totalSessions === 0
                                                    ? 'bg-gray-100 text-gray-500'
                                                    : a.attendancePercentage < 75
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {a.totalSessions === 0 ? 'No data' : `${a.attendancePercentage}%`}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {attendance.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No enrollments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard
