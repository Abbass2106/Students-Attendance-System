import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, School, CheckCircle2, XCircle, ClipboardPlus, UserPlus, FileBarChart } from 'lucide-react'
import api from '../Services/api'

const AdminDashboard = () => {

    const [user, setUser] = useState(null)
    const [students, setStudents] = useState([])
    const [classes, setClasses] = useState([])
    const [attendance, setAttendance] = useState([])
    const [todayAttendance, setTodayAttendance] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me')
                setUser(response.data)
            }
            catch (error) {
                console.log(error)
                setError('Unable to load user information')
            }
        }

        const fetchStudents = async () => {
            try {
                const response = await api.get('/students')
                setStudents(response.data)
            }
            catch (error) {
                console.log(error)
                setError('Unable to load students information')
            }
        }

        const fetchClasses = async () => {
            try {
                const response = await api.get('/classes')
                setClasses(response.data)
            }
            catch (error) {
                console.log(error)
                setError('Unable to load classes information')
            }
        }

        const fetchAttendance = async () => {
            try {
                const response = await api.get('/attendance')
                setAttendance(response.data)
            }
            catch (error) {
                console.log(error)
                setError('Unable to load attendance information')
            }
        }

        const fetchTodayAttendance = async () => {
            try {

                const today = new Date().toISOString().split('T')[0]

                const response = await api.get(
                    `/attendance/date/${today}`
                )

                setTodayAttendance(response.data)

            }
            catch (error) {
                console.log(error)
                setError("Unable to load today's attendance")
            }
        }

        fetchUser()
        fetchStudents()
        fetchClasses()
        fetchAttendance()
        fetchTodayAttendance()

    }, [])


    // Calculate today's attendance statistics
    const presentCount = todayAttendance.filter(
        item => item.status === 'PRESENT'
    ).length

    const absentCount = todayAttendance.filter(
        item => item.status === 'ABSENT'
    ).length

    const lateCount = todayAttendance.filter(
        item => item.status === 'LATE'
    ).length


    const attendancePercentage =
        todayAttendance.length > 0
            ? Math.round((presentCount / todayAttendance.length) * 100)
            : 0

    const recentAttendance = [...attendance]
        .sort((first, second) => {
            const dateDifference =
                new Date(second.date) - new Date(first.date)

            return dateDifference || Number(second.id) - Number(first.id)
        })
        .slice(0, 5)


    if (error) {
        console.log(error)
    }


    const statCards = [
        {
            label: 'Total Students',
            value: students.length,
            sub: 'Registered students',
            subColor: 'text-gray-500',
            icon: Users,
            iconBg: 'bg-emerald-50 text-emerald-600',
        },
        {
            label: 'Total Classes',
            value: classes.length,
            sub: 'Active classes',
            subColor: 'text-gray-500',
            icon: School,
            iconBg: 'bg-green-50 text-green-700',
        },
        {
            label: "Today's Attendance",
            value: `${attendancePercentage}%`,
            sub: `${presentCount} present`,
            subColor: 'text-green-600',
            icon: CheckCircle2,
            iconBg: 'bg-green-50 text-green-600',
        },
        {
            label: 'Absent Today',
            value: absentCount,
            sub: `${lateCount} late`,
            subColor: 'text-red-600',
            icon: XCircle,
            iconBg: 'bg-red-50 text-red-600',
        },
    ]

    return (
        <div className="p-6">

            {/* Welcome */}
            <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back, {user?.name || 'Admin'}
                </h1>

                <p className="mt-1 text-gray-500">
                    Here's what's happening with your students today.
                </p>

            </div>


            {/* Statistics */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {statCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div
                            key={card.label}
                            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-gray-500">
                                    {card.label}
                                </p>
                                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}>
                                    <Icon size={18} />
                                </div>
                            </div>

                            <p className="mt-3 text-3xl font-bold text-gray-800">
                                {card.value}
                            </p>

                            <p className={`mt-2 text-sm ${card.subColor}`}>
                                {card.sub}
                            </p>
                        </div>
                    )
                })}

            </div>


            {/* Bottom section */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">


                {/* Recent Attendance */}
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-2">

                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

                        <h2 className="font-semibold text-gray-800">
                            Recent Attendance
                        </h2>

                        <Link
                            to="/dashboard/attendance"
                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                        >
                            View all
                        </Link>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">

                                <tr>

                                    <th className="px-6 py-3">
                                        Student
                                    </th>

                                    <th className="px-6 py-3">
                                        Class
                                    </th>

                                    <th className="px-6 py-3">
                                        Date
                                    </th>

                                    <th className="px-6 py-3">
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-gray-100">

                                {recentAttendance.map((item) => (

                                    <tr key={item.id}>

                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {item?.students?.firstName}{' '}
                                            {item?.students?.lastName}
                                        </td>

                                        <td className="px-6 py-4 text-gray-500">
                                            {item?.classes?.name || 'N/A'}
                                        </td>

                                        <td className="px-6 py-4 text-gray-500">
                                            {item.date}
                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === 'PRESENT'
                                                    ? 'bg-green-100 text-green-700'
                                                    : item.status === 'ABSENT'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {item.status}
                                            </span>

                                        </td>

                                    </tr>

                                ))}

                                {attendance.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            No attendance records found.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* Quick Actions */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                    <h2 className="font-semibold text-gray-800">
                        Quick Actions
                    </h2>

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
                            <UserPlus size={16} />
                            Add Student
                        </Link>

                        <Link
                            to="/dashboard/reports"
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            <FileBarChart size={16} />
                            View Reports
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default AdminDashboard
