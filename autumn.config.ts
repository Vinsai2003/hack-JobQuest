import { AutumnConfig } from "autumn-js";

export default {
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
      price: 900, // $9.00 in cents
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
      price: 9900, // $99.00 in cents
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
      price: 2500, // $25.00 in cents
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
      price: 24900, // $249.00 in cents
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
} satisfies AutumnConfig;
