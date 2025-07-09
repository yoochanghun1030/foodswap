'use client';
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
    const router = useRouter()

    useEffect(() => {
        localStorage.removeItem('token')
        router.replace('/')
    }, [router])

    return <p>logging out...</p>
}
