import { useEffect, useState } from 'react'
import api from '../Services/api'

function Attendance() {
    const [classId, setClassId] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

    const [error, setError] = useState('')
    const [students, setStudents] = useState([])
    const [classes, setClasses] = useState([])

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get('/students')

                const studentsWithStatus = response.data.map((student) => ({
                    ...student,
                    status: 'PRESENT'
                }))

                setStudents(studentsWithStatus)
            }
            catch (error) {
                console.error(error)
                setError('Unable to load students')
            }
        }

        const fetchClasses = async () => {
            try {
                const response = await api.get('/classes')
                setClasses(response.data)

                if (response.data.length > 0) {
                    setClassId(String(response.data[0].id))
                }
            }
            catch (error) {
                console.error(error)
                setError('Unable to load classes')
            }
        }

        fetchStudents()
        fetchClasses()
    }, [])

    const handleStatusChange = (id, status) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.id === id
                    ? { ...student, status }
                    : student
            )
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')

        try {
            if (students.length === 0) {
                setError('No students found')
                return
            }

            if (!classId) {
                setError('Please select a class')
                return
            }

            for (const student of students) {
                await api.post('/attendance', {
                    date: date,
                    status: student.status,
                    students: {
                        id: student.id
                    },
                    classes: {
                        id: Number(classId)
                    }
                })
            }

            alert('Attendance saved successfully')
        }
        catch (error) {
            console.error(error)

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    'Unable to save attendance'
                )
            }
            else {
                setError('Unable to connect to the server')
            }
        }

    }

    return (
        <div className="p-6">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Attendance
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Record and manage student attendance.
                </p>
            </div>

            {error && (
                <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="rounded-xl bg-white shadow-sm">

                <div className="border-b px-6 py-5">
                    <h2 className="font-semibold text-gray-800">
                        Record Attendance
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="grid gap-5 border-b p-6 sm:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Class
                            </label>

                            <select
                                value={classId}
                                onChange={(e) => setClassId(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            >
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

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Date
                            </label>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">
                                        Student
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {students.map((student) => (

                                    <tr key={student.id}>

                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {student?.firstName}{' '}
                                            {student?.lastName}
                                        </td>

                                        <td className="px-6 py-4">

                                            <select
                                                value={student.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        student.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                                            >
                                                <option value="PRESENT">
                                                    Present
                                                </option>

                                                <option value="ABSENT">
                                                    Absent
                                                </option>

                                                <option value="LATE">
                                                    Late
                                                </option>

                                                <option value="EXCUSED">
                                                    Excused
                                                </option>

                                            </select>

                                        </td>

                                    </tr>

                                ))}

                                {students.length === 0 && (

                                    <tr>
                                        <td
                                            colSpan="2"
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            No students found.
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                    <div className="flex justify-end p-6">

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >Save Attendance
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default Attendance
