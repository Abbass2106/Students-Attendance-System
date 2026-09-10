import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/login"
import Dashboard from "./pages/Dashboard"
import Users from "./pages/Users"
import Reports from "./pages/Reports"
import Classes from "./pages/Classes"
import Attendance from "./pages/Attendance"
import Students from "./pages/Students"
import Enrollments from "./pages/Enrollment"
import AcademicStructure from "./pages/AcademicStructure"
import Unauthorized from "./pages/Unauthorized"
import DashboardLayout from "./components/DashboardLayout"
import ProtectedRoute from "./routes/ProtectedRoute"
import { ROLES } from "./context/AuthContext"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Every role has a dashboard landing page; Dashboard.jsx picks which one to render based on the logged-in user's role. */}
          <Route index element={<Dashboard />} />

          {/* Admin + Teacher: class/attendance-level tools */}
          <Route
            path="students"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <Students />
              </ProtectedRoute>
            }
          />

          <Route
            path="classes"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <Classes />
              </ProtectedRoute>
            }
          />

          <Route
            path="enrollments"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <Enrollments />
              </ProtectedRoute>
            }
          />
          <Route
            path="attendance"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <Attendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="reports"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Admin only: user/account management */}
          <Route
            path="users"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <Users />
              </ProtectedRoute>
            }
          />

          {/* Admin only: departments, programs, courses */}
          <Route
            path="academic-structure"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <AcademicStructure />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App