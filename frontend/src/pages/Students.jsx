import { useEffect, useState } from 'react'
import { Search, Plus, Pencil, Trash2, GraduationCap } from 'lucide-react'
import api from '../Services/api'

function Students() {
    const [search, setSearch] = useState('')
    const [students, setStudents] = useState([])
    const [error, setError] = useState([])

    useEffect(() => {

        const fetchStudents = async () => {
            try {
                const response = await api.get('/students')
                setStudents(response.data)
            }

            catch (error) {
                console.log('Unable to fetch students')

                if (error.response) {
                    setError(error.response.data?.message)
                }
            }
        }

        fetchStudents()
    }, [])

    const searchStudents = students.filter((student) =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(search.toLowerCase())
    )

    const initials = (student) =>
        `${student?.firstName?.charAt(0) || ''}${student?.lastName?.charAt(0) || ''}`.toUpperCase()

    return (
        <div className="p-6">

            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Students
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage all students in the school.
                    </p>
                </div>

                <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-green-950">
                    <Plus size={16} />
                    Add Student
                </button>
            </div>

            {error && (
                <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="mb-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="relative">
                    <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {searchStudents.map((student) => (
                                <tr key={student.id} className="transition hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-600">
                                                {initials(student)}
                                            </div>
                                            <span className="font-medium text-gray-800">
                                                {student?.firstName}{' '}{student?.lastName}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">
                                        {student?.email}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50">
                                                <Pencil size={13} />
                                                Edit
                                            </button>

                                            <button className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100">
                                                <Trash2 size={13} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {searchStudents.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <GraduationCap size={28} />
                                            <p className="text-sm text-gray-500">
                                                {students.length === 0 ? 'No students found.' : 'No students match your search.'}
                                            </p>
                                        </div>
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

export default Students
