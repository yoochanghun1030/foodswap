'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
    const router = useRouter()

    useEffect(() => {
        localStorage.removeItem('token') // JWT 삭제
        router.replace('/')              // 메인으로 이동
    }, [router])

    return <p>logging out...</p>
}
