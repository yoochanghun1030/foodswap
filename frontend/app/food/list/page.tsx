'use client';

import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export type FoodItem = {
    fooditemId: number;
    ownerId: number;
    title: string;
    category: string;
    imageUrl: string;
    createdAt: string;
    isCompleted: boolean;
};

type User = { id: number };

export default function FoodListPage() {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('user');
            if (stored) {
                try {
                    setUser(JSON.parse(stored));
                } catch (e) {
                    console.error('Failed to parse user from localStorage', e);
                }
            }
        }

        axios
            .get<FoodItem[]>('/food')
            .then(res => setFoods(res.data))
            .catch(() => setError('⚠️ Failed to load food list.'));
    }, []);

    const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ?? (typeof window !== 'undefined' ? window.location.origin : '');

    return (
        <div style={{ padding: 20 }}>
            <h1>🍽️ Food list</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {foods.length === 0 && !error && <p>There are no registered foods.</p>}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 20,
                }}
            >
                {foods.map(food => {
                    const src = food.imageUrl.startsWith('http')
                        ? food.imageUrl
                        : `${baseUrl}${food.imageUrl}`;

                    return (
                        <Link
                            key={food.fooditemId}
                            href={`/food/${food.fooditemId}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div
                                style={{
                                    height: 480,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: 15,
                                    borderRadius: 12,
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    cursor: food.isCompleted ? 'not-allowed' : 'pointer',
                                    opacity: food.isCompleted ? 0.5 : 1,
                                }}
                            >
                                <div>
                                    <h3 style={{ margin: 0 }}>{food.title}</h3>
                                    <p>📂 {food.category}</p>
                                    <p>📅 {new Date(food.createdAt).toLocaleDateString()}</p>
                                    <p>🆔 Food ID: {food.fooditemId}</p>
                                    <p>👤 Owner ID: {food.ownerId}</p>
                                    {user && <p>🙋 Your ID: {user.id}</p>}
                                </div>

                                {food.imageUrl && (
                                    <img
                                        src={src}
                                        alt={`Image of ${food.title}`}
                                        style={{
                                            width: '100%',
                                            height: 140,
                                            objectFit: 'cover',
                                            borderRadius: 6,
                                            marginTop: 10,
                                        }}
                                    />
                                )}

                                <div style={{ marginTop: 12 }}>
                                    {!food.isCompleted && user?.id === food.ownerId && (
                                        <button
                                            onClick={e => {
                                                e.preventDefault();
                                                if (!confirm('Are you sure?')) return;
                                                axios.delete(`/food/${food.fooditemId}`).then(() => {
                                                    alert('✅ Deleted!');
                                                    setFoods(curr => curr.filter(f => f.fooditemId !== food.fooditemId));
                                                });
                                            }}
                                            style={{
                                                marginRight: 8,
                                                backgroundColor: '#c00',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 5,
                                                padding: '6px 12px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    )}
                                    {!food.isCompleted && user && (
                                        <button
                                            onClick={e => {
                                                e.preventDefault();
                                                router.push(
                                                    `/exchange/create?requesterId=${user.id}&responderId=${food.ownerId}&requestedItemId=${food.fooditemId}`
                                                );
                                            }}
                                            style={{
                                                backgroundColor: '#2b7',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 5,
                                                padding: '6px 12px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            🤝 Exchange request
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
