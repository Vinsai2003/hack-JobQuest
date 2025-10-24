"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useCustomer } from "autumn-js/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lock, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { CheckoutDialog } from "@/components/autumn/checkout-dialog";

export default function ResumeBuilderPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const { customer, isLoading, checkout } = useCustomer();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.push(`/login?redirect=${encodeURIComponent("/resume-builder")}`);
    }
  }, [session, sessionLoading, router]);

  useEffect(() => {
    if (!isLoading && customer) {
      const hasResumeAccess = customer.products.some(
        (p) => p.id.includes("pro") || p.id.includes("elite")
      );
      setHasAccess(hasResumeAccess);
    }
  }, [customer, isLoading]);

  const handleUpgrade = async () => {
    if (!session) {
      router.push(`/login?redirect=${encodeURIComponent("/resume-builder")}`);
      return;
    }

    try {
      await checkout({
        productId: "pro_monthly",
        dialog: CheckoutDialog,
        openInNewTab: true,
        successUrl: `${window.location.origin}/resume-builder`,
      });
    } catch (error) {
      toast.error("Failed to start checkout");
    }
  };

  if (sessionLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <Card className="border-2 border-violet-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
              <Lock className="h-8 w-8 text-violet-600" />
            </div>
            <CardTitle className="text-3xl">Resume Builder - Pro Feature</CardTitle>
            <CardDescription className="text-lg">
              Upgrade to Pro or Elite to access professional resume templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-violet-50 p-6">
              <h3 className="mb-4 font-semibold text-lg">What you'll get:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
                  <span>Professional resume templates designed for job seekers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Download className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
                  <span>Export to PDF with one click</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
                  <span>Customizable sections and formatting</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleUpgrade} size="lg" className="flex-1">
                Upgrade to Pro - $9/month
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push("/")} className="flex-1">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Resume Builder</h1>
        <p className="text-muted-foreground">Create a professional resume that stands out</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="City, State" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write a brief summary highlighting your key skills and experience..."
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" placeholder="Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Tech Corp" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Describe your responsibilities and achievements..."
                className="min-h-[120px]"
              />
            </div>
            <Button variant="outline" className="w-full">
              Add Another Position
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input id="degree" placeholder="Bachelor of Science" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <Input id="school" placeholder="University Name" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex gap-4">
        <Button size="lg" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" size="lg">
          Save Draft
        </Button>
      </div>
    </div>
  );
}