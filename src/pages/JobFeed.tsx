import { useState, useEffect } from 'react'
import { api, type Job } from '@/lib/api'
import { JobCard } from '@/components/JobCard'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function JobFeed() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [dateFilter, setDateFilter] = useState('all')

    useEffect(() => {
        loadJobs()
    }, [])

    useEffect(() => {
        filterJobs()
    }, [searchTerm, typeFilter, dateFilter, jobs])

    const loadJobs = async (forceRefresh = false) => {
        if (forceRefresh) {
            setRefreshing(true)
        } else {
            setLoading(true)
        }

        try {
            const data = await api.getJobs()
            // Sort by Date (Newest First)
            const sortedData = data.sort((a, b) => {
                let timeA = new Date(a.datePosted).getTime()
                let timeB = new Date(b.datePosted).getTime()

                // Treat invalid dates (e.g. 'Recently') as NOW so they show up first
                if (isNaN(timeA)) timeA = Date.now()
                if (isNaN(timeB)) timeB = Date.now()

                return timeB - timeA // Descending (Newest first)
            })

            setJobs(sortedData)
            setFilteredJobs(sortedData)
        } catch (error) {
            console.error('Failed to load jobs:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const filterJobs = () => {
        let filtered = [...jobs]

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(job => job.type.toLowerCase().includes(typeFilter.toLowerCase()))
        }

        setFilteredJobs(filtered)
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-5xl">
                <div className="mb-8 space-y-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-12 w-full" />
                </div>
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Job Feed</h1>
                        <p className="text-muted-foreground mt-1">
                            {filteredJobs.length} opportunities {jobs.length > filteredJobs.length && `(filtered from ${jobs.length})`}
                        </p>
                    </div>
                    <Button
                        onClick={() => loadJobs(true)}
                        variant="outline"
                        size="sm"
                        disabled={refreshing}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search job title, skills, or company..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full md:w-[160px]">
                            <SelectValue placeholder="Job Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="shrink-0">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                    <p className="text-muted-foreground mb-6">
                        Try adjusting your search or filters
                    </p>
                    <Button onClick={() => {
                        setSearchTerm('')
                        setTypeFilter('all')
                        setDateFilter('all')
                    }}>
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {filteredJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            )}
        </div>
    )
}
