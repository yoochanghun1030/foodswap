"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from '@/utils/axios';

export default function CreateExchangePage() {
    const searchParams = useSearchParams();

    const [requesterId, setRequesterId] = useState('');
    const [responderId, setResponderId] = useState('');
    const [requestedItemId, setRequestedItemId] = useState('');
    const [offeredItemId, setOfferedItemId] = useState('');
    const [result, setResult] = useState<string | null>(null);

    useEffect(() => {
        const requester = searchParams.get('requesterId');
        const responder = searchParams.get('responderId');
        const requestedItem = searchParams.get('requestedItemId');

        if (requester) setRequesterId(requester);
        if (responder) setResponderId(responder);
        if (requestedItem) setRequestedItemId(requestedItem);
    }, [searchParams]);

    const handleSubmit = async () => {
        try {
            const res = await axios.post('/exchangerequests', {
                requesterId: Number(requesterId),
                responderId: Number(responderId),
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
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
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

            <button onClick={handleSubmit} style={{ marginTop: '20px' }}>
                Submit
            </button>
            {result && <p style={{ marginTop: '10px' }}>{result}</p>}
        </div>
    );
}
