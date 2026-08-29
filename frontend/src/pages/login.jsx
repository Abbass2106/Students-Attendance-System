import React, { useState } from 'react'

const initialForm= { email:'', password:''}

const login = () => {
    const [form,setForm] = useState(initialForm)

    const handleChange = (e) => {
        const {name,value} = e.target
        setForm((prev) => ({...prev,[name]:value}))
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

                <div className="mb-8 text-center">
                    <h1 className='text-3xl font-bold text-gray-800'>
                        Students Attendance System
                    </h1>

                    <p className='mt-2 text-gray-500'>
                        Sign in to your account
                    </p>
                </div>

                <form>
                    <div className='mb-5'>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>Email:</label>
                        <input type='email' name='email' value={form.email} onChange={handleChange} placeholder='Enter email'
                            className='w-full rounded-lg border border-gray-300 px-4 py-3 outine-none focus:border-blue-500 focus:ring-blue-200'
                            required >
                        </input>
                    </div>

                    <div className='mb-5'>
                        <label className='mb-2 block text-sm font-medium text-gray-700'>Password:</label>
                        <input type='password' name='password' value={form.password} onChange={handleChange} placeholder='Enter password'
                            className='w-full rounded-lg border border-gray-300 px-4 py-3 outine-none focus:border-blue-500 focus:ring-blue-200'
                            required >
                        </input>
                    </div>

                    <div>
                        <button type='submit' className='w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700'>
                            Login
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default login
