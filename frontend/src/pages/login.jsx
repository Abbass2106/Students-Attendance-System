import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle, BarChart3, ClipboardCheck, Users } from 'lucide-react'
import api from '../Services/api'

const initialForm = { email: '', password: '' }

const Login = () => {
    const [form, setForm] = useState(initialForm)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await api.post('/users/login', {
                email: form.email,
                password: form.password
            })

            navigate('/dashboard')
        }

        catch (error) {
            console.error(error)

            if (error.response) {
                setError(error.response.data?.message || 'Invalid credentials')
            }

            else {
                setError('Unable to connect with server')
            }
        }

        finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Left / Brand panel */}
            <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-950 p-12 text-white lg:flex">

                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-green-500/20 blur-3xl" />

                <div className="relative flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                        <GraduationCap size={22} />
                    </div>
                    <span className="text-lg font-bold">RollBook</span>
                </div>

                <div className="relative">
                    <h1 className="text-4xl font-extrabold leading-tight">
                        Manage attendance
                        <br />
                        without the hassle.
                    </h1>
                    <p className="mt-4 max-w-md text-emerald-100">
                        Track students, classes, and daily attendance in one clean dashboard built for schools.
                    </p>

                    <div className="mt-10 space-y-4">
                        <div className="flex items-center gap-3 text-sm text-emerald-100">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                                <Users size={16} />
                            </div>
                            Manage students &amp; classes effortlessly
                        </div>
                        <div className="flex items-center gap-3 text-sm text-emerald-100">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                                <ClipboardCheck size={16} />
                            </div>
                            Record attendance in seconds
                        </div>
                        <div className="flex items-center gap-3 text-sm text-emerald-100">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                                <BarChart3 size={16} />
                            </div>
                            Get clear, real-time reports
                        </div>
                    </div>
                </div>

                <p className="relative text-xs text-emerald-200">
                    © {new Date().getFullYear()} RollBook. All rights reserved.
                </p>
            </div>

            {/* Right / Form panel */}
            <div className="flex w-full flex-1 items-center justify-center px-6 py-12 lg:w-1/2">
                <div className="w-full max-w-sm">

                    {/* Mobile brand mark */}
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-900 text-white">
                            <GraduationCap size={20} />
                        </div>
                        <span className="text-lg font-bold text-gray-800">AttendEase</span>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to your account to continue
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8">

                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@school.edu"
                                    className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6 flex justify-end">
                            <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                                Forgot password?
                            </a>
                        </div>

                        {error && (
                            <div className="mb-5 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                                <AlertCircle size={16} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-900 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-700 hover:to-green-950 disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : (
                                <>
                                    Sign in
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                </div>
            </div>

        </div>
    )
}

export default Login
