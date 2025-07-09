"use client";

import { useEffect, useState } from 'react'
import axios from '@/utils/axios'

type Report = {
    reportId: number
    reporterId: number
    reportedUserId?: number
    reportedMessageId?: number
    reason: string
    status: string
    createdAt: string
    resolvedAt?: string
}

export default function ReportListPage() {
    const [reports, setReports] = useState<Report[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axios.get('/reports')
                setReports(res.data)
            } catch (err: any) {
                setError('🚫 Failed to load report data.')
                console.error(err)
            }
        }

        fetchReports()
    }, [])

    return (
        <div style={{ padding: 20 }}>
            <h1>📋 List of reports</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {reports.length === 0 ? (
                <p>There is no report.</p>
            ) : (
                <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>reporter</th>
                        <th>Target audience</th>
                        <th>Target message</th>
                        <th>Reason</th>
                        <th>state</th>
                        <th>Report time</th>
                        <th>Processing completion time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reports.map((r) => (
                        <tr key={r.reportId}>
                            <td>{r.reportId}</td>
                            <td>{r.reporterId}</td>
                            <td>{r.reportedUserId ?? '-'}</td>
                            <td>{r.reportedMessageId ?? '-'}</td>
                            <td>{r.reason}</td>
                            <td>{r.status}</td>
                            <td>{new Date(r.createdAt).toLocaleString()}</td>
                            <td>{r.resolvedAt ? new Date(r.resolvedAt).toLocaleString() : '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
