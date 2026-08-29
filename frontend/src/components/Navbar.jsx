function Navbar() {

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">

            {/* Page title */}
            <div>
                <h2 className="text-lg font-bold text-gray-900">
                    Student Attendance System
                </h2>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">

                {/* Notification */}
                <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    

                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {/* User */}
                <div className="flex items-center gap-3 border-l pl-4">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                        A
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800">
                            Admin
                        </p>

                        <p className="text-xs text-gray-500">
                            Administrator
                        </p>
                    </div>

                </div>

            </div>

        </header>
    )
}

export default Navbar
