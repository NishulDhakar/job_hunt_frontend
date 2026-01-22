import { useState, useEffect } from 'react'
import { type Job } from '@/lib/api'
import { getUserId } from '@/lib/user'
import { JobCard } from '@/components/JobCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Upload, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function BestMatches() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [hasResume, setHasResume] = useState(false)
  const [hasScored, setHasScored] = useState(false)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/scored-jobs/${getUserId()}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setHasResume(data.data.hasResume)
        setHasScored(data.data.hasScored)

        if (data.data.jobs && data.data.jobs.length > 0) {
          const bestMatches = data.data.jobs.filter(
            (j: Job) => j.matchScore >= 80
          )
          setJobs(bestMatches)
        } else {
          setJobs([])
        }
      } else {
        setHasResume(false)
        setHasScored(false)
      }
    } catch (error) {
      console.error('Failed to load matches:', error)
      setHasResume(false)
      setHasScored(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!hasResume) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-2xl font-semibold mb-1 font-serif">Best Matches</h1>
        <p className="text-sm text-muted-foreground mb-8">
          AI-powered job recommendations based on your resume
        </p>

        <div className="border rounded-lg p-10 bg-background text-center">
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />

          <h3 className="text-lg font-medium mb-2">
            Upload your resume to get started
          </h3>

          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            We analyze your resume to match you with the most relevant job
            opportunities. Upload your resume to unlock personalized
            recommendations.
          </p>

          <Link to="/profile">
            <Button className="gap-2">
              Upload Resume
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!hasScored) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-2xl font-semibold mb-1">Best Matches</h1>
        <p className="text-sm text-muted-foreground mb-8">
          AI-powered job recommendations based on your resume
        </p>

        <div className="border rounded-lg p-10 bg-background text-center">
          <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-4" />

          <h3 className="text-lg font-medium mb-2">
            Ready to score jobs
          </h3>

          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Your resume is uploaded. Run the scoring process to calculate how
            well each job matches your profile.
          </p>

          <Link to="/profile">
            <Button className="gap-2">
              Score Jobs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-semibold">Best Matches</h1>
          <p className="text-sm text-muted-foreground">
            {jobs.length} jobs with 80%+ match score
          </p>
        </div>

        <Link to="/profile">
          <Button variant="outline" size="sm">
            Re-score Jobs
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="border rounded-lg p-10 text-center bg-background mt-6">
          <h3 className="text-lg font-medium mb-2">
            No high matches found
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            None of the scored jobs currently meet the 80% match threshold.
            You can browse more jobs or improve your resume to increase
            match accuracy.
          </p>

          <div className="flex justify-center gap-3">
            <Link to="/jobs">
              <Button variant="outline">Browse Jobs</Button>
            </Link>
            <Link to="/profile">
              <Button>Update Resume</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <div
              key={job.id}
              className="border rounded-lg hover:shadow-md transition"
            >
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
