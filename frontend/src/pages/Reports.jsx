import { useEffect, useState } from 'react'
import api from '../Services/api'

function Reports() {
    const [reportType, setReportType] = useState('student')

    const [students, setStudents] = useState([])
    const [classes, setClasses] = useState([])

    const [selectedStudent, setSelectedStudent] = useState('')
    const [selectedClass, setSelectedClass] = useState('')

    const [studentReport, setStudentReport] = useState(null)
    const [classReport, setClassReport] = useState(null)

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Load students and classes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsResponse, classesResponse] = await Promise.all([
                    api.get('/students'),
                    api.get('/classes')
                ])

                setStudents(studentsResponse.data)
                setClasses(classesResponse.data)

                if (studentsResponse.data.length > 0) {
                    setSelectedStudent(studentsResponse.data[0].id)
                }

                if (classesResponse.data.length > 0) {
                    setSelectedClass(classesResponse.data[0].id)
                }
            }
            catch (error) {
                console.error(error)
                setError('Unable to load report data')
            }
        }

        fetchData()
    }, [])

    // Fetch student report
    useEffect(() => {
        if (reportType !== 'student' || !selectedStudent) {
            return
        }

        const fetchStudentReport = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(
                    `/attendance/student/${selectedStudent}/summary`
                )

                setStudentReport(response.data)
            }
            catch (error) {
                console.error(error)
                setError(
                    error.response?.data?.message ||
                    'Unable to load student report'
                )
                setStudentReport(null)
            }
            finally {
                setLoading(false)
            }
        }

        fetchStudentReport()
    }, [selectedStudent, reportType])

    // Fetch class report
    useEffect(() => {
        if (reportType !== 'class' || !selectedClass) {
            return
        }

        const fetchClassReport = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(
                    `/attendance/class/${selectedClass}/summary`
                )

                setClassReport(response.data)
            }
            catch (error) {
                console.error(error)
                setError(
                    error.response?.data?.message ||
                    'Unable to load class report'
                )
                setClassReport(null)
            }
            finally {
                setLoading(false)
            }
        }

        fetchClassReport()
    }, [selectedClass, reportType])

    const selectedStudentData = students.find(
        (student) => student.id === Number(selectedStudent)
    )

    const selectedClassData = classes.find(
        (schoolClass) => schoolClass.id === Number(selectedClass)
    )

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

            {error && (
                <div className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Report Type */}
            <div className="mb-6 flex gap-2 rounded-xl bg-white p-2 shadow-sm">

                <button
                    onClick={() => setReportType('student')}
                    className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold ${reportType === 'student'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Student Report
                </button>

                <button
                    onClick={() => setReportType('class')}
                    className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold ${reportType === 'class'
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

                        {/* Student Selection */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Select Student
                            </label>

                            <select
                                value={selectedStudent}
                                onChange={(e) =>
                                    setSelectedStudent(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 sm:max-w-md"
                            >
                                <option value="">
                                    Select a student
                                </option>

                                {students.map((student) => (
                                    <option
                                        key={student.id}
                                        value={student.id}
                                    >
                                        {student.firstName}{' '}
                                        {student.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {loading ? (
                            <div className="mt-8 text-center text-gray-500">
                                Loading report...
                            </div>
                        ) : studentReport ? (
                            <>
                                <div className="mt-5">
                                    <p className="text-sm text-gray-500">
                                        Student
                                    </p>

                                    <p className="text-lg font-semibold text-gray-800">
                                        {selectedStudentData?.firstName}{' '}
                                        {selectedStudentData?.lastName}
                                    </p>
                                </div>

                                <div className="mt-8 grid gap-4 lg:grid-cols-5">

                                    <div className="rounded-lg bg-green-50 p-5">
                                        <p className="text-sm text-green-600">
                                            Present
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-green-700">
                                            {studentReport.present}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-red-50 p-5">
                                        <p className="text-sm text-red-600">
                                            Absent
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-red-700">
                                            {studentReport.absent}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-yellow-50 p-5">
                                        <p className="text-sm text-yellow-600">
                                            Late
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-yellow-700">
                                            {studentReport.late}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-blue-50 p-5">
                                        <p className="text-sm text-blue-600">
                                            Attendance
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-blue-700">
                                            {Math.round(
                                                studentReport.attendancePercentage
                                            )}%
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-5">
                                        <p className="text-sm text-gray-500">
                                            Excused
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-gray-700">
                                            {studentReport.excused}
                                        </p>
                                    </div>

                                </div>


                            </>
                        ) : selectedStudent ? (
                            <div className="mt-8 text-center text-gray-500">
                                No attendance report available.
                            </div>
                        ) : null}
                    </>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Class Attendance Report
                        </h2>

                        {/* Class Selection */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Select Class
                            </label>

                            <select
                                value={selectedClass}
                                onChange={(e) =>
                                    setSelectedClass(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 sm:max-w-md"
                            >
                                <option value="">
                                    Select a class
                                </option>

                                {classes.map((schoolClass) => (
                                    <option
                                        key={schoolClass.id}
                                        value={schoolClass.id}
                                    >
                                        {schoolClass.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {loading ? (
                            <div className="mt-8 text-center text-gray-500">
                                Loading report...
                            </div>
                        ) : classReport ? (
                            <>
                                <div className="mt-5">
                                    <p className="text-sm text-gray-500">
                                        Class
                                    </p>

                                    <p className="text-lg font-semibold text-gray-800">
                                        {selectedClassData?.name}
                                    </p>
                                </div>

                                <div className="mt-8 grid gap-4 sm:grid-cols-5">

                                    <div className="rounded-lg bg-green-50 p-5">
                                        <p className="text-sm text-green-600">
                                            Present
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-green-700">
                                            {classReport.present}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-red-50 p-5">
                                        <p className="text-sm text-red-600">
                                            Absent
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-red-700">
                                            {classReport.absent}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-yellow-50 p-5">
                                        <p className="text-sm text-yellow-600">
                                            Late
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-yellow-700">
                                            {classReport.late}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-blue-50 p-5">
                                        <p className="text-sm text-blue-600">
                                            Attendance
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-blue-700">
                                            {Math.round(
                                                classReport.attendancePercentage
                                            )}%
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-5">
                                        <p className="text-sm text-gray-500">
                                            Excused
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-gray-700">
                                            {classReport.excused}
                                        </p>
                                    </div>

                                </div>


                            </>
                        ) : selectedClass ? (
                            <div className="mt-8 text-center text-gray-500">
                                No attendance report available.
                            </div>
                        ) : null}
                    </>
                )}

            </div>
        </div>
    )
}

export default Reports
