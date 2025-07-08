'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/utils/axios'

export default function CreateReportPage() {
    const [reportedUserId, setReportedUserId] = useState<number | null>(null)
    const [reportedMessageId, setReportedMessageId] = useState<number | null>(null)
    const [reason, setReason] = useState('')
    const router = useRouter()

    const handleSubmit = async () => {
        const user = localStorage.getItem('user')
        if (!user) return alert('❌ Login required')

        const { id: reporterId } = JSON.parse(user)

        try {
            await axios.post('/reports', {
                reporterId,
                reportedUserId,
                reportedMessageId,
                reason
            })

            alert('✅ Your report has been received.')
            router.push('/')
        } catch (err) {
            console.error(err)
            alert('❌ Report failed.')
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>🚨 Report User/Message</h1>

            <label>
                User to be reported ID (select):
                <input
                    type="number"
                    value={reportedUserId ?? ''}
                    onChange={e => setReportedUserId(Number(e.target.value))}
                    placeholder="example: 3"
                />
            </label>
            <br />

            <label>
                Message to report ID (select):
                <input
                    type="number"
                    value={reportedMessageId ?? ''}
                    onChange={e => setReportedMessageId(Number(e.target.value))}
                    placeholder="example: 6"
                />
            </label>
            <br />

            <label>
                Reason for reporting:
                <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Please enter your report details"
                    required
                />
            </label>
            <br />

            <button onClick={handleSubmit}>📨 Submit a report</button>
        </div>
    )
}
