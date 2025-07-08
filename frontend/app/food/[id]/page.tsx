'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/utils/axios';

type FoodItem = {
    fooditemId: number;
    title: string;
};

type Message = {
    messageId: number;
    senderId: number;
    messageText: string;
    sentAt: string;
};

type ExchangeRequest = {
    exchangeId: number;
    status: string;
    requesterId: number;
    responderId: number;
    requestedItemId: number;
    offeredItemId: number;
};

type User = {
    id: number;
    [key: string]: unknown;
};

export default function ExchangeDetailPage() {
    const { id } = useParams();
    const [request, setRequest] = useState<ExchangeRequest | null>(null);
    const [requestedItem, setRequestedItem] = useState<FoodItem | null>(null);
    const [offeredItem, setOfferedItem] = useState<FoodItem | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ??
        (typeof window !== 'undefined' ? window.location.origin : '');

    const user: User | null =
        typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('user') || 'null')
            : null;

    const fetchAll = useCallback(async () => {
        if (!id || !user) return;

        try {
            const res = await axios.get(`${baseUrl}/exchangerequests/${id}`);
            setRequest(res.data);

            const [requestedRes, offeredRes] = await Promise.all([
                axios.get(`${baseUrl}/food/${res.data.requestedItemId}`),
                axios.get(`${baseUrl}/food/${res.data.offeredItemId}`),
            ]);
            setRequestedItem(requestedRes.data);
            setOfferedItem(offeredRes.data);

            const msgRes = await axios.get(`${baseUrl}/messages/exchange/${id}`);
            setMessages(msgRes.data);
        } catch (error) {
            console.error('❌ Failed to fetch data', error);
        }
    }, [id, user]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) return;
        try {
            await axios.post(`${baseUrl}/messages`, {
                exchangeId: Number(id),
                senderId: user.id,
                messageText: newMessage,
            });
            setNewMessage('');
            fetchAll();
        } catch (err) {
            console.error('❌ Failed to send message', err);
        }
    };

    const handleChangeStatus = async (newStatus: string) => {
        try {
            await axios.patch(`${baseUrl}/exchangerequests/${id}/status`, {
                status: newStatus,
            });
            alert(`Status changed to "${newStatus}"`);
            fetchAll();
        } catch (err) {
            console.error('❌ Failed to change status', err);
            alert('You are not authorized or your request has already been processed.');
        }
    };

    if (!request || !requestedItem || !offeredItem) return <p>Loading...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🔍 Exchange #{request.exchangeId}</h1>
            <p>Status: <strong>{request.status}</strong></p>
            <p>Requester: {request.requesterId}</p>
            <p>Responder: {request.responderId}</p>
            <p>Requested Item: {requestedItem.title}</p>
            <p>Offered Item: {offeredItem.title}</p>

            {user?.id === request.responderId && request.status === 'PENDING' && (
                <div style={{ margin: '16px 0' }}>
                    <button onClick={() => handleChangeStatus('ACCEPTED')} style={{ marginRight: '10px' }}>
                        ✅ ACCEPTED
                    </button>
                    <button onClick={() => handleChangeStatus('REJECTED')}>❌ REJECTED</button>
                </div>
            )}

            {request.status === 'COMPLETED' && (
                <p style={{ color: 'green', fontWeight: 'bold' }}>
                    🎉 The transaction has been completed!
                </p>
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
                borderRadius: '6px',
            }}>
                {messages.map(msg => (
                    <div key={msg.messageId} style={{ marginBottom: '8px' }}>
                        <strong>👤 User {msg.senderId}</strong>: {msg.messageText}
                        <div style={{ fontSize: '0.8em', color: 'gray' }}>
                            {new Date(msg.sentAt).toLocaleString()}
                        </div>
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
            <button onClick={handleSendMessage} style={{ padding: '8px 16px' }}>
                📩 Send Message
            </button>
        </div>
    );
}
