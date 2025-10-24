import type { LucideIcon } from "lucide-react";
import { Briefcase, Target, FileText, BookmarkCheck } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FeatureContent = {
  title: string;
  description: string;
  image: string;
  className?: string;
  href?: string;
};

const FEATURES: Array<{
  title: string;
  description: string;
  content: FeatureContent;
  icon: LucideIcon;
}> = [
  {
    title: "Smart Job Matching",
    description: "Find opportunities that align with your unique skills.",
    content: {
      title: "Find opportunities that align with your unique skills.",
      description: `Our intelligent matching algorithm analyzes your profile and connects you with jobs that truly fit. No more endless scrolling through irrelevant listings—just opportunities tailored to you.`,
      image:
        "https://cdn.dribbble.com/userupload/43337341/file/original-d6bf3f5b71f6a24b1767d22e0679b861.png?resize=1024x768&vertical=center",
      href: "/#",
    },
    icon: Target,
  },
  {
    title: "Interview Preparation",
    description: "Master your interviews with curated prep resources.",
    content: {
      title: "Master your interviews with curated prep resources.",
      description:
        "Access sample questions, tips, and strategies to ace your interviews. Build confidence with our comprehensive prep tools designed specifically for students and early-career professionals.",
      image:
        "https://cdn.dribbble.com/userupload/15241853/file/original-4d2dc6d60a8e5e035ce52f5de0bb9d8a.png?resize=1504x1128&vertical=center",
      href: "/interview-prep",
    },
    icon: Briefcase,
  },
  {
    title: "Resume Builder",
    description: "Create professional resumes that stand out instantly.",
    content: {
      title: "Create professional resumes that stand out instantly.",
      description:
        "Our intuitive resume builder helps you craft compelling documents that catch recruiters' attention. Export to PDF with one click and showcase your best self to potential employers.",
      image:
        "https://cdn.dribbble.com/userupload/7196738/file/original-4fa5011ad3ea2349277b8177db0813ca.png?resize=1504x1128&vertical=center",
      href: "/resume-builder",
    },
    icon: FileText,
  },
  {
    title: "Track & Bookmark",
    description: "Save opportunities and monitor your application status.",
    content: {
      title: "Save opportunities and monitor your application status.",
      description:
        "Never lose track of promising opportunities. Bookmark jobs, track applications, and get notified when matches appear. Stay organized throughout your entire job search journey.",
      image:
        "https://cdn.dribbble.com/userupload/12801568/file/original-e94d85545be230b44e826fab741705ba.jpg?resize=1504x1128&vertical=center",
      href: "/track-applications",
    },
    icon: BookmarkCheck,
  },
];

const FeatureThree = () => {
  return (
    <section className="py-32 dark:bg-[#2F332E]">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex gap-3 max-md:flex-col">
          <h2 className="flex-1 text-3xl leading-tight font-semibold tracking-tight text-balance text-primary md:text-4xl lg:text-5xl">
            Your complete job search platform, powered by JobQuest
          </h2>
          <p className="flex-1 self-end text-lg font-medium text-muted-foreground/80">
            Match with opportunities, prep for interviews, build resumes—all in one place.
          </p>
        </div>

        <Tabs
          defaultValue={FEATURES[0].title}
          orientation="vertical"
          className=" mt-8 grid -ml-2 grid-cols-1 bg-violet-200 gap-4 rounded-xl   p-4 md:mt-12 lg:mt-20 lg:grid-cols-4"
        >
          <TabsList className="flex h-auto flex-col justify-start rounded-xl bg-white p-1.5">
            {FEATURES.map((feature) => (
              <TabsTrigger
                key={feature.title}
                value={feature.title}
                className="w-full justify-start rounded-lg px-4 py-3 text-start whitespace-normal  cursor-pointer hover:bg-violet-100 text-gray-700 transition-colors duration-300 data-[state=active]:bg-violet-200 data-[state=active]:text-black data-[state=active]:shadow-xl lg:px-6 lg:py-4 dark:text-gray-300 dark:data-[state=active]:text-white"
              >
                <div>
                  <feature.icon className="size-7 md:size-8 lg:size-9" />
                  <h3 className="mt-3  font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {FEATURES.map((feature) => (
            <TabsContent
              className={cn(
                "col-span-1 p-6 m-0 overflow-hidden rounded-xl bg-background lg:col-span-3",
                feature.content.className
              )}
              key={feature.title}
              value={feature.title}
            >
              <div className="max-w-2xl pb-4 text-balance">
                <h4 className="inline text-primary  font-bold">
                  {feature.content.title}{" "}
                </h4>
                <span className="mt-2 font-medium text-pretty text-muted-foreground/70">
                  {feature.content.description}
                </span>
              </div>
              {feature.content.href && (
                <Button asChild className="mb-4">
                  <Link href={feature.content.href}>
                    {feature.content.href === "/#" ? "Coming Soon" : "Explore Feature"}
                  </Link>
                </Button>
              )}
              <img
                src={feature.content.image}
                alt={feature.title}
                className="h-[420px] w-full  rounded-lg object-cover lg:h-[512px] lg:flex-1"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export { FeatureThree };