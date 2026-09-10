import { useEffect, useRef, useState } from 'react'
import { Search, Plus, Pencil, Trash2, GraduationCap, Upload, X, CheckCircle2, AlertCircle } from 'lucide-react'
import api from '../Services/api'

function Students() {
    const [search, setSearch] = useState('')
    const [students, setStudents] = useState([])
    const [error, setError] = useState([])

    const [showImport, setShowImport] = useState(false)
    const [importFile, setImportFile] = useState(null)
    const [importing, setImporting] = useState(false)
    const [importError, setImportError] = useState('')
    const [importSummary, setImportSummary] = useState(null)
    const fileInputRef = useRef(null)

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

    useEffect(() => {
        fetchStudents()
    }, [])

    const openImport = () => {
        setImportFile(null)
        setImportError('')
        setImportSummary(null)
        setShowImport(true)
    }

    const closeImport = () => {
        setShowImport(false)
        setImportFile(null)
        setImportError('')
        setImportSummary(null)
    }

    const handleImport = async () => {
        if (!importFile) {
            setImportError('Choose a CSV file first.')
            return
        }

        setImporting(true)
        setImportError('')
        setImportSummary(null)

        const formData = new FormData()
        formData.append('file', importFile)

        try {
            // Don't set Content-Type manually here — the browser needs to
            // add its own multipart boundary, which a hardcoded header
            // would clobber.
            const response = await api.post('/students/import', formData)

            setImportSummary(response.data)
            fetchStudents()
        }
        catch (error) {
            setImportError(
                error.response?.data?.message || 'Unable to import students.'
            )
        }
        finally {
            setImporting(false)
        }
    }

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

                <div className="flex gap-3">
                    <button
                        onClick={openImport}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                    >
                        <Upload size={16} />
                        Import CSV
                    </button>

                    <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-green-950">
                        <Plus size={16} />
                        Add Student
                    </button>
                </div>
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

            {showImport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h2 className="font-semibold text-gray-800">Import Students from CSV</h2>
                            <button onClick={closeImport} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="px-6 py-5">
                            <p className="text-sm text-gray-500">
                                Required columns: <code className="text-xs">studentNumber, firstName, lastName, email</code>.
                                Optional: <code className="text-xs">phone, programId, year, semester, status</code>.
                                Column order doesn't matter. Rows that fail (duplicates, missing fields, bad
                                programId) are skipped and reported — the rest still get imported.
                            </p>

                            <div className="mt-4">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv,text/csv"
                                    onChange={(e) => {
                                        setImportFile(e.target.files?.[0] || null)
                                        setImportSummary(null)
                                        setImportError('')
                                    }}
                                    className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
                                />
                            </div>

                            {importError && (
                                <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                    <span>{importError}</span>
                                </div>
                            )}

                            {importSummary && (
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                                        <CheckCircle2 size={16} className="shrink-0" />
                                        <span>
                                            {importSummary.createdCount} of {importSummary.totalRows} row(s) created
                                            {importSummary.skippedCount > 0 && `, ${importSummary.skippedCount} skipped`}.
                                        </span>
                                    </div>

                                    {importSummary.skippedCount > 0 && (
                                        <div className="mt-3 max-h-48 overflow-y-auto rounded-lg border border-gray-100">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-gray-50 text-gray-500">
                                                    <tr>
                                                        <th className="px-3 py-2">Row</th>
                                                        <th className="px-3 py-2">Student No.</th>
                                                        <th className="px-3 py-2">Reason</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {importSummary.results
                                                        .filter((r) => r.status === 'SKIPPED')
                                                        .map((r) => (
                                                            <tr key={r.row}>
                                                                <td className="px-3 py-2 text-gray-500">{r.row}</td>
                                                                <td className="px-3 py-2 text-gray-700">{r.studentNumber || '—'}</td>
                                                                <td className="px-3 py-2 text-red-600">{r.message}</td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                            <button
                                onClick={closeImport}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={importing || !importFile}
                                className="rounded-lg bg-gradient-to-r from-emerald-600 to-green-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-green-950 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {importing ? 'Importing...' : 'Import'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Students