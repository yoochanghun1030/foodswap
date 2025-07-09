"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/utils/axios'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        try {
            const res = await axios.post('/auth/register', {
                email,
                username,
                password,
            })

            setSuccess('Your registration has been completed. Please log in..')
            setTimeout(() => router.push('/login'), 1500)
        } catch (err: any) {
            setError('Failed to register.')
        }
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>join the membership</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="name"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                /><br /><br />
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                /><br /><br />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                /><br /><br />
                <button type="submit">join the membership</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    )
}
