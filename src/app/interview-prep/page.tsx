"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useCustomer } from "autumn-js/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, Briefcase, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { CheckoutDialog } from "@/components/autumn/checkout-dialog";

const INTERVIEW_QUESTIONS = [
  {
    category: "Behavioral",
    questions: [
      {
        question: "Tell me about yourself",
        tips: "Focus on your professional journey, key achievements, and why you're interested in this role.",
      },
      {
        question: "What are your greatest strengths?",
        tips: "Choose strengths relevant to the job and provide specific examples.",
      },
      {
        question: "Describe a challenge you've overcome",
        tips: "Use the STAR method: Situation, Task, Action, Result.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        question: "Explain your problem-solving process",
        tips: "Walk through how you approach complex problems systematically.",
      },
      {
        question: "What projects are you most proud of?",
        tips: "Discuss the impact, technologies used, and lessons learned.",
      },
    ],
  },
  {
    category: "Culture Fit",
    questions: [
      {
        question: "Why do you want to work here?",
        tips: "Research the company and align your answer with their values and mission.",
      },
      {
        question: "Where do you see yourself in 5 years?",
        tips: "Show ambition while being realistic about career progression.",
      },
    ],
  },
];

export default function InterviewPrepPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const { customer, isLoading, checkout } = useCustomer();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.push(`/login?redirect=${encodeURIComponent("/interview-prep")}`);
    }
  }, [session, sessionLoading, router]);

  useEffect(() => {
    if (!isLoading && customer) {
      const hasInterviewAccess = customer.products.some(
        (p) => p.id.includes("pro") || p.id.includes("elite")
      );
      setHasAccess(hasInterviewAccess);
    }
  }, [customer, isLoading]);

  const handleUpgrade = async () => {
    if (!session) {
      router.push(`/login?redirect=${encodeURIComponent("/interview-prep")}`);
      return;
    }

    try {
      await checkout({
        productId: "pro_monthly",
        dialog: CheckoutDialog,
        openInNewTab: true,
        successUrl: `${window.location.origin}/interview-prep`,
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
            <CardTitle className="text-3xl">Interview Prep - Pro Feature</CardTitle>
            <CardDescription className="text-lg">
              Upgrade to Pro or Elite to access curated interview questions and expert tips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-violet-50 p-6">
              <h3 className="mb-4 font-semibold text-lg">What you'll get:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
                  <span>200+ curated interview questions across multiple categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
                  <span>Expert tips and example answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
                  <span>Behavioral, technical, and culture fit questions</span>
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
        <h1 className="text-4xl font-bold text-primary mb-2">Interview Preparation</h1>
        <p className="text-muted-foreground">Master your interviews with curated questions and expert tips</p>
      </div>

      <div className="space-y-6">
        {INTERVIEW_QUESTIONS.map((category, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-violet-600" />
                <CardTitle>{category.category} Questions</CardTitle>
                <Badge variant="secondary">{category.questions.length} questions</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, qIdx) => (
                  <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="rounded-lg bg-violet-50 p-4">
                        <p className="font-semibold mb-2 text-violet-900">Expert Tip:</p>
                        <p className="text-muted-foreground">{item.tips}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-violet-200 bg-violet-50">
        <CardHeader>
          <CardTitle>Pro Tips for Success</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
              <span>Practice your answers out loud before the interview</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
              <span>Research the company thoroughly and prepare questions to ask</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
              <span>Use the STAR method for behavioral questions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
              <span>Prepare examples of your achievements with quantifiable results</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}