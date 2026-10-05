import { useEffect, useMemo, useState } from 'react'
import api from '../Services/api'

const STATUSES = [
    { value: 'PRESENT', label: 'Present' },
    { value: 'ABSENT', label: 'Absent' },
    { value: 'LATE', label: 'Late' },
    { value: 'EXCUSED', label: 'Excused' },
]

const today = () => new Date().toISOString().split('T')[0]

function Attendance() {
    const [classes, setClasses] = useState([])
    const [students, setStudents] = useState([])

    const [classId, setClassId] = useState('')
    const [date, setDate] = useState(today())
    const [topic, setTopic] = useState('')

    // Active enrollments for the selected class, the statuses already saved for
    // this date, and the unsaved changes the user is making on top of them.
    const [enrollments, setEnrollments] = useState([])
    const [saved, setSaved] = useState({})
    const [edits, setEdits] = useState({})

    const [loadingRegister, setLoadingRegister] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Classes (backend already scopes teachers to their own) + student names
    useEffect(() => {
        const loadBase = async () => {
            try {
                const [classesRes, studentsRes] = await Promise.all([
                    api.get('/classes'),
                    api.get('/students'),
                ])

                setClasses(classesRes.data)
                setStudents(studentsRes.data)

                if (classesRes.data.length > 0) {
                    setClassId(String(classesRes.data[0].id))
                }
            }
            catch (err) {
                console.error(err)
                setError(err.response?.data?.message || 'Unable to load classes')
            }
        }

        loadBase()
    }, [])

    // Load the register whenever the class or date changes
    useEffect(() => {
        if (!classId || !date) {
            return
        }

        let cancelled = false

        const loadRegister = async () => {
            setLoadingRegister(true)
            setError('')
            setSuccess('')

            try {
                const [enrollmentsRes, recordsRes] = await Promise.all([
                    api.get(`/enrollments/class/${classId}`),
                    api.get(`/attendance/class/${classId}/date/${date}`),
                ])

                if (cancelled) return

                setEnrollments(enrollmentsRes.data.filter((e) => e.status === 'ACTIVE'))

                const map = {}
                recordsRes.data.forEach((r) => {
                    map[r.enrollmentId] = r.status
                })
                setSaved(map)
                setEdits({})
            }
            catch (err) {
                if (cancelled) return
                console.error(err)
                setEnrollments([])
                setSaved({})
                setEdits({})
                setError(err.response?.data?.message || 'Unable to load this register')
            }
            finally {
                if (!cancelled) setLoadingRegister(false)
            }
        }

        loadRegister()

        return () => {
            cancelled = true
        }
    }, [classId, date])

    const studentById = useMemo(() => {
        const map = {}
        students.forEach((s) => {
            map[s.id] = s
        })
        return map
    }, [students])

    const statusOf = (enrollmentId) =>
        edits[enrollmentId] ?? saved[enrollmentId] ?? 'PRESENT'

    const alreadyTaken = Object.keys(saved).length > 0

    const counts = STATUSES.map((s) => ({
        ...s,
        count: enrollments.filter((e) => statusOf(e.id) === s.value).length,
    }))

    const setStatus = (enrollmentId, status) => {
        setSuccess('')
        setEdits((prev) => ({ ...prev, [enrollmentId]: status }))
    }

    const markAll = (status) => {
        setSuccess('')
        const next = {}
        enrollments.forEach((e) => {
            next[e.id] = status
        })
        setEdits(next)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!classId) {
            setError('Please select a class')
            return
        }

        if (enrollments.length === 0) {
            setError('No students are enrolled in this class yet')
            return
        }

        setSaving(true)

        try {
            const response = await api.post('/attendance/bulk', {
                classId: Number(classId),
                date,
                topic: topic.trim() || null,
                records: enrollments.map((en) => ({
                    enrollmentId: en.id,
                    status: statusOf(en.id),
                })),
            })

            const map = {}
            response.data.forEach((r) => {
                map[r.enrollmentId] = r.status
            })
            setSaved(map)
            setEdits({})
            setSuccess(alreadyTaken ? 'Attendance updated' : 'Attendance saved')
        }
        catch (err) {
            console.error(err)
            setError(
                err.response
                    ? err.response.data?.message || 'Unable to save attendance'
                    : 'Unable to connect to the server'
            )
        }
        finally {
            setSaving(false)
        }
    }

    const selectedClass = classes.find((c) => String(c.id) === String(classId))

    return (
        <div className="p-6">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Take the register for a class. Only students actively enrolled in the class are listed.
                </p>
            </div>

            {error && (
                <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {success}
                </div>
            )}

            <div className="rounded-xl bg-white shadow-sm">

                <div className="flex items-center justify-between border-b px-6 py-5">
                    <h2 className="font-semibold text-gray-800">
                        {selectedClass ? `Register for ${selectedClass.code}` : 'Register'}
                    </h2>
                    {alreadyTaken && (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                            Already taken for this date. Saving will update it.
                        </span>
                    )}
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="grid gap-5 border-b p-6 sm:grid-cols-3">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Class</label>
                            <select
                                value={classId}
                                onChange={(e) => setClassId(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                            >
                                {classes.length === 0 && <option value="">No classes available</option>}
                                {classes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.code} (Semester {c.semester}, {c.academicYear})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                value={date}
                                max={today()}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Topic (optional)</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. Normalization"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                            />
                        </div>

                    </div>

                    {enrollments.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
                            <div className="flex flex-wrap gap-2 text-xs">
                                {counts.map((c) => (
                                    <span key={c.value} className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
                                        {c.label}: {c.count}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => markAll('PRESENT')}
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Mark all present
                                </button>
                                <button
                                    type="button"
                                    onClick={() => markAll('ABSENT')}
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Mark all absent
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Student No.</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {loadingRegister ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                            Loading register...
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {enrollments.map((enrollment) => {
                                            const student = studentById[enrollment.studentId]

                                            return (
                                                <tr key={enrollment.id}>
                                                    <td className="px-6 py-4 font-medium text-gray-800">
                                                        {student
                                                            ? `${student.firstName} ${student.lastName}`
                                                            : `Student #${enrollment.studentId}`}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {student?.studentNumber || '—'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={statusOf(enrollment.id)}
                                                            onChange={(e) => setStatus(enrollment.id, e.target.value)}
                                                            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-500"
                                                        >
                                                            {STATUSES.map((s) => (
                                                                <option key={s.value} value={s.value}>
                                                                    {s.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            )
                                        })}

                                        {enrollments.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                                    No students are enrolled in this class. Add them on the Enrollments page.
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end p-6">
                        <button
                            type="submit"
                            disabled={saving || loadingRegister || enrollments.length === 0}
                            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : alreadyTaken ? 'Update attendance' : 'Save attendance'}
                        </button>
                    </div>

                </form>

            </div>

        </div>
    )
}

export default Attendance