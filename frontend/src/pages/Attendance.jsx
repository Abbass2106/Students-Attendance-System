import { useState } from 'react'

function Attendance() {
    const [className, setClassName] = useState('Form 1')
    const [date, setDate] = useState('2026-08-30')

    const [students, setStudents] = useState([
        { id: 1, name: 'John Smith', status: 'PRESENT' },
        { id: 2, name: 'Jane Doe', status: 'PRESENT' },
        { id: 3, name: 'Peter Jones', status: 'PRESENT' },
        { id: 4, name: 'Mary James', status: 'PRESENT' }
    ])

    const handleStatusChange = (id, status) => {
        setStudents(
            students.map((student) =>
                student.id === id
                    ? { ...student, status }
                    : student
            )
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log({
            className,
            date,
            students
        })
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
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            >
                                <option>Form 1</option>
                                <option>Form 2</option>
                                <option>Form 3</option>
                                <option>Form 4</option>
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
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {student.name}
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
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end p-6">
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Save Attendance
                        </button>
                    </div>

                </form>
            </div>

        </div>
    )
}

export default Attendance

