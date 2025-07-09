"use client";
import { useEffect, useState } from 'react'
import axios from '@/utils/axios'
import { useRouter } from 'next/navigation'

type Notification = {
    notificationId: number
    type: string
    content: string
    isRead: boolean
    createdAt: string
}

export default function NotificationPage() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const router = useRouter()

    useEffect(() => {
        const fetchAndMarkNotifications = async () => {
            try {
                const userData = localStorage.getItem('user')
                const token = localStorage.getItem('token')
                const user = userData ? JSON.parse(userData) : null
                const userId = user?.id

                if (!userId || !token) {
                    alert('You must log in.')
                    router.push('/login')
                    return
                }

                const res = await axios.get(`/notifications/user/${userId}`)
                const fetched: Notification[] = res.data
                setNotifications(fetched)

                const unreadIds = fetched
                    .filter(n => !n.isRead)
                    .map(n => n.notificationId)

                if (unreadIds.length > 0) {
                    await axios.patch(
                        `/notifications/mark-as-read`,
                        { ids: unreadIds },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    )
                }

                localStorage.setItem('noti_updated', Date.now().toString())
            } catch (err) {
                console.error('❌ Failed to fetch or mark notifications.', err)
            }
        }

        fetchAndMarkNotifications()
    }, [router])

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🔔 Notification List</h1>
            {notifications.length === 0 ? (
                <p>There are no notifications.</p>
            ) : (
                <ul>
                    {notifications.map(n => (
                        <li
                            key={n.notificationId}
                            style={{
                                marginBottom: '15px',
                                background: n.isRead ? '#f2f2f2' : '#fff',
                                padding: '10px',
                                borderRadius: '10px',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                            }}
                        >
                            <p><strong>{n.type}</strong>: {n.content}</p>
                            <p style={{ fontSize: '12px', color: 'gray' }}>
                                {new Date(n.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
