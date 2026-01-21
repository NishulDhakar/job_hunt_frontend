import { useState, useEffect } from 'react'
import { api, type Application } from '@/lib/api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Briefcase, Calendar } from 'lucide-react'

export function Applications() {
    const [apps, setApps] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadApplications()
    }, [])

    const loadApplications = async () => {
        setLoading(true)
        try {
            const data = await api.getApplications()
            setApps(data)
        } catch (error) {
            console.error('Failed to load applications:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Applied': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">Applied</Badge>
            case 'Interview': return <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">Interview</Badge>
            case 'Offer': return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Offer</Badge>
            case 'Rejected': return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Rejected</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-5xl">
                <Skeleton className="h-10 w-64 mb-8" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Applications</h1>
            <p className="text-muted-foreground mb-8">
                Track and manage your {apps.length} job applications
            </p>

            {apps.length === 0 ? (
                <div className="text-center py-16 border rounded-lg bg-muted/20">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                    <p className="text-muted-foreground">
                        Start applying to jobs to track them here
                    </p>
                </div>
            ) : (
                <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Date Applied</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {apps.map(app => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.title}</TableCell>
                                    <TableCell>{app.company}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(app.timestamp).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
