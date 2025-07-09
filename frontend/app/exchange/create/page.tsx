// frontend/app/exchange/create/page.tsx

'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import axios from '@/utils/axios';

export default function CreateExchangePage() {
    const [requesterId, setRequesterId]         = useState('');
    const [responderId, setResponderId]         = useState('');
    const [requestedItemId, setRequestedItemId] = useState('');
    const [offeredItemId, setOfferedItemId]     = useState('');
    const [result, setResult]                   = useState<string | null>(null);

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        setRequesterId(params.get('requesterId') || '');
        setResponderId(params.get('responderId') || '');
        setRequestedItemId(params.get('requestedItemId') || '');
    }, []);

    const handleSubmit = async () => {
        try {
            const res = await axios.post('/exchangerequests', {
                requesterId:   Number(requesterId),
                responderId:   Number(responderId),
                requestedItemId: Number(requestedItemId),
                offeredItemId: Number(offeredItemId),
            });
            setResult('✅ Success: ' + res.data.exchangeId);
        } catch (e) {
            console.error(e);
            setResult('❌ Error sending request');
        }
    };

    return (
        <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
            <h1>➕ Create Exchange Request</h1>

            <div>
                <label>Requester ID:</label>
                <input value={requesterId} readOnly />
            </div>
            <div>
                <label>Responder ID:</label>
                <input value={responderId} readOnly />
            </div>
            <div>
                <label>Requested Item ID:</label>
                <input value={requestedItemId} readOnly />
            </div>
            <div>
                <label>Offered Item ID:</label>
                <input
                    value={offeredItemId}
                    onChange={(e) => setOfferedItemId(e.target.value)}
                    placeholder="Enter your item ID"
                />
            </div>

            <button onClick={handleSubmit} style={{ marginTop: 20 }}>
                Submit
            </button>

            {result && <p style={{ marginTop: 10 }}>{result}</p>}
        </div>
    );
}
