import { useEffect, useState } from 'react'
import api from '../Services/api'
import { useAuth, ROLES } from '../context/AuthContext'

const emptyForm = {
    code: '',
    courseId: '',
    semester: '',
    academicYear: '',
    lecturerId: '',
    room: '',
    capacity: '',
    status: 'ACTIVE',
}

function Classes() {
    const { role } = useAuth()

    const canManageClasses = role === ROLES.ADMIN

    const [classes, setClasses] = useState([])
    const [courses, setCourses] = useState([])
    const [teachers, setTeachers] = useState([])

    const [form, setForm] = useState(emptyForm)

    const [editingId, setEditingId] = useState(null)
    const [showForm, setShowForm] = useState(false)

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [error, setError] = useState('')

    // --------------------------------------------------
    // Fetch classes, courses and teachers
    // --------------------------------------------------

    const fetchData = async () => {
        setLoading(true)
        setError('')

        try {
            const [classesResponse, coursesResponse, usersResponse] =
                await Promise.all([
                    api.get('/classes'),
                    api.get('/courses'),
                    api.get('/users'),
                ])

            setClasses(classesResponse.data)
            setCourses(coursesResponse.data)

            const teacherUsers = usersResponse.data.filter(
                (user) => user.role === ROLES.TEACHER
            )

            setTeachers(teacherUsers)
        }
        catch (err) {
            console.error(err)

            setError(
                err.response?.data?.message ||
                'Unable to load class data'
            )
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // --------------------------------------------------
    // Form handling
    // --------------------------------------------------

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }))
    }

    const handleAdd = () => {
        setForm(emptyForm)
        setEditingId(null)
        setError('')
        setShowForm(true)
    }

    const handleEdit = (schoolClass) => {
        setForm({
            code: schoolClass.code || '',
            courseId: schoolClass.courseId || '',
            semester: schoolClass.semester || '',
            academicYear: schoolClass.academicYear || '',
            lecturerId: schoolClass.lecturerId || '',
            room: schoolClass.room || '',
            capacity: schoolClass.capacity || '',
            status: schoolClass.status || 'ACTIVE',
        })

        setEditingId(schoolClass.id)
        setError('')
        setShowForm(true)
    }

    const handleCancel = () => {
        setForm(emptyForm)
        setEditingId(null)
        setShowForm(false)
        setError('')
    }

    // --------------------------------------------------
    // Create / Update
    // --------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!form.code.trim()) {
            setError('Class code is required')
            return
        }

        if (!form.courseId) {
            setError('Please select a course')
            return
        }

        if (!form.semester) {
            setError('Semester is required')
            return
        }

        if (!form.academicYear.trim()) {
            setError('Academic year is required')
            return
        }

        setSubmitting(true)

        const payload = {
            code: form.code.trim(),
            courseId: Number(form.courseId),
            semester: Number(form.semester),
            academicYear: form.academicYear.trim(),
            lecturerId: form.lecturerId
                ? Number(form.lecturerId)
                : null,
            room: form.room.trim() || null,
            capacity: form.capacity
                ? Number(form.capacity)
                : null,
            status: form.status,
        }

        try {
            if (editingId) {
                const response = await api.put(
                    `/classes/${editingId}`,
                    payload
                )

                setClasses((previous) =>
                    previous.map((schoolClass) =>
                        schoolClass.id === editingId
                            ? response.data
                            : schoolClass
                    )
                )
            }
            else {
                const response = await api.post(
                    '/classes',
                    payload
                )

                setClasses((previous) => [
                    ...previous,
                    response.data,
                ])
            }

            handleCancel()
        }
        catch (err) {
            console.error(err)

            setError(
                err.response?.data?.message ||
                'Unable to save class'
            )
        }
        finally {
            setSubmitting(false)
        }
    }

    // --------------------------------------------------
    // Delete
    // --------------------------------------------------

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this class?'
        )

        if (!confirmed) {
            return
        }

        setError('')

        try {
            await api.delete(`/classes/${id}`)

            setClasses((previous) =>
                previous.filter(
                    (schoolClass) =>
                        schoolClass.id !== id
                )
            )
        }
        catch (err) {
            console.error(err)

            setError(
                err.response?.data?.message ||
                'Unable to delete class'
            )
        }
    }

    // --------------------------------------------------
    // Helper functions
    // --------------------------------------------------

    const getCourseName = (courseId) => {
        const course = courses.find(
            (item) => item.id === courseId
        )

        if (!course) {
            return 'Unknown course'
        }

        return `${course.code} - ${course.name}`
    }

    const getTeacherName = (teacherId) => {
        if (!teacherId) {
            return 'Not assigned'
        }

        const teacher = teachers.find(
            (user) => user.id === teacherId
        )

        return teacher?.name || 'Unknown teacher'
    }

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <div className="p-6">

            {/* Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Classes
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage classes and assign teachers.
                    </p>
                </div>

                {canManageClasses && (
                    <button
                        onClick={handleAdd}
                        className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        + Add Class
                    </button>
                )}

            </div>

            {/* Error */}
            {error && (
                <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Form */}
            {showForm && canManageClasses && (
                <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-800">
                        {editingId
                            ? 'Edit Class'
                            : 'Create Class'}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4 sm:grid-cols-2"
                    >

                        {/* Class Code */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Class Code
                            </label>

                            <input
                                type="text"
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                placeholder="e.g. CS101-A"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        {/* Course */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Course
                            </label>

                            <select
                                name="courseId"
                                value={form.courseId}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="">
                                    Select course
                                </option>

                                {courses.map((course) => (
                                    <option
                                        key={course.id}
                                        value={course.id}
                                    >
                                        {course.code} - {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Semester */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Semester
                            </label>

                            <select
                                name="semester"
                                value={form.semester}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="">
                                    Select semester
                                </option>

                                <option value="1">
                                    Semester 1
                                </option>

                                <option value="2">
                                    Semester 2
                                </option>
                            </select>
                        </div>

                        {/* Academic Year */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Academic Year
                            </label>

                            <input
                                type="text"
                                name="academicYear"
                                value={form.academicYear}
                                onChange={handleChange}
                                placeholder="e.g. 2026/2027"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        {/* Teacher */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Teacher
                            </label>

                            <select
                                name="lecturerId"
                                value={form.lecturerId}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="">
                                    No teacher assigned
                                </option>

                                {teachers.map((teacher) => (
                                    <option
                                        key={teacher.id}
                                        value={teacher.id}
                                    >
                                        {teacher.name} - {teacher.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Room */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Room
                            </label>

                            <input
                                type="text"
                                name="room"
                                value={form.room}
                                onChange={handleChange}
                                placeholder="e.g. Room 204"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Capacity
                            </label>

                            <input
                                type="number"
                                name="capacity"
                                value={form.capacity}
                                onChange={handleChange}
                                min="1"
                                placeholder="e.g. 50"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Status
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="ACTIVE">
                                    Active
                                </option>

                                <option value="INACTIVE">
                                    Inactive
                                </option>
                            </select>
                        </div>

                        {/* Form buttons */}
                        <div className="flex gap-3 pt-2 sm:col-span-2">

                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {submitting
                                    ? 'Saving...'
                                    : editingId
                                        ? 'Save Changes'
                                        : 'Create Class'}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* Classes table */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

                {loading ? (
                    <div className="p-10 text-center text-sm text-gray-500">
                        Loading classes...
                    </div>
                ) : classes.length === 0 ? (
                    <div className="p-10 text-center text-sm text-gray-500">
                        No classes found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">

                                <tr>
                                    <th className="px-6 py-4">
                                        Class
                                    </th>

                                    <th className="px-6 py-4">
                                        Course
                                    </th>

                                    <th className="px-6 py-4">
                                        Semester
                                    </th>

                                    <th className="px-6 py-4">
                                        Academic Year
                                    </th>

                                    <th className="px-6 py-4">
                                        Teacher
                                    </th>

                                    <th className="px-6 py-4">
                                        Room
                                    </th>

                                    <th className="px-6 py-4">
                                        Actions
                                    </th>
                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {classes.map((schoolClass) => (

                                    <tr
                                        key={schoolClass.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4">

                                            <div className="font-semibold text-gray-800">
                                                {schoolClass.code}
                                            </div>

                                            <div className="mt-1 text-xs text-gray-500">
                                                {schoolClass.status}
                                            </div>

                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {getCourseName(
                                                schoolClass.courseId
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            Semester {schoolClass.semester}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {schoolClass.academicYear}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {getTeacherName(
                                                schoolClass.lecturerId
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {schoolClass.room || '—'}
                                        </td>

                                        <td className="px-6 py-4">

                                            {canManageClasses && (
                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                schoolClass
                                                            )
                                                        }
                                                        className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                schoolClass.id
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    )
}

export default Classes
