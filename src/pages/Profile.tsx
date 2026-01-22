import { useState } from 'react'
import { api, type Job } from '@/lib/api'
import { getUserId } from '@/lib/user'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { JobCard } from '@/components/JobCard'
import { Upload, FileText, Sparkles, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function Profile() {
    const [resumeUploaded, setResumeUploaded] = useState(false)
    const [scoredJobs, setScoredJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(false)
    const [scoring, setScoring] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLoading(true)
        setError(null)
        try {
            await api.uploadResume(file)
            setResumeUploaded(true)
        } catch (error: any) {
            console.error('Upload failed:', error)
            setError('Failed to upload resume. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleScoreJobs = async () => {
        if (!resumeUploaded) {
            setError("Please upload a resume first!");
            return;
        }

        setScoring(true);
        setError(null);

        try {
            const jobs = await api.getJobs();

            if (!jobs || jobs.length === 0) {
                setError("Please browse jobs first before scoring.");
                setScoring(false);
                return;
            }

            const data = await api.scoreJobs({
                userId: getUserId(),
                jobs,
            });

            if (data.success && data.data) {
                setScoredJobs(data.data);
            } else {
                setError(data.message || "Failed to score jobs.");
            }

        } catch (error: any) {
            console.error("Scoring failed:", error);
            setError("Failed to score jobs. Please try again.");
        } finally {
            setScoring(false);
        }
    };


    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-3xl font-bold tracking-tight mb-2 font-serif">Profile & Resume</h1>
            <p className="text-muted-foreground mb-8">
                Upload your resume to get AI-powered job matching scores
            </p>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Resume Upload
                        </CardTitle>
                        <CardDescription>
                            Upload your resume (PDF or TXT) to enable AI matching
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {resumeUploaded ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-green-600" />
                                </div>
                                <p className="text-sm font-medium text-green-600 mb-2">Resume Uploaded!</p>
                                <p className="text-xs text-muted-foreground mb-4">
                                    You can now score jobs against your profile
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById('resume-input')?.click()}
                                >
                                    Replace Resume
                                </Button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mb-4">
                                    Click to upload your resume
                                </p>
                                <Button
                                    onClick={() => document.getElementById('resume-input')?.click()}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Select File
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                        <Input
                            id="resume-input"
                            type="file"
                            accept=".pdf,.txt"
                            className="hidden"
                            onChange={handleUpload}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            AI Job Scoring
                        </CardTitle>
                        <CardDescription>
                            Score available jobs against your resume with AI
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8">
                            <p className="text-sm text-muted-foreground mb-6">
                                {resumeUploaded
                                    ? 'Ready to analyze jobs! Click below to get personalized match scores.'
                                    : 'Upload your resume first to unlock AI-powered job matching.'}
                            </p>
                            <Button
                                onClick={handleScoreJobs}
                                disabled={!resumeUploaded || scoring}
                                size="lg"
                            >
                                {scoring ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Score Jobs
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {scoredJobs.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        AI-Scored Jobs ({scoredJobs.length})
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        These jobs have been analyzed against your resume with AI-powered matching
                    </p>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {scoredJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
