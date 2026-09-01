import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-gray-50">

            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <Navbar />
                <main className="flex-1 animate-fade-in overflow-x-hidden">
                    <Outlet />
                </main>
            </div>

        </div>
    )
}

export default DashboardLayout