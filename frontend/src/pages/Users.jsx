import { useEffect, useState } from "react"
import { X, AlertCircle, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"
import api from '../Services/api'

const ROLES = ['ADMIN', 'TEACHER', 'STUDENT']

const initialForm = { name: '', email: '', password: '', role: 'STUDENT' }

function Users() {
    const [users, setUsers] = useState(null)
    const [error, setError] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(initialForm)
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const [successNote, setSuccessNote] = useState(null)

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users')
            setUsers(response.data)
        }
        catch (error) {
            console.log(error)
            setError('Unable to load users')
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleOpenForm = () => {
        setForm(initialForm)
        setFormError('')
        setSuccessNote(null)
        setShowForm(true)
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setFormError('')
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        setSubmitting(true)

        try {
            const response = await api.post('/users', {
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
            })

            setUsers((prev) => (prev ? [...prev, response.data] : [response.data]))
            setShowForm(false)

            if (form.role === 'STUDENT') {
                setSuccessNote({
                    name: form.name,
                    email: form.email,
                })
            }
        }
        catch (error) {
            console.error(error)

            if (error.response) {
                setFormError(error.response.data?.message || 'Unable to create user')
            } else {
                setFormError('Unable to connect with server')
            }
        }
        finally {
            setSubmitting(false)
        }
    }

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

                <button
                    onClick={handleOpenForm}
                    className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                    + Add User
                </button>
            </div>

            {error && (
                <div className="mb-5 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                </div>
            )}

            {successNote && (
                <div className="mb-5 flex items-start gap-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                    <div>
                        <p className="font-medium">
                            {successNote.name} can now log in as a student.
                        </p>
                        <p className="mt-1 text-emerald-700">
                            To let them see their own classes and attendance, make sure a
                            student profile exists on the{' '}
                            <Link to="/dashboard/students" className="font-semibold underline">
                                Students page
                            </Link>{' '}
                            using the same email ({successNote.email}).
                        </p>
                    </div>
                </div>
            )}

            {/* Add User modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Add User
                            </h2>
                            <button
                                onClick={handleCloseForm}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Jane Doe"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="jane@school.edu"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                />
                                {form.role === 'STUDENT' && (
                                    <p className="mt-1.5 text-xs text-gray-500">
                                        Tip: use the same email as their entry on the Students
                                        page so their login connects to their student profile.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Temporary password"
                                    required
                                    minLength={6}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                >
                                    {ROLES.map((role) => (
                                        <option key={role} value={role}>
                                            {role.charAt(0) + role.slice(1).toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formError && (
                                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                                    <AlertCircle size={16} className="shrink-0" />
                                    {formError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                                >
                                    {submitting ? 'Creating...' : 'Create User'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">

                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
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
                                                : user?.role === 'TEACHER'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}
                                        >
                                            {user?.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {users?.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-gray-500">
                                        No users found.
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

export default Users