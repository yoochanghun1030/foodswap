'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import axios from '@/utils/axios'

const FoodMap = dynamic(() => import('../../components/FoodMap'), { ssr: false })

type FoodItem = {
    fooditemId: number
    title: string
    latitude: number
    longitude: number
}

type Message = {
    messageId: number
    senderId: number
    messageText: string
    sentAt: string
}

export default function ExchangeDetailPage() {
    const { id } = useParams()
    const [request, setRequest] = useState<any>(null)
    const [requestedItem, setRequestedItem] = useState<FoodItem | null>(null)
    const [offeredItem, setOfferedItem] = useState<FoodItem | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState<string>('')

    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null

    const fetchAll = async () => {
        try {
            const res = await axios.get(`/exchangerequests/${id}`)
            setRequest(res.data)

            const [requestedRes, offeredRes] = await Promise.all([
                axios.get(`/food/${res.data.requestedItemId}`),
                axios.get(`/food/${res.data.offeredItemId}`)
            ])
            setRequestedItem(requestedRes.data)
            setOfferedItem(offeredRes.data)

            const msgRes = await axios.get(`/messages/exchange/${id}`)
            setMessages(msgRes.data)
        } catch (error) {
            console.error('❌ Failed to fetch data', error)
        }
    }

    useEffect(() => {
        if (id) fetchAll()
    }, [id])

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return
        try {
            await axios.post('/messages', {
                exchangeId: Number(id),
                senderId: user?.id,
                messageText: newMessage
            })
            setNewMessage('')
            fetchAll()
        } catch (err) {
            console.error('❌ Failed to send message', err)
        }
    }

    const handleChangeStatus = async (newStatus: string) => {
        try {
            await axios.patch(`/exchangerequests/${id}/status`, {
                status: newStatus
            })
            alert(`Status changed to "${newStatus}"`)
            fetchAll()
        } catch (err) {
            console.error('❌ Failed to change status', err)
            alert('You are not authorized or your request has already been processed.')
        }
    }

    if (!request || !requestedItem || !offeredItem) return <p>Loading...</p>

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🔍 Exchange #{request.exchangeId}</h1>
            <p>Status: <strong>{request.status}</strong></p>
            <p>Requester: {request.requesterId}</p>
            <p>Responder: {request.responderId}</p>
            <p>Requested Item: {requestedItem.title}</p>
            <p>Offered Item: {offeredItem.title}</p>

            {/* ✅ 수락/거절 버튼 표시 조건 */}
            {user?.id === request.responderId && request.status === 'PENDING' && (
                <div style={{ margin: '16px 0' }}>
                    <button onClick={() => handleChangeStatus('ACCEPTED')} style={{ marginRight: '10px' }}>✅ ACCEPT</button>
                    <button onClick={() => handleChangeStatus('REJECTED')}>❌ REJECT</button>
                </div>
            )}

            {request.status === 'COMPLETED' && (
                <p style={{ color: 'green', fontWeight: 'bold' }}>🎉 The transaction has been completed!</p>
            )}

            {/* ✅ 위치 지도 렌더링 */}
            {requestedItem.latitude && requestedItem.longitude && (
                <div style={{ marginTop: '20px' }}>
                    <h3>📍 Location</h3>
                    <FoodMap position={[requestedItem.latitude, requestedItem.longitude]} readOnly />
                </div>
            )}

            <hr />
            <h2>💬 Messages</h2>
            <div style={{
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
                maxHeight: '300px',
                overflowY: 'auto',
                background: '#f9f9f9',
                borderRadius: '6px'
            }}>
                {messages.map(msg => (
                    <div key={msg.messageId} style={{ marginBottom: '8px' }}>
                        <strong>👤 User {msg.senderId}</strong>: {msg.messageText}
                        <div style={{ fontSize: '0.8em', color: 'gray' }}>{new Date(msg.sentAt).toLocaleString()}</div>
                    </div>
                ))}
            </div>

            <textarea
                rows={3}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="✍️ Type your message here..."
                style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px' }}
            />
            <button onClick={handleSendMessage} style={{ padding: '8px 16px' }}>📩 Send Message</button>
        </div>
    )
}
