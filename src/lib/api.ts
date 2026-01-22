import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    datePosted: string;
    matchScore: number;
    skills: string[];
    matchReason: string[];
    url?: string;
    salary?: string;
}

export interface Application {
    id: string;
    jobId: string;
    title: string;
    company: string;
    status: "Applied" | "Interview" | "Offer" | "Rejected";
    timestamp: string;
}

const inferSkills = (title: string, description: string): string[] => {
    const skills = new Set<string>();
    const text = (title + " " + description).toLowerCase();

    if (text.includes("react")) skills.add("React");
    if (text.includes("node")) skills.add("Node.js");
    if (text.includes("typescript") || text.includes("ts")) skills.add("TypeScript");
    if (text.includes("python")) skills.add("Python");
    if (text.includes("java ")) skills.add("Java");
    if (text.includes("aws")) skills.add("AWS");
    if (text.includes("design") || text.includes("figma")) skills.add("Figma");
    if (text.includes("manager") || text.includes("lead")) skills.add("Leadership");

    if (skills.size === 0) return ["Communication", "Problem Solving", "Teamwork"];
    return Array.from(skills).slice(0, 4);
};

export const api = {
    getJobs: async (page: number = 1, limit: number = 20): Promise<Job[]> => {
        try {

            const res = await apiClient.get("/api/jobs", {
                params: { page, limit }
            });

            const rawJobs = res.data?.data ?? res.data ?? [];
            return rawJobs.map((job: any) => ({
                id: job.id || job._id,
                title: job.title,
                company: job.company,
                location: job.location,
                type: job.jobType || "Full-time",
                description: job.description,
                datePosted: job.postedAt || job.datePosted || "Recently",
                matchScore: job.matchScore || Math.floor(Math.random() * 30) + 70,
                skills:
                    job.skills && job.skills.length > 0
                        ? job.skills
                        : inferSkills(job.title, job.description),
                matchReason:
                    job.matchReason || [
                        "Matches your core skillset",
                        "Preferred location",
                        "Competitive compensation",
                    ],
                url: job.url,
                salary: job.salary,
            }));
        } catch (error) {
            console.error("Failed to fetch jobs", error);
            return [];
        }
    },

    getApplications: async (): Promise<Application[]> => {
        try {
            const res = await apiClient.get("/api/applications?userId=guest");
            const rawApps = res.data?.data ?? res.data ?? [];

            return rawApps.map((app: any) => ({
                id: app.jobId,
                jobId: app.jobId,
                title: app.title,
                company: app.company,
                status: app.status,
                timestamp: app.timestamp,
            }));
        } catch (error) {
            console.error("Failed to fetch applications", error);
            return [];
        }
    },

    uploadResume: async (file: File) => {
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("userId", "guest");

        const res = await apiClient.post("/api/upload-resume", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return res.data;
    },

    applyJob: async (job: Job, status: string = "Applied") => {
        const res = await apiClient.post("/api/apply-job", {
            userId: "guest",
            jobId: job.id,
            status,
            userChoice: "Yes",
            title: job.title,
            company: job.company,
        });

        return res.data;
    },

    chatWithAI: async (message: string) => {
        try {
            const res = await apiClient.post("/api/chat", {
                message,
                userId: "guest",
            });
            return res.data.data;
        } catch {
            return {
                jobs: [],
                explanation: "Sorry, I couldn't reach the AI service right now.",
            };
        }
    },

    scoreJobs: async (payload: { userId: string; jobs?: Job[] }) => {
        try {
            const res = await apiClient.post("/api/score-jobs", payload);
            return res.data;
        } catch (error) {
            console.error("Failed to score jobs", error);
            return { success: false, message: "Failed to score jobs" };
        }
    },
};
