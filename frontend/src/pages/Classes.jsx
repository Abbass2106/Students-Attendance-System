function Classes() {
    const classes = [
        { id: 1, name: 'Form 1', students: 30 },
        { id: 2, name: 'Form 2', students: 28 },
        { id: 3, name: 'Form 3', students: 32 },
        { id: 4, name: 'Form 4', students: 30 }
    ]

    return (
        <div className="p-6">

            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Classes
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage school classes.
                    </p>
                </div>

                <button className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                    + Add Class
                </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {classes.map((schoolClass) => (
                    <div
                        key={schoolClass.id}
                        className="rounded-xl bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-600">
                                {schoolClass.name.replace('Form ', '')}
                            </div>

                            <button className="text-gray-400 hover:text-gray-700">
                                ⋮
                            </button>
                        </div>

                        <h2 className="mt-5 text-lg font-semibold text-gray-800">
                            {schoolClass.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {schoolClass.students} students
                        </p>

                        <div className="mt-5 flex gap-2">
                            <button className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Edit
                            </button>

                            <button className="flex-1 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600 hover:bg-red-100">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Classes

