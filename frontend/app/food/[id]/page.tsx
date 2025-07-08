'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from '@/utils/axios';

const FoodMap = dynamic(() => import('../../components/FoodMap'), {
    ssr: false,
});

type Food = {
    fooditemId: number;
    ownerId: number;
    title: string;
    category: string;
    nutritionFacts: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
};

type User = { id: number };

export default function FoodDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [food, setFood] = useState<Food | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
        axios
            .get<Food>(`/food/${id}`)
            .then(res => setFood(res.data))
            .catch(() => alert('❌ Failed to load food details.'));
    }, [id]);

    if (!food) return <p>Loading…</p>;

    const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ??
        (typeof window !== 'undefined' ? window.location.origin : '');
    const imgSrc = food.imageUrl.startsWith('http')
        ? food.imageUrl
        : `${baseUrl}${food.imageUrl}`;

    const handleDelete = async () => {
        if (!confirm('Delete this food?')) return;
        await axios.delete(`/food/${food.fooditemId}`);
        alert('✅ Deleted!');
        router.push('/food');
    };

    return (
        <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
            <h1>{food.title}</h1>
            <p>
                <strong>Category:</strong> {food.category}
            </p>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{food.nutritionFacts}</pre>

            {/* 이미지 */}
            {food.imageUrl && (
                <img
                    src={imgSrc}
                    alt={food.title}
                    style={{ maxWidth: '100%', marginTop: 10, borderRadius: 6 }}
                />
            )}

            {food.latitude != null && food.longitude != null ? (
                <div style={{ marginTop: 20 }}>
                    <h2>📍 Trading location</h2>
                    <FoodMap position={[food.latitude, food.longitude]} readOnly />
                </div>
            ) : (
                <p style={{ color: '#888' }}>⚠️ There is no transaction location info.</p>
            )}

            <div style={{ marginTop: 30 }}>
                {user?.id === food.ownerId && (
                    <button
                        onClick={handleDelete}
                        style={{
                            marginRight: 10,
                            backgroundColor: '#c00',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 5,
                            padding: '8px 12px',
                            cursor: 'pointer',
                        }}
                    >
                        🗑️ Delete this food
                    </button>
                )}
                <button
                    onClick={() =>
                        router.push(`/exchange/request?targetFoodId=${food.fooditemId}`)
                    }
                    style={{
                        backgroundColor: '#2b7',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 5,
                        padding: '8px 12px',
                        cursor: 'pointer',
                    }}
                >
                    🤝 Request an exchange for this food
                </button>
            </div>
        </div>
    );
}
