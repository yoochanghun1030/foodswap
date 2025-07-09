'use client';
import { useEffect, useState } from 'react'
import axios from '@/utils/axios'

type Review = {
    reviewId: number
    reviewerId: number
    exchangeId: number
    rating: number
    comment: string
    createdAt: string
}

export default function MyReviewListPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMyReviews = async () => {
            try {
                const stored = localStorage.getItem('user')
                if (!stored) return alert('Login required')
                const { id: reviewerId } = JSON.parse(stored)

                const res = await axios.get(`/reviews/reviewer/${reviewerId}?reviewerId=${reviewerId}`)
                setReviews(res.data)
            } catch (err) {
                console.error(err)
                alert('❌ Failed to load your reviews.')
            } finally {
                setLoading(false)
            }
        }

        fetchMyReviews()
    }, [])

    return (
        <div style={{ padding: 20 }}>
            <h1>🧾 My Written Reviews</h1>
            {loading ? (
                <p>Loading...</p>
            ) : reviews.length === 0 ? (
                <p>You haven’t written any reviews yet.</p>
            ) : (
                <ul>
                    {reviews.map(review => (
                        <li key={review.reviewId} style={{ borderBottom: '1px solid #ccc', marginBottom: 10, paddingBottom: 8 }}>
                            <p>🔁 Exchange ID: {review.exchangeId}</p>
                            <p>⭐ Rating: {review.rating}</p>
                            <p>🗨️ Comment: {review.comment}</p>
                            <p style={{ fontSize: '0.85em', color: 'gray' }}>{new Date(review.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
