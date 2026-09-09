import { useEffect, useState } from 'react'
import { Plus, Trash2, AlertCircle, X, UserPlus } from 'lucide-react'
import api from '../Services/api'

function Enrollments() {
    const [classes, setClasses] = useState([])
    const [students, setStudents] = useState([])
    const [selectedClassId, setSelectedClassId] = useState('')
    const [enrollments, setEnrollments] = useState([])

    const [loading, setLoading] = useState(true)
    const [loadingEnrollments, setLoadingEnrollments] = useState(false)
    const [error, setError] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [studentToEnroll, setStudentToEnroll] = useState('')
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const loadBase = async () => {
            setLoading(true)
            setError('')

            try {
                const [classesRes, studentsRes] = await Promise.all([
                    api.get('/classes'),
                    api.get('/students'),
                ])

                setClasses(classesRes.data)
                setStudents(studentsRes.data)

                if (classesRes.data.length > 0) {
                    setSelectedClassId(String(classesRes.data[0].id))
                }
            }
            catch (err) {
                console.error(err)
                setError('Unable to load classes/students')
            }
            finally {
                setLoading(false)
            }
        }

        loadBase()
    }, [])

    useEffect(() => {
        if (!selectedClassId) {
            setEnrollments([])
            return
        }

        const loadEnrollments = async () => {
            setLoadingEnrollments(true)
            setError('')

            try {
                const response = await api.get(`/enrollments/class/${selectedClassId}`)
                setEnrollments(response.data)
            }
            catch (err) {
                console.error(err)
                setError('Unable to load enrollments for this class')
            }
            finally {
                setLoadingEnrollments(false)
            }
        }

        loadEnrollments()
    }, [selectedClassId])

    const studentById = (id) => students.find((s) => s.id === id)

    const studentLabel = (id) => {
        const s = studentById(id)
        return s ? `${s.firstName} ${s.lastName} (${s.studentNumber})` : `Student #${id}`
    }

    const enrolledStudentIds = new Set(enrollments.map((e) => e.studentId))
    const availableStudents = students.filter((s) => !enrolledStudentIds.has(s.id))

    const openEnrollForm = () => {
        setStudentToEnroll(availableStudents[0]?.id || '')
        setFormError('')
        setShowForm(true)
    }

    const handleEnroll = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!studentToEnroll) {
            setFormError('Choose a student to enroll')
            return
        }

        setSubmitting(true)

        try {
            const response = await api.post('/enrollments', null, {
                params: {
                    studentId: studentToEnroll,
                    classId: selectedClassId,
                },
            })

            setEnrollments((prev) => [...prev, response.data])
            setShowForm(false)
        }
        catch (err) {
            setFormError(err.response?.data?.message || 'Unable to enroll student')
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleRemove = async (studentId) => {
        if (!confirm('Remove this student from the class?')) return

        try {
            await api.delete(`/enrollments/student/${studentId}/class/${selectedClassId}`)
            setEnrollments((prev) => prev.filter((e) => e.studentId !== studentId))
        }
        catch (err) {
            alert(err.response?.data?.message || 'Unable to remove enrollment')
        }
    }

    const selectedClass = classes.find((c) => String(c.id) === String(selectedClassId))

    return (
        <div className="p-6">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Enrollments</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Enroll or withdraw students from a class.
                </p>
            </div>

            {error && (
                <div className="mb-5 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                </div>
            )}

            {loading ? (
                <div className="p-10 text-center text-sm text-gray-500">Loading...</div>
            ) : classes.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">
                    No classes exist yet. Create one on the Classes page first.
                </div>
            ) : (
                <>
                    <div className="mb-5 flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Class</label>
                            <select
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            >
                                {classes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.code} — {c.semester}, {c.academicYear}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={openEnrollForm}
                            disabled={availableStudents.length === 0}
                            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-green-950 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Plus size={16} />
                            Enroll Student
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Student No.</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Enrolled At</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loadingEnrollments ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                Loading enrollments...
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {enrollments.map((enrollment) => {
                                                const student = studentById(enrollment.studentId)

                                                return (
                                                    <tr key={enrollment.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 font-medium text-gray-800">
                                                            {student ? `${student.firstName} ${student.lastName}` : `Student #${enrollment.studentId}`}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-500">
                                                            {student?.studentNumber || '—'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                                    enrollment.status === 'ACTIVE'
                                                                        ? 'bg-emerald-100 text-emerald-700'
                                                                        : 'bg-gray-100 text-gray-600'
                                                                }`}
                                                            >
                                                                {enrollment.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-500">
                                                            {enrollment.enrolledAt
                                                                ? new Date(enrollment.enrolledAt).toLocaleDateString()
                                                                : '—'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <button
                                                                onClick={() => handleRemove(enrollment.studentId)}
                                                                className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                                                            >
                                                                <Trash2 size={13} />
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}

                                            {enrollments.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                        No students enrolled in {selectedClass?.code || 'this class'} yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                <UserPlus size={18} />
                                Enroll Student
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <p className="mb-4 text-sm text-gray-500">
                            Into {selectedClass?.code} — {selectedClass?.semester}, {selectedClass?.academicYear}
                        </p>

                        <form onSubmit={handleEnroll} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Student</label>
                                <select
                                    value={studentToEnroll}
                                    onChange={(e) => setStudentToEnroll(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                >
                                    {availableStudents.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.firstName} {s.lastName} ({s.studentNumber})
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
                                    {submitting ? 'Enrolling...' : 'Enroll'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Enrollments