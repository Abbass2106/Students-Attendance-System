import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../Services/api'

const AuthContext = createContext(null)

// Roles as defined by the backend Role enum (com.example.student_attendance.models.Role)
export const ROLES = {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT',
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // The backend authenticates via an httpOnly JWT cookie, so the frontend
    // can't read the role from the token directly. /users/me is the source
    // of truth for "who am I / what role am I" on every load.
    const fetchUser = useCallback(async () => {
        try {
            const response = await api.get('/users/me')
            setUser(response.data)
            return response.data
        }
        catch (error) {
            setUser(null)
            return null
        }
        finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const logout = () => {
        // NOTE: the backend does not currently expose a /users/logout endpoint
        // to clear the httpOnly accessToken cookie. This clears local auth
        // state so the app treats the user as logged out, but the cookie
        // itself will remain valid until it expires (1 hour) unless a real
        // logout endpoint is added server-side.
        setUser(null)
    }

    const value = {
        user,
        role: user?.role ?? null,
        loading,
        isAuthenticated: !!user,
        refreshUser: fetchUser,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return ctx
}
