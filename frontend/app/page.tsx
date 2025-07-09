"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/utils/axios'

export default function HomePage() {
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [notificationCount, setNotificationCount] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        setToken(storedToken)

        if (!storedToken || !storedUser) {
            setLoading(false)
            return
        }

        const user = JSON.parse(storedUser)

        const fetchExchange = async () => {
            try {
                const res = await axios.get('/exchangerequests')
                const myId = user.id
                const matched = res.data.find((req: any) => {
                    const reviewedKey = `reviewed_${req.exchangeId}`
                    const alreadyReviewed = localStorage.getItem(reviewedKey)
                    return (
                        (req.requesterId === myId || req.responderId === myId) &&
                        req.status === 'ACCEPTED' &&
                        !alreadyReviewed
                    )
                })

                if (matched) {
                    router.push(`/review/create?exchangeId=${matched.exchangeId}`)
                } else {
                    setLoading(false)
                }
            } catch (err) {
                console.error('❌ Failed to fetch exchange data', err)
                setLoading(false)
            }
        }

        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`/notifications/user/${user.id}`)
                const unread = res.data.filter((n: any) => !n.isRead)
                setNotificationCount(unread.length)
            } catch (err) {
                console.error('❌ Failed to fetch notifications', err)
            }
        }

        fetchExchange()
        fetchNotifications()

        const handleFocus = () => fetchNotifications()
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'noti_updated') {
                fetchNotifications()
            }
        }

        window.addEventListener('focus', handleFocus)
        window.addEventListener('storage', handleStorage)

        return () => {
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('storage', handleStorage)
        }
    }, [])

    if (loading) return <p className="text-center text-lg mt-10">⏳ Loading...</p>

    return (
        <div className="flex items-center justify-center min-h-screen bg-orange-50">
            <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">🍽 Food Exchange App</h1>

                {token ? (
                    <>
                        <p className="text-center text-gray-700 mb-6">Welcome to food swap app! 🎉</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => router.push('/logout')}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition"
                            >
                                Logout
                            </button>
                            <button
                                onClick={() => router.push('/food/create')}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl transition"
                            >
                                ➕ Food Registration
                            </button>
                            <button
                                onClick={() => router.push('/food/list')}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition"
                            >
                                📋 View food list
                            </button>
                            <button
                                onClick={() => router.push('/exchange/list')}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-xl transition"
                            >
                                📦 View exchange list
                            </button>
                            <button
                                onClick={() => router.push('/review/list')}
                                className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-xl transition"
                            >
                                ⭐ Received Reviews
                            </button>
                            <button
                                onClick={() => router.push('/review/mine')}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-xl transition"
                            >
                                ✍ My Reviews
                            </button>
                            <button
                                onClick={() => router.push('/report/create')}
                                className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-xl transition"
                            >
                                🚨 Report
                            </button>
                            <button
                                onClick={() => router.push('/report/list')}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-xl transition"
                            >
                                📋 List of reports
                            </button>
                            <button
                                onClick={() => router.push('/notification')}
                                className="relative bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-xl transition"
                            >
                                🔔 Notifications
                                {notificationCount > 0 && (
                                    <span className="absolute top-1 right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                    </span>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-center text-gray-600 mb-4">Please log in or sign up.</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => router.push('/login')}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => router.push('/register')}
                                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-xl transition"
                            >
                                Signup
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
