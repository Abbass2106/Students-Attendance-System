import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { School, Users, ClipboardPlus, CheckCircle2, XCircle } from 'lucide-react'
import api from '../Services/api'
import { useAuth } from '../context/AuthContext'

function TeacherDashboard() {
    const { user } = useAuth()
    const [myClasses, setMyClasses] = useState([])
    const [todayAttendance, setTodayAttendance] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const [classesRes, todayRes] = await Promise.all([
                    api.get('/classes/mine'),
                    api.get(`/attendance/date/${new Date().toISOString().split('T')[0]}`)
                        .catch(() => ({ data: [] })),
                ])
                setMyClasses(classesRes.data)
                setTodayAttendance(todayRes.data)
            }
            catch (err) {
                console.error(err)
                setError('Unable to load your classes')
            }
            finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const myTodayAttendance = todayAttendance.filter((a) =>
        myClasses.some((c) => c.id === a?.classes?.id)
    )

    const presentCount = myTodayAttendance.filter((a) => a.status === 'PRESENT').length
    const absentCount = myTodayAttendance.filter((a) => a.status === 'ABSENT').length

    if (loading) {
        return <div className="p-6 text-sm text-gray-500">Loading your dashboard...</div>
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back, {user?.name || 'Teacher'}
                </h1>
                <p className="mt-1 text-gray-500">
                    Here's an overview of the classes assigned to you.
                </p>
            </div>

            {error && (
                <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-500">My Classes</p>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <School size={18} />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-800">{myClasses.length}</p>
                    <p className="mt-2 text-sm text-gray-500">Assigned to you</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-500">Present Today</p>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                            <CheckCircle2 size={18} />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-800">{presentCount}</p>
                    <p className="mt-2 text-sm text-green-600">Across your classes</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-500">Absent Today</p>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <XCircle size={18} />
                        </div>
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-800">{absentCount}</p>
                    <p className="mt-2 text-sm text-red-600">Across your classes</p>
                </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <h2 className="font-semibold text-gray-800">My Classes</h2>
                        <Link to="/dashboard/classes" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                            View all
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-3">Code</th>
                                    <th className="px-6 py-3">Semester</th>
                                    <th className="px-6 py-3">Academic Year</th>
                                    <th className="px-6 py-3">Room</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {myClasses.map((c) => (
                                    <tr key={c.id}>
                                        <td className="px-6 py-4 font-medium text-gray-800">{c.code}</td>
                                        <td className="px-6 py-4 text-gray-500">{c.semester}</td>
                                        <td className="px-6 py-4 text-gray-500">{c.academicYear}</td>
                                        <td className="px-6 py-4 text-gray-500">{c.room || 'N/A'}</td>
                                    </tr>
                                ))}
                                {myClasses.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No classes assigned to you yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="font-semibold text-gray-800">Quick Actions</h2>
                    <div className="mt-4 space-y-3">
                        <Link
                            to="/dashboard/attendance"
                            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-green-950"
                        >
                            <ClipboardPlus size={16} />
                            Record Attendance
                        </Link>
                        <Link
                            to="/dashboard/students"
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            <Users size={16} />
                            View Students
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherDashboard
