// frontend/app/review/create/page.tsx

'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';

export default function CreateReviewPage() {
    const router = useRouter();

    const [exchangeId, setExchangeId] = useState<number | null>(null);
    const [rating, setRating]         = useState(5);
    const [comment, setComment]       = useState('');

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        const rawId  = params.get('exchangeId');
        const id     = rawId ? Number(rawId) : null;
        setExchangeId(id);


        if (id && localStorage.getItem(`reviewed_${id}`)) {
            router.push('/');
        }
    }, [router]);

    const handleSubmit = async () => {
        if (!exchangeId) {
            alert('❌ Missing or invalid exchange ID');
            return;
        }

        const stored = localStorage.getItem('user');
        if (!stored) {
            alert('Login required');
            return;
        }
        const { id: reviewerId } = JSON.parse(stored);

        try {
            await axios.post('/reviews', {
                exchangeId,
                reviewerId,
                rating,
                comment,
            });
            localStorage.setItem(`reviewed_${exchangeId}`, 'true');
            alert('✅ Review submitted!');
            router.push('/review/mine');
        } catch (err) {
            console.error(err);
            alert('❌ Failed to submit review.');
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>📝 Leave a Review</h1>
            <p>
                Exchange ID: <strong>{exchangeId ?? '❌ Missing'}</strong>
            </p>

            <label>
                Rating:
                <input
                    type="number"
                    min={1}
                    max={5}
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                />
            </label>
            <br />

            <label>
                Comment:
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
            </label>
            <br />

            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}
