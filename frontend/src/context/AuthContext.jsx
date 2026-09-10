import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../Services/api'

const AuthContext = createContext(null)

export const ROLES = {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT',
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

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
