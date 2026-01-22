import { useState, useEffect } from 'react'
import { type Job } from '@/lib/api'
import { JobCard } from '@/components/JobCard'
import { Input } from '@/components/ui/input'
import { Search, Bookmark, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function Bookmarked() {
    const [bookmarkedJobs, setBookmarkedJobs] = useState<Job[]>([])
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadBookmarkedJobs()
    }, [])

    useEffect(() => {
        filterJobs()
    }, [searchTerm, bookmarkedJobs])

    const loadBookmarkedJobs = () => {
        try {
            const stored = localStorage.getItem('bookmarkedJobs')
            if (stored) {
                const jobs = JSON.parse(stored)
                setBookmarkedJobs(jobs)
                setFilteredJobs(jobs)
            }
        } catch (error) {
            console.error('Failed to load bookmarked jobs:', error)
        }
    }

    const filterJobs = () => {
        let filtered = [...bookmarkedJobs]

        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        setFilteredJobs(filtered)
    }

    const clearAllBookmarks = () => {
        if (window.confirm('Are you sure you want to remove all bookmarked jobs?')) {
            localStorage.removeItem('bookmarkedJobs')
            setBookmarkedJobs([])
            setFilteredJobs([])
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Bookmark className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Saved Jobs</h1>
                        </div>
                        <p className="text-muted-foreground">
                            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} bookmarked
                            {bookmarkedJobs.length > filteredJobs.length && ` (filtered from ${bookmarkedJobs.length})`}
                        </p>
                    </div>
                    {bookmarkedJobs.length > 0 && (
                        <Button
                            onClick={clearAllBookmarks}
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear All
                        </Button>
                    )}
                </div>

                {bookmarkedJobs.length > 0 && (
                    <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search saved jobs by title, company, or skills..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Badge variant="secondary" className="shrink-0 px-4 py-2">
                            {filteredJobs.length} Results
                        </Badge>
                    </div>
                )}
            </div>

            {bookmarkedJobs.length === 0 ? (
                <div className="text-center py-20">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-xl" />
                        <div className="relative w-24 h-24 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                            <Bookmark className="w-10 h-10 text-primary/60" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">No Saved Jobs Yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Start building your collection! Click the bookmark icon on any job card to save it here for later.
                    </p>
                    {/* <Alert className="max-w-md mx-auto bg-primary/5 border-primary/20">
                        <Bookmark className="h-4 w-4 text-primary" />
                        <AlertDescription>
                            <strong>Tip:</strong> Saved jobs are stored locally in your browser and will persist between sessions.
                        </AlertDescription>
                    </Alert> */}
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                    <p className="text-muted-foreground mb-6">
                        Try adjusting your search term
                    </p>
                    <Button onClick={() => setSearchTerm('')} variant="outline">
                        Clear Search
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {filteredJobs.map(job => (
                        <JobCard key={job.id} job={job} onBookmarkChange={loadBookmarkedJobs} />
                    ))}
                </div>
            )}
        </div>
    )
}
