import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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


    return (
        <div className="p-6">

            {/* Welcome */}
            <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back, {user?.name}
                </h1>

                <p className="mt-1 text-gray-500">
                    Here's what's happening with your students today.
                </p>

            </div>


            {/* Statistics */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {/* Total Students */}
                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm font-medium text-gray-500">
                        Total Students
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {students.length}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        Registered students
                    </p>

                </div>


                {/* Total Classes */}
                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm font-medium text-gray-500">
                        Total Classes
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {classes.length}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        Active classes
                    </p>

                </div>


                {/* Today's Attendance */}
                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm font-medium text-gray-500">
                        Today's Attendance
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {attendancePercentage}%
                    </p>

                    <p className="mt-2 text-sm text-green-600">
                        {presentCount} present
                    </p>

                </div>


                {/* Absent Today */}
                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <p className="text-sm font-medium text-gray-500">
                        Absent Today
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-800">
                        {absentCount}
                    </p>

                    <p className="mt-2 text-sm text-red-600">
                        {lateCount} late
                    </p>

                </div>

            </div>


            {/* Bottom section */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">


                {/* Recent Attendance */}
                <div className="rounded-xl bg-white shadow-sm lg:col-span-2">

                    <div className="flex items-center justify-between border-b px-6 py-4">

                        <h2 className="font-semibold text-gray-800">
                            Recent Attendance
                        </h2>

                        <Link
                            to="/dashboard/attendance"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            View all
                        </Link>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="bg-gray-100 text-xs uppercase text-gray-600">

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
                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="font-semibold text-gray-800">
                        Quick Actions
                    </h2>

                    <div className="mt-4 space-y-3">

                        <Link
                            to="/dashboard/attendance"
                            className="block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Record Attendance
                        </Link>

                        <Link
                            to="/dashboard/students"
                            className="block rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Add Student
                        </Link>

                        <Link
                            to="/dashboard/reports"
                            className="block rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            View Reports
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default AdminDashboard
