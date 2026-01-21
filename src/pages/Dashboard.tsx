import { useState, useEffect } from 'react'
import { api, type Job, type Application } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, TrendingUp, Star, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { JobCard } from '@/components/JobCard'

export function Dashboard() {
    const [stats, setStats] = useState({
        totalJobs: 0,
        applications: 0,
        bestMatches: 0,
        latestApplication: null as string | null
    })
    const [recentJobs, setRecentJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        setLoading(true)
        try {
            const [jobs, applications] = await Promise.all([
                api.getJobs(),
                api.getApplications()
            ])

            setStats({
                totalJobs: jobs.length,
                applications: applications.length,
                bestMatches: jobs.filter(j => j.matchScore > 80).length,
                latestApplication: applications.length > 0
                    ? applications[applications.length - 1].timestamp
                    : null
            })

            setRecentJobs(jobs.slice(0, 4))
        } catch (error) {
            console.error('Failed to load dashboard:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your job search activity
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalJobs}</div>
                        <p className="text-xs text-muted-foreground">
                            Available positions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Applications</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.applications}</div>
                        <p className="text-xs text-muted-foreground">
                            Jobs applied to
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Best Matches</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.bestMatches}</div>
                        <p className="text-xs text-muted-foreground">
                            80%+ match score
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Applied</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.latestApplication
                                ? new Date(stats.latestApplication).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : 'N/A'
                            }
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Most recent activity
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Streamline your job search workflow</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Link to="/jobs">
                        <Button>
                            <Briefcase className="mr-2 h-4 w-4" />
                            Browse Jobs
                        </Button>
                    </Link>
                    <Link to="/matches">
                        <Button variant="outline">
                            <Star className="mr-2 h-4 w-4" />
                            View Best Matches
                        </Button>
                    </Link>
                    <Link to="/profile">
                        <Button variant="outline">
                            Update Resume
                        </Button>
                    </Link>
                    <Link to="/chat">
                        <Button variant="outline">
                            Ask AI Assistant
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Recent Jobs */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Recent Jobs</h2>
                    <Link to="/jobs">
                        <Button variant="ghost" size="sm">View All →</Button>
                    </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {recentJobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            </div>
        </div>
    )
}
