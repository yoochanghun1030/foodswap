"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/utils/axios'

interface JwtResponseDto {
    token: string
    userId: number
    username: string
    email: string
    role: string
}

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const res = await axios.post<JwtResponseDto>('/auth/login', { email, password })
            const { token, userId, username, email: userEmail, role } = res.data

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify({
                id: userId,
                username,
                email: userEmail,
                role
            }))

            router.push('/')
        } catch (err: any) {
            console.error(err)
            setError('Login failed.')
        }
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                /><br /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                /><br /><br />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
