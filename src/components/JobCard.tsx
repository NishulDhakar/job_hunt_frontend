import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
    MapPin, Building2, Clock,
    ExternalLink, Bookmark, Share2, DollarSign, Briefcase
} from "lucide-react"
import { useState, useEffect } from "react"
import { type Job, api } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface JobCardProps {
    job: Job
    onBookmarkChange?: () => void
}

export function JobCard({ job, onBookmarkChange }: JobCardProps) {
    const [expanded, setExpanded] = useState(false)
    const [applied, setApplied] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const [openApply, setOpenApply] = useState(false)

    // Check if job is already bookmarked on mount
    useEffect(() => {
        const checkBookmarkStatus = () => {
            try {
                const stored = localStorage.getItem('bookmarkedJobs')
                if (stored) {
                    const bookmarkedJobs = JSON.parse(stored)
                    const isBookmarked = bookmarkedJobs.some((j: Job) => j.id === job.id)
                    setBookmarked(isBookmarked)
                }
            } catch (error) {
                console.error('Failed to check bookmark status:', error)
            }
        }
        checkBookmarkStatus()
    }, [job.id])

    const toggleBookmark = () => {
        try {
            const stored = localStorage.getItem('bookmarkedJobs')
            let bookmarkedJobs: Job[] = stored ? JSON.parse(stored) : []

            if (bookmarked) {
                // Remove from bookmarks
                bookmarkedJobs = bookmarkedJobs.filter(j => j.id !== job.id)
                setBookmarked(false)
            } else {
                // Add to bookmarks
                bookmarkedJobs.push(job)
                setBookmarked(true)
            }

            localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarkedJobs))

            // Notify parent component of bookmark change
            if (onBookmarkChange) {
                onBookmarkChange()
            }
        } catch (error) {
            console.error('Failed to toggle bookmark:', error)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 90) return "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
        if (score >= 80) return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400"
        if (score >= 70) return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400"
        if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400"
        return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-400"
    }

    const handleApply = async () => {
        await api.applyJob(job, 'Applied')
        setApplied(true)
        setOpenApply(false)
    }

    const handleExternalApply = () => {
        if (job.url && job.url !== '#') {
            window.open(job.url, '_blank', 'noopener,noreferrer')
            setOpenApply(true)
        }
    }

    const handleShare = async () => {
        if (navigator.share && job.url) {
            try {
                await navigator.share({
                    title: `${job.title} at ${job.company}`,
                    text: `Check out this opportunity: ${job.title}`,
                    url: job.url
                })
            } catch (err) {
                // Share cancelled or failed
            }
        }
    }

const formatDate = (dateString: string) => {
  if (!dateString) return "Recently Posted"

  const parsedDate = new Date(dateString)

  // If date is invalid, fallback
  if (isNaN(parsedDate.getTime())) return dateString

  const now = new Date()
  const diffMs = now.getTime() - parsedDate.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`

  // Older than a week → show formatted date
  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}


    return (
        <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-primary/30 relative overflow-hidden bg-card">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <CardHeader className="pb-4 relative space-y-3">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {job.title}
                        </h3>
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2 font-semibold text-foreground">
                                <Building2 className="w-4 h-4 text-primary shrink-0" />
                                <span>{job.company}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{formatDate(job.datePosted)}</span>
                                </div>
                                {job.salary && job.salary !== 'Not disclosed' && (
                                    <div className="flex items-center gap-1 text-green-700 dark:text-green-400 font-semibold">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        <span>{job.salary}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10"
                            onClick={toggleBookmark}
                        >
                            <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative space-y-4 pb-4">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {job.description}
                </p>

                {/* Job type badge */}
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                        <Briefcase className="w-3 h-3" />
                        {job.type}
                    </Badge>
                </div>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {job.skills.slice(0, 6).map(skill => (
                            <Badge
                                key={skill}
                                variant="outline"
                                className="font-normal text-xs px-2.5 py-0.5 bg-primary/5 hover:bg-primary/10 transition-colors border-primary/20"
                            >
                                {skill}
                            </Badge>
                        ))}
                        {job.skills.length > 6 && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                                +{job.skills.length - 6} more
                            </Badge>
                        )}
                    </div>
                )}

                {/* Expanded match reasons */}
                {expanded && job.matchReason && job.matchReason.length > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 animate-in slide-in-from-top-2">
                        <p className="font-semibold mb-3 flex items-center gap-2 text-sm">
                            <span className="w-1 h-5 bg-primary rounded-full" />
                            Match Analysis
                        </p>
                        <ul className="space-y-2 ml-3">
                            {job.matchReason.map((r, i) => (
                                <li key={i} className="flex gap-2 text-sm">
                                    <span className="text-primary font-bold mt-0.5">✓</span>
                                    <span className="text-foreground/80">{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 border-t pt-4 relative bg-muted/20">
                {/* Action buttons */}
                <div className="flex items-center justify-between w-full gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(!expanded)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                    </Button>

                    <div className="flex gap-2">
                        {job.url && job.url !== '#' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleShare}
                                className="gap-1.5"
                            >
                                <Share2 className="h-3.5 w-3.5" />
                            </Button>
                        )}
                        <Button
                            onClick={job.url && job.url !== '#' ? handleExternalApply : () => setOpenApply(true)}
                            size="sm"
                            className="gap-2 font-semibold px-4"
                            disabled={applied}
                        >
                            {applied ? (
                                "Applied ✓"
                            ) : (
                                <>
                                    Apply Now
                                    {job.url && job.url !== '#' && <ExternalLink className="h-3.5 w-3.5" />}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardFooter>

            {/* Track application dialog */}
            <Dialog open={openApply} onOpenChange={setOpenApply}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Track This Application</DialogTitle>
                        <DialogDescription className="text-base pt-2">
                            Would you like to track your application for{' '}
                            <span className="font-semibold text-foreground">{job.title}</span> at{' '}
                            <span className="font-semibold text-foreground">{job.company}</span>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpenApply(false)}
                            className="w-full sm:w-auto"
                        >
                            Not Yet
                        </Button>
                        <Button
                            onClick={handleApply}
                            className="w-full sm:w-auto"
                        >
                            Yes, Track It
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
