import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, AlertCircle, Building2, Layers, BookOpen } from 'lucide-react'
import api from '../Services/api'

const TABS = [
    { key: 'departments', label: 'Departments', icon: Building2 },
    { key: 'programs', label: 'Programs', icon: Layers },
    { key: 'courses', label: 'Courses', icon: BookOpen },
]

function AcademicStructure() {
    const [activeTab, setActiveTab] = useState('departments')

    const [departments, setDepartments] = useState([])
    const [programs, setPrograms] = useState([])
    const [courses, setCourses] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchAll = async () => {
        setLoading(true)
        setError('')

        try {
            const [deptRes, progRes, courseRes] = await Promise.all([
                api.get('/departments'),
                api.get('/programs'),
                api.get('/courses'),
            ])

            setDepartments(deptRes.data)
            setPrograms(progRes.data)
            setCourses(courseRes.data)
        }
        catch (err) {
            console.error(err)
            setError('Unable to load academic structure data')
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAll()
    }, [])

    const departmentName = (id) =>
        departments.find((d) => d.id === id)?.name || '—'

    return (
        <div className="p-6">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Academic Structure
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage departments, programs, and courses.
                </p>
            </div>

            {error && (
                <div className="mb-5 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="mb-5 flex gap-2 border-b border-gray-200">
                {TABS.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.key

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                                isActive
                                    ? 'border-emerald-600 text-emerald-700'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {loading ? (
                <div className="p-10 text-center text-sm text-gray-500">
                    Loading...
                </div>
            ) : (
                <>
                    {activeTab === 'departments' && (
                        <DepartmentsTab
                            departments={departments}
                            setDepartments={setDepartments}
                        />
                    )}

                    {activeTab === 'programs' && (
                        <ProgramsTab
                            programs={programs}
                            setPrograms={setPrograms}
                            departments={departments}
                            departmentName={departmentName}
                        />
                    )}

                    {activeTab === 'courses' && (
                        <CoursesTab
                            courses={courses}
                            setCourses={setCourses}
                            departments={departments}
                            departmentName={departmentName}
                        />
                    )}
                </>
            )}

        </div>
    )
}

// ---------------------------------------------------------------------
// Shared modal shell
// ---------------------------------------------------------------------
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

function FieldError({ message }) {
    if (!message) return null

    return (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0" />
            {message}
        </div>
    )
}

// ---------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------
function DepartmentsTab({ departments, setDepartments }) {
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({ name: '', code: '' })
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const openAdd = () => {
        setEditingId(null)
        setForm({ name: '', code: '' })
        setFormError('')
        setShowForm(true)
    }

    const openEdit = (dept) => {
        setEditingId(dept.id)
        setForm({ name: dept.name, code: dept.code })
        setFormError('')
        setShowForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        setSubmitting(true)

        try {
            if (editingId) {
                const response = await api.put(`/departments/${editingId}`, form)
                setDepartments((prev) =>
                    prev.map((d) => (d.id === editingId ? response.data : d))
                )
            } else {
                const response = await api.post('/departments', form)
                setDepartments((prev) => [...prev, response.data])
            }

            setShowForm(false)
        }
        catch (err) {
            setFormError(err.response?.data?.message || 'Unable to save department')
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this department? Programs/courses linked to it may be affected.')) return

        try {
            await api.delete(`/departments/${id}`)
            setDepartments((prev) => prev.filter((d) => d.id !== id))
        }
        catch (err) {
            alert(err.response?.data?.message || 'Unable to delete department')
        }
    }

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-green-950"
                >
                    <Plus size={16} />
                    Add Department
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {departments.map((dept) => (
                                <tr key={dept.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{dept.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{dept.code}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEdit(dept)}
                                                className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                <Pencil size={13} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dept.id)}
                                                className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                                            >
                                                <Trash2 size={13} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {departments.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-gray-500">
                                        No departments yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <Modal title={editingId ? 'Edit Department' : 'Add Department'} onClose={() => setShowForm(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="e.g. Computer Science"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Code</label>
                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                                placeholder="e.g. CS"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <FieldError message={formError} />

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Department'}
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
                </Modal>
            )}
        </div>
    )
}

// ---------------------------------------------------------------------
// Programs
// ---------------------------------------------------------------------
function ProgramsTab({ programs, setPrograms, departments, departmentName }) {
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({ name: '', code: '', departmentId: '' })
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const openAdd = () => {
        setEditingId(null)
        setForm({ name: '', code: '', departmentId: departments[0]?.id || '' })
        setFormError('')
        setShowForm(true)
    }

    const openEdit = (program) => {
        setEditingId(program.id)
        setForm({
            name: program.name,
            code: program.code,
            departmentId: program.departmentId,
        })
        setFormError('')
        setShowForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!form.departmentId) {
            setFormError('Add a department first before creating a program.')
            return
        }

        setSubmitting(true)

        const payload = { ...form, departmentId: Number(form.departmentId) }

        try {
            if (editingId) {
                const response = await api.put(`/programs/${editingId}`, payload)
                setPrograms((prev) =>
                    prev.map((p) => (p.id === editingId ? response.data : p))
                )
            } else {
                const response = await api.post('/programs', payload)
                setPrograms((prev) => [...prev, response.data])
            }

            setShowForm(false)
        }
        catch (err) {
            setFormError(err.response?.data?.message || 'Unable to save program')
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this program?')) return

        try {
            await api.delete(`/programs/${id}`)
            setPrograms((prev) => prev.filter((p) => p.id !== id))
        }
        catch (err) {
            alert(err.response?.data?.message || 'Unable to delete program')
        }
    }

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-green-950"
                >
                    <Plus size={16} />
                    Add Program
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {programs.map((program) => (
                                <tr key={program.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{program.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{program.code}</td>
                                    <td className="px-6 py-4 text-gray-500">{departmentName(program.departmentId)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEdit(program)}
                                                className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                <Pencil size={13} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(program.id)}
                                                className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                                            >
                                                <Trash2 size={13} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {programs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                        No programs yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <Modal title={editingId ? 'Edit Program' : 'Add Program'} onClose={() => setShowForm(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="e.g. BSc Computer Science"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Code</label>
                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                                placeholder="e.g. BSC-CS"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Department</label>
                            <select
                                value={form.departmentId}
                                onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="" disabled>Select a department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            {departments.length === 0 && (
                                <p className="mt-1.5 text-xs text-amber-600">
                                    No departments exist yet — add one on the Departments tab first.
                                </p>
                            )}
                        </div>

                        <FieldError message={formError} />

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Program'}
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
                </Modal>
            )}
        </div>
    )
}

// ---------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------
function CoursesTab({ courses, setCourses, departments, departmentName }) {
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({ code: '', name: '', credits: '', departmentId: '' })
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const openAdd = () => {
        setEditingId(null)
        setForm({ code: '', name: '', credits: '', departmentId: departments[0]?.id || '' })
        setFormError('')
        setShowForm(true)
    }

    const openEdit = (course) => {
        setEditingId(course.id)
        setForm({
            code: course.code,
            name: course.name,
            credits: course.credits,
            departmentId: course.departmentId || '',
        })
        setFormError('')
        setShowForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        setSubmitting(true)

        const payload = {
            ...form,
            credits: Number(form.credits),
            departmentId: form.departmentId ? Number(form.departmentId) : null,
        }

        try {
            if (editingId) {
                const response = await api.put(`/courses/${editingId}`, payload)
                setCourses((prev) =>
                    prev.map((c) => (c.id === editingId ? response.data : c))
                )
            } else {
                const response = await api.post('/courses', payload)
                setCourses((prev) => [...prev, response.data])
            }

            setShowForm(false)
        }
        catch (err) {
            setFormError(err.response?.data?.message || 'Unable to save course')
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this course? Classes/sections linked to it may be affected.')) return

        try {
            await api.delete(`/courses/${id}`)
            setCourses((prev) => prev.filter((c) => c.id !== id))
        }
        catch (err) {
            alert(err.response?.data?.message || 'Unable to delete course')
        }
    }

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-green-950"
                >
                    <Plus size={16} />
                    Add Course
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Credits</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{course.code}</td>
                                    <td className="px-6 py-4 text-gray-500">{course.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{course.credits}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {course.departmentId ? departmentName(course.departmentId) : '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEdit(course)}
                                                className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                <Pencil size={13} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                                            >
                                                <Trash2 size={13} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {courses.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No courses yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <Modal title={editingId ? 'Edit Course' : 'Add Course'} onClose={() => setShowForm(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Code</label>
                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                                placeholder="e.g. CS301"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="e.g. Database Systems"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Credits</label>
                            <input
                                type="number"
                                min="0"
                                value={form.credits}
                                onChange={(e) => setForm((f) => ({ ...f, credits: e.target.value }))}
                                placeholder="e.g. 3"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Department</label>
                            <select
                                value={form.departmentId}
                                onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value="">No department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>

                        <FieldError message={formError} />

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Course'}
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
                </Modal>
            )}
        </div>
    )
}

export default AcademicStructure