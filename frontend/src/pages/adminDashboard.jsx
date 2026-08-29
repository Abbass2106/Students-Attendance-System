import React from 'react'
import { Link } from 'react-router-dom'

const adminDashboard = () => {
    return (
        <div className="p-6">

                    {/* Welcome */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Welcome back, John!
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Here's what's happening with your students today.
                        </p>
                    </div>

                    {/* Statistics */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Total Students
                            </p>

                            <p className="mt-2 text-3xl font-bold text-gray-800">
                                120
                            </p>

                            <p className="mt-2 text-sm text-green-600">
                                +5 this month
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Total Classes
                            </p>

                            <p className="mt-2 text-3xl font-bold text-gray-800">
                                6
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                Active classes
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Today's Attendance
                            </p>

                            <p className="mt-2 text-3xl font-bold text-gray-800">
                                92%
                            </p>

                            <p className="mt-2 text-sm text-green-600">
                                Good attendance
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Absent Today
                            </p>

                            <p className="mt-2 text-3xl font-bold text-gray-800">
                                10
                            </p>

                            <p className="mt-2 text-sm text-red-600">
                                Needs attention
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

                                <a
                                    href="/attendance"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    View all
                                </a>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                        <tr>
                                            <th className="px-6 py-3">Student</th>
                                            <th className="px-6 py-3">Class</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">

                                        <tr>
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                John Smith
                                            </td>

                                            <td className="px-6 py-4 text-gray-500">
                                                Form 1
                                            </td>

                                            <td className="px-6 py-4 text-gray-500">
                                                Aug 30, 2026
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                    Present
                                                </span>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                Jane Doe
                                            </td>

                                            <td className="px-6 py-4 text-gray-500">
                                                Form 2
                                            </td>

                                            <td className="px-6 py-4 text-gray-500">
                                                Aug 30, 2026
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                                    Absent
                                                </span>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                Peter Jones
                                            </td>

                                            <td className="px-6 py-4 text-gray-500">
                                                Form 1
                                            </td>

                                            <td className="px-6 py-4 text-gray-500">
                                                Aug 30, 2026
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                                                    Late
                                                </span>
                                            </td>
                                        </tr>

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

export default adminDashboard
