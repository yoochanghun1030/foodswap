"use client";
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

export default function ReviewListPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const stored = localStorage.getItem('user')
                if (!stored) return alert('Login required')
                const { id: reviewerId } = JSON.parse(stored)

                const res = await axios.get(`/reviews/reviewer/${reviewerId}?reviewerId=${reviewerId}`)
                setReviews(res.data)
            } catch (err) {
                console.error(err)
                alert('❌ Failed to load reviews.')
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [])

    return (
        <div style={{ padding: 20 }}>
            <h1>📋 My Reviews by Exchange</h1>
            {loading ? (
                <p>Loading...</p>
            ) : reviews.length === 0 ? (
                <p>No reviews found.</p>
            ) : (
                <ul>
                    {reviews.map(review => (
                        <li key={review.reviewId} style={{ marginBottom: '16px', borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
                            <p>🔁 Exchange ID: {review.exchangeId}</p>
                            <p>⭐ Rating: <strong>{review.rating}</strong></p>
                            <p>🗨️ Comment: {review.comment}</p>
                            <p style={{ fontSize: '0.9em', color: 'gray' }}>{new Date(review.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
