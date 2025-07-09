"use client";
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/utils/axios';

type ExchangeRequest = {
    exchangeId: number;
    requesterId: number;
    responderId: number;
    requestedItemId: number;
    offeredItemId: number;
    status: string;
};

type FoodItem = {
    fooditemId: number;
    title: string;
    imageUrl: string;
};

type Message = {
    messageId: number;
    content: string;
    senderId: number;
    createdAt: string;
};

export default function ExchangeDetailPage() {
    const { id } = useParams();
    const [request, setRequest] = useState<ExchangeRequest | null>(null);
    const [requestedItem, setRequestedItem] = useState<FoodItem | null>(null);
    const [offeredItem, setOfferedItem] = useState<FoodItem | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!token) {
                setError('No token found. Please log in again.');
                return;
            }

            const authAxios = axios.create({
                baseURL: 'http://localhost:8080/api',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            const res = await authAxios.get(`/exchangerequests/food/${id}`);
            setRequest(res.data);

            const [requestedRes, offeredRes] = await Promise.all([
                authAxios.get(`/food/${res.data.requestedItemId}`),
                authAxios.get(`/food/${res.data.offeredItemId}`),
            ]);
            setRequestedItem(requestedRes.data);
            setOfferedItem(offeredRes.data);

            const msgRes = await authAxios.get(`/messages/exchange/${id}`);
            setMessages(msgRes.data);
        } catch (err: any) {
            console.error('❌ Failed to fetch data', err);
            setError('❌ Failed to load exchange detail');
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchAll();
    }, [fetchAll, id]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!request || !requestedItem || !offeredItem) return <p>Loading...</p>;

    return (
        <div style={{ padding: 20 }}>
            <h1>🔁 Exchange Detail #{request.exchangeId}</h1>
            <p>Status: {request.status}</p>

            <h2>🛒 Requested Item</h2>
            <p>{requestedItem.title}</p>
            <img src={requestedItem.imageUrl} alt={requestedItem.title} style={{ width: 200 }} />

            <h2>🎁 Offered Item</h2>
            <p>{offeredItem.title}</p>
            <img src={offeredItem.imageUrl} alt={offeredItem.title} style={{ width: 200 }} />

            <h2>💬 Messages</h2>
            <ul>
                {messages.map((msg) => (
                    <li key={msg.messageId}>
                        [{msg.senderId}] {msg.content} ({new Date(msg.createdAt).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
