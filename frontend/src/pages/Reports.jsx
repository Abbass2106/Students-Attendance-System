import { useState } from 'react'

function Reports() {
    const [reportType, setReportType] = useState('student')

    return (
        <div className="p-6">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Reports
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    View attendance reports and statistics.
                </p>
            </div>

            <div className="mb-6 flex gap-2 rounded-xl bg-white p-2 shadow-sm">
                <button
                    onClick={() => setReportType('student')}
                    className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold ${
                        reportType === 'student'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Student Report
                </button>

                <button
                    onClick={() => setReportType('class')}
                    className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold ${
                        reportType === 'class'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Class Report
                </button>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">

                {reportType === 'student' ? (
                    <>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Student Attendance Report
                        </h2>

                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Select Student
                            </label>

                            <select className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 sm:max-w-md">
                                <option>John Smith</option>
                                <option>Jane Doe</option>
                                <option>Peter Jones</option>
                            </select>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-4">
                            <div className="rounded-lg bg-green-50 p-5">
                                <p className="text-sm text-green-600">
                                    Present
                                </p>

                                <p className="mt-2 text-2xl font-bold text-green-700">
                                    20
                                </p>
                            </div>

                            <div className="rounded-lg bg-red-50 p-5">
                                <p className="text-sm text-red-600">
                                    Absent
                                </p>

                                <p className="mt-2 text-2xl font-bold text-red-700">
                                    2
                                </p>
                            </div>

                            <div className="rounded-lg bg-yellow-50 p-5">
                                <p className="text-sm text-yellow-600">
                                    Late
                                </p>

                                <p className="mt-2 text-2xl font-bold text-yellow-700">
                                    1
                                </p>
                            </div>

                            <div className="rounded-lg bg-blue-50 p-5">
                                <p className="text-sm text-blue-600">
                                    Attendance
                                </p>

                                <p className="mt-2 text-2xl font-bold text-blue-700">
                                    87%
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Class Attendance Report
                        </h2>

                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Select Class
                            </label>

                            <select className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 sm:max-w-md">
                                <option>Form 1</option>
                                <option>Form 2</option>
                                <option>Form 3</option>
                                <option>Form 4</option>
                            </select>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-4">
                            <div className="rounded-lg bg-green-50 p-5">
                                <p className="text-sm text-green-600">
                                    Present
                                </p>

                                <p className="mt-2 text-2xl font-bold text-green-700">
                                    35
                                </p>
                            </div>

                            <div className="rounded-lg bg-red-50 p-5">
                                <p className="text-sm text-red-600">
                                    Absent
                                </p>

                                <p className="mt-2 text-2xl font-bold text-red-700">
                                    6
                                </p>
                            </div>

                            <div className="rounded-lg bg-yellow-50 p-5">
                                <p className="text-sm text-yellow-600">
                                    Late
                                </p>

                                <p className="mt-2 text-2xl font-bold text-yellow-700">
                                    3
                                </p>
                            </div>

                            <div className="rounded-lg bg-blue-50 p-5">
                                <p className="text-sm text-blue-600">
                                    Attendance
                                </p>

                                <p className="mt-2 text-2xl font-bold text-blue-700">
                                    82%
                                </p>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}

export default Reports

