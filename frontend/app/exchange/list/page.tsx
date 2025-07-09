'use client';
import { useEffect, useState } from 'react'
import axios from '@/utils/axios'
import Link from 'next/link'

export default function ExchangeListPage() {
    const [requests, setRequests] = useState([])

    useEffect(() => {
        axios.get('/exchangerequests').then(res => setRequests(res.data))
    }, [])

    return (
        <div>
            <h1>📄 All Exchange Requests</h1>
            <ul>
                {requests.map((r: any) => (
                    <li key={r.exchangeId}>
                        <Link href={`/exchange/${r.exchangeId}`}>Exchange #{r.exchangeId}</Link> - {r.status}
                    </li>
                ))}
            </ul>
        </div>
    )
}
