"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bookmark, FileText, MapPin, DollarSign, Calendar, Briefcase, BookmarkX, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type Bookmark = {
  id: number;
  userId: number;
  jobId: number;
  createdAt: string;
};

type Application = {
  id: number;
  userId: number;
  jobId: number;
  status: string;
  coverLetter: string | null;
  appliedAt: string;
  updatedAt: string;
};

type Job = {
  id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  jobType: string;
  experienceLevel: string;
  postedDate: string;
  applicationDeadline: string | null;
  status: string;
};

export default function TrackApplicationsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Record<number, Job>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookmarks");

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push(`/login?redirect=${encodeURIComponent("/track-applications")}`);
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      if (!token) {
        toast.error("Authentication required");
        router.push("/login");
        return;
      }

      // Fetch bookmarks
      const bookmarksRes = await fetch(`/api/bookmarks/user/${session!.user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (bookmarksRes.ok) {
        const bookmarksData = await bookmarksRes.json();
        setBookmarks(bookmarksData.bookmarks || []);

        // Fetch job details for bookmarks
        const jobIds = bookmarksData.bookmarks?.map((b: Bookmark) => b.jobId) || [];
        await fetchJobDetails(jobIds, token);
      }

      // Fetch applications
      const applicationsRes = await fetch(`/api/applications/user/${session!.user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (applicationsRes.ok) {
        const applicationsData = await applicationsRes.json();
        setApplications(applicationsData.applications || []);

        // Fetch job details for applications
        const jobIds = applicationsData.applications?.map((a: Application) => a.jobId) || [];
        await fetchJobDetails(jobIds, token);
      } else if (applicationsRes.status === 404) {
        // No applications yet - this is fine
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load your data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobDetails = async (jobIds: number[], token: string) => {
    const uniqueJobIds = [...new Set(jobIds)];
    const jobPromises = uniqueJobIds.map(async (jobId) => {
      try {
        const res = await fetch(`/api/jobs?id=${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          return data.jobs && data.jobs.length > 0 ? data.jobs[0] : null;
        }
        return null;
      } catch {
        return null;
      }
    });

    const jobsData = await Promise.all(jobPromises);
    const jobsMap: Record<number, Job> = {};
    jobsData.forEach((job) => {
      if (job) {
        jobsMap[job.id] = job;
      }
    });
    setJobs((prev) => ({ ...prev, ...jobsMap }));
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-500",
      submitted: "bg-blue-500",
      under_review: "bg-yellow-500",
      interview: "bg-purple-500",
      rejected: "bg-red-500",
      accepted: "bg-green-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Not specified";
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `$${(min / 1000).toFixed(0)}k+`;
    return `Up to $${(max! / 1000).toFixed(0)}k`;
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-violet-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-violet-50 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">Track Applications</h1>
          <p className="text-lg text-muted-foreground">
            Monitor your bookmarked opportunities and application progress
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="bookmarks" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Bookmarks ({bookmarks.length})
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="h-4 w-4" />
              Applications ({applications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks" className="mt-6">
            {bookmarks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BookmarkX className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start bookmarking jobs to keep track of opportunities you're interested in
                  </p>
                  <Button onClick={() => router.push("/")}>Browse Jobs</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {bookmarks.map((bookmark) => {
                  const job = jobs[bookmark.jobId];
                  if (!job) return null;

                  return (
                    <Card key={bookmark.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                            <CardDescription className="text-base font-medium">
                              {job.company}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {job.jobType}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            {job.experienceLevel} level
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Bookmarked {new Date(bookmark.createdAt).toLocaleDateString()}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-3">
                            {job.description}
                          </p>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" className="flex-1">
                              Apply Now
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start applying to jobs and track your progress here
                  </p>
                  <Button onClick={() => router.push("/")}>Browse Jobs</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {applications.map((application) => {
                  const job = jobs[application.jobId];
                  if (!job) return null;

                  return (
                    <Card key={application.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                            <CardDescription className="text-base font-medium">
                              {job.company}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(application.status)}>
                            {getStatusLabel(application.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </div>
                          {application.updatedAt !== application.appliedAt && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Updated {new Date(application.updatedAt).toLocaleDateString()}
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-3">
                            {job.description}
                          </p>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
