import { useEffect, useState } from 'react'
import api from '../Services/api'

function Classes() {
    const [classes, setClasses] = useState([])
    const [className, setClassName] = useState('')
    const [error, setError] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [showForm, setShowForm] = useState(false)

    // Fetch classes
    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes')
            setClasses(response.data)
        }
        catch (error) {
            console.error(error)
            setError(
                error.response?.data?.message ||
                'Unable to load classes'
            )
        }
    }

    useEffect(() => {
        fetchClasses()
    }, [])

    // Open Add form
    const handleAdd = () => {
        setClassName('')
        setEditingId(null)
        setError('')
        setShowForm(true)
    }

    // Open Edit form
    const handleEdit = (schoolClass) => {
        setClassName(schoolClass.name)
        setEditingId(schoolClass.id)
        setError('')
        setShowForm(true)
    }

    // Create / Update
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!className.trim()) {
            setError('Class name is required')
            return
        }

        try {
            if (editingId) {
                // UPDATE
                await api.put(`/classes/${editingId}`, {
                    name: className
                })
            }
            else {
                // CREATE
                await api.post('/classes', {
                    name: className
                })
            }

            setClassName('')
            setEditingId(null)
            setShowForm(false)

            await fetchClasses()
        }
        catch (error) {
            console.error(error)

            setError(
                error.response?.data?.message ||
                'Unable to save class'
            )
        }
    }

    // Delete
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this class?'
        )

        if (!confirmed) {
            return
        }

        try {
            await api.delete(`/classes/${id}`)

            setClasses((prevClasses) =>
                prevClasses.filter(
                    (schoolClass) => schoolClass.id !== id
                )
            )
        }
        catch (error) {
            console.error(error)

            setError(
                error.response?.data?.message ||
                'Unable to delete class'
            )
        }
    }

    // Cancel edit/add
    const handleCancel = () => {
        setClassName('')
        setEditingId(null)
        setShowForm(false)
        setError('')
    }

    return (
        <div className="p-6">

            {/* Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Classes
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage school classes.
                    </p>
                </div>

                <button
                    onClick={handleAdd}
                    className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                    + Add Class
                </button>

            </div>

            {/* Error */}
            {error && (
                <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Add / Edit Form */}
            {showForm && (
                <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 font-semibold text-gray-800">
                        {editingId ? 'Edit Class' : 'Add Class'}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 sm:flex-row"
                    >

                        <input
                            type="text"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            placeholder="Enter class name"
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            {editingId ? 'Update Class' : 'Save Class'}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                    </form>

                </div>
            )}

            {/* Classes */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {classes.map((schoolClass) => (

                    <div
                        key={schoolClass.id}
                        className="rounded-xl bg-white p-6 shadow-sm"
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-600">
                                {schoolClass.name?.charAt(0)?.toUpperCase()}
                            </div>

                            <button className="text-gray-400 hover:text-gray-700">
                                ⋮
                            </button>

                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-gray-800">
                            {schoolClass.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {schoolClass.students?.length || 0} students
                        </p>

                        <div className="mt-5 flex gap-2">

                            <button
                                onClick={() => handleEdit(schoolClass)}
                                className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(schoolClass.id)}
                                className="flex-1 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

                {classes.length === 0 && (
                    <div className="col-span-full rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
                        No classes found.
                    </div>
                )}

            </div>

        </div>
    )
}

export default Classes