'use client'

import { useEffect, useState } from 'react'
import axios from '@/utils/axios'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CreateReviewPage() {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()

    const exchangeIdRaw = searchParams.get('exchangeId')
    const exchangeId = exchangeIdRaw ? Number(exchangeIdRaw) : null

    useEffect(() => {
        if (exchangeId && localStorage.getItem(`reviewed_${exchangeId}`)) {
            router.push('/')
        }
    }, [exchangeId, router])

    const handleSubmit = async () => {
        if (!exchangeId || isNaN(exchangeId)) {
            alert('❌ Missing or invalid exchange ID')
            return
        }

        try {
            const stored = localStorage.getItem('user')
            if (!stored) return alert('Login required')
            const { id: reviewerId } = JSON.parse(stored)

            await axios.post('/reviews', {
                exchangeId,
                reviewerId,
                rating,
                comment,
            })

            localStorage.setItem(`reviewed_${exchangeId}`, 'true')

            alert('✅ Review submitted!')
            router.push('/review/mine')
        } catch (err) {
            console.error(err)
            alert('❌ Failed to submit review.')
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>📝 Leave a Review</h1>
            <p>Exchange ID: <strong>{exchangeId || '❌ Missing'}</strong></p>

            <label>Rating:
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                />
            </label>
            <br />
            <label>Comment:
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
            </label>
            <br />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}
