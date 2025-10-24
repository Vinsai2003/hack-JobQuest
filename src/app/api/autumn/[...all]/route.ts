import { autumnHandler } from "autumn-js/next";
import type { AutumnConfig } from "autumn-js";
import { headers } from "next/headers";

// This is the server-side auth instance from better-auth
// It is likely in '@/lib/auth.ts'. If this import fails, find the file 
// where you define `betterAuth({...})` and update the path.
import { auth } from "@/lib/auth"; 

// This is your product configuration
const autumnConfig: AutumnConfig = {
  products: [
    {
      id: "free",
      name: "Free",
      description: "Get started with basic job search features",
      default: true,
      features: [],
    },
    {
      id: "pro_monthly",
      name: "Pro",
      description: "Advanced tools for serious job seekers",
      price: 900,
      interval: "month",
      features: [
        {
          id: "resume_builder",
          name: "Resume Builder",
          description: "Create professional resumes with templates",
        },
        {
          id: "interview_prep",
          name: "Interview Prep",
          description: "Access curated interview questions and tips",
        },
      ],
    },
    {
      id: "pro_yearly",
      name: "Pro",
      description: "Advanced tools for serious job seekers (Yearly)",
      price: 9900,
      interval: "year",
      features: [
        {
          id: "resume_builder",
          name: "Resume Builder",
          description: "Create professional resumes with templates",
        },
        {
          id: "interview_prep",
          name: "Interview Prep",
          description: "Access curated interview questions and tips",
        },
      ],
    },
    {
      id: "elite_monthly",
      name: "Elite",
      description: "Complete career acceleration suite",
      price: 2500,
      interval: "month",
      features: [
        {
          id: "resume_builder",
          name: "Resume Builder",
          description: "Create professional resumes with templates",
        },
        {
          id: "interview_prep",
          name: "Interview Prep",
          description: "Access curated interview questions and tips",
        },
        {
          id: "priority_alerts",
          name: "Priority Job Alerts",
          description: "Get notified first about new opportunities",
        },
        {
          id: "profile_analytics",
          name: "Advanced Profile Analytics",
          description: "Track your profile performance and visibility",
        },
        {
          id: "unlimited_bookmarks",
          name: "Unlimited Bookmarking",
          description: "Save unlimited job opportunities",
        },
      ],
    },
    {
      id: "elite_yearly",
      name: "Elite",
      description: "Complete career acceleration suite (Yearly)",
      price: 24900,
      interval: "year",
      features: [
        {
          id: "resume_builder",
          name: "Resume Builder",
          description: "Create professional resumes with templates",
        },
        {
          id: "interview_prep",
          name: "Interview Prep",
          description: "Access curated interview questions and tips",
        },
        {
          id: "priority_alerts",
          name: "Priority Job Alerts",
          description: "Get notified first about new opportunities",
        },
        {
          id: "profile_analytics",
          name: "Advanced Profile Analytics",
          description: "Track your profile performance and visibility",
        },
        {
          id: "unlimited_bookmarks",
          name: "Unlimited Bookmarking",
          description: "Save unlimited job opportunities",
        },
      ],
    },
  ],
};

// This is the new, correct way to export the handlers.
// We pass the product config AND the identify function to autumnHandler.
export const { GET, POST } = autumnHandler({
  ...autumnConfig, // This passes all your products
  identify: async () => {
    // Get the user session using better-auth's server-side method
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });

    if (!session) {
      return null; // No user is signed in
    }

    // Return the customer details for Autumn
    return {
      customerId: session.user.id,
      customerData: {
        name: session.user.name,
        email: session.user.email,
      },
    };
  },
});