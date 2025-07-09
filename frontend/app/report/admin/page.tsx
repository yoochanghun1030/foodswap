'use client';
import { useEffect, useState } from 'react'
import axios from '@/utils/axios'
import { useRouter } from 'next/navigation'

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

export default function AdminReportPage() {
    const [reports, setReports] = useState<Report[]>([])
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (!stored) {
            router.push('/login')
            return
        }
        const user = JSON.parse(stored)
        if (user.role !== 'ADMIN') {
            alert('❌ Admin only page.')
            router.push('/')
            return
        }

        const fetchReports = async () => {
            try {
                const res = await axios.get('/reports')
                setReports(res.data)
            } catch (err) {
                setError('🚫 Failed to load report data.')
                console.error(err)
            }
        }

        fetchReports()
    }, [router])

    const handleStatusChange = async (reportId: number, newStatus: string) => {
        try {
            await axios.patch(`/reports/${reportId}/status`, { status: newStatus })
            alert('✅ Status updated.')
            setReports(prev =>
                prev.map(r =>
                    r.reportId === reportId ? { ...r, status: newStatus, resolvedAt: new Date().toISOString() } : r
                )
            )
        } catch (err) {
            console.error(err)
            alert('❌ Failed to update status.')
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>🛠 Admin Report Management</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {reports.length === 0 ? (
                <p>No reports found.</p>
            ) : (
                <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Reporter</th>
                        <th>Target User</th>
                        <th>Message</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Reported At</th>
                        <th>Resolved At</th>
                        <th>Update</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reports.map(r => (
                        <tr key={r.reportId}>
                            <td>{r.reportId}</td>
                            <td>{r.reporterId}</td>
                            <td>{r.reportedUserId ?? '-'}</td>
                            <td>{r.reportedMessageId ?? '-'}</td>
                            <td>{r.reason}</td>
                            <td>{r.status}</td>
                            <td>{new Date(r.createdAt).toLocaleString()}</td>
                            <td>{r.resolvedAt ? new Date(r.resolvedAt).toLocaleString() : '-'}</td>
                            <td>
                                <select
                                    value={r.status}
                                    onChange={e => handleStatusChange(r.reportId, e.target.value)}
                                >
                                    <option value="OPEN">OPEN</option>
                                    <option value="RESOLVED">RESOLVED</option>
                                    <option value="DISMISSED">DISMISSED</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
