import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/login"
import AdminDashboard from "./pages/adminDashboard"
import Users from "./pages/Users"
import Reports from "./pages/Reports"
import Classes from "./pages/Classes"
import Attendance from "./pages/Attendance"
import Students from "./pages/Students"
import DashboardLayout from "./components/DashboardLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="classes" element={<Classes />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="students" element={<Students />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
