import { useState, useEffect } from 'react'
import { api, type Job } from '@/lib/api'
import { JobCard } from '@/components/JobCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles } from 'lucide-react'

export function BestMatches() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadMatches()
    }, [])

    const loadMatches = async () => {
        setLoading(true)
        try {
            const data = await api.getJobs()
            // Filter >80% match score
            setJobs(data.filter(j => j.matchScore > 80))
        } catch (error) {
            console.error('Failed to load matches:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <Skeleton className="h-10 w-64 mb-8" />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Best Matches</h1>
            <p className="text-muted-foreground mb-8">
                {jobs.length} top jobs curated for your profile based on skill overlap
            </p>

            {jobs.length === 0 ? (
                <div className="text-center py-16 border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No high matches yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Upload your resume in the Profile page to get AI-powered match scores above 80%
                    </p>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <div key={job.id} className="relative group">
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-70 group-hover:opacity-100 blur-sm transition duration-500"></div>
                            <div className="relative h-full bg-card rounded-xl">
                                <JobCard job={job} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
