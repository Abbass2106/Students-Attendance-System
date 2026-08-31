import { useEffect, useState } from "react"
import api from '../Services/api'

function Users() {
    const [users, setUsers] = useState(null)
    const [error, setError] = useState('')


    useEffect(() => {

        const fetchUsers = async () => {

            try {
                const response = await api.get('/users')
                setUsers(response.data)
            }

            catch(error){
                console.log(error)
                setError('Unable to load users')
            }
        }

        fetchUsers()
    },[])

    return (
        <div className="p-6">

            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Users
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage system users and their roles.
                    </p>
                </div>

                <button className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                    + Add User
                </button>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">

                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {users?.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {user?.name}
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">
                                        {user?.email}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${user?.role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}
                                        >
                                            {user?.role}
                                        </span>
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

export default Users

