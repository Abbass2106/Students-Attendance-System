import { useState } from 'react'

function Students() {
    const [search, setSearch] = useState('')

    const students = [
        { id: 1, name: 'John Smith', email: 'john@gmail.com', className: 'Form 1' },
        { id: 2, name: 'Jane Doe', email: 'jane@gmail.com', className: 'Form 2' },
        { id: 3, name: 'Peter Jones', email: 'peter@gmail.com', className: 'Form 1' },
        { id: 4, name: 'Mary James', email: 'mary@gmail.com', className: 'Form 3' }
    ]

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase())
    )

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

                <button className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                    + Add Student
                </button>
            </div>

            <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
                <input
                    type="text"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Class</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-500">
                                        {student.id}
                                    </td>

                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {student.name}
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">
                                        {student.email}
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">
                                        {student.className}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
                                                Edit
                                            </button>

                                            <button className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default Students
