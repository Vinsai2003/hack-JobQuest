"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Feature {
  title: string;
  description: string;
  image: string;
  href?: string;
}

interface Feature166Props {
  heading?: string;
  description?: string;
  feature1?: Feature;
  feature2?: Feature;
  feature3?: Feature;
  feature4?: Feature;
}

const BentoGrid = ({
  heading = "JobQuest: Smart Job & Skill Matching",
  description = "Connect with opportunities, prep for interviews, and land your dream role with AI-powered matching.",
  feature1 = {
    title: "Smart Job Matching",
    description: "Get personalized job recommendations based on your skills.",
    image:
      "https://cdn.dribbble.com/userupload/43337340/file/original-e747bd6226e3a4e5905b73192c878c35.png?resize=1504x1128&vertical=center",
    href: "/#",
  },
  feature2 = {
    title: "Interview Prep Tools",
    description: "Practice with curated questions and expert tips for success.",
    image:
      "https://cdn.cosmos.so/df136bc4-ef39-4316-a8c5-baa9334845d8?format=jpeg",
    href: "/interview-prep",
  },
  feature3 = {
    title: "Resume Builder Pro",
    description: "Create professional resumes that stand out to employers.",
    image:
      "https://cdn.cosmos.so/df136bc4-ef39-4316-a8c5-baa9334845d8?format=jpeg",
    href: "/resume-builder",
  },
  feature4 = {
    title: "Application Tracker",
    description: "Organize applications and bookmarks all in a single place.",
    image:
      "https://cdn.dribbble.com/userupload/18233631/file/original-0f0dc6bfd983d7a4c7abfaf3c203edfb.png?resize=1504x1128&vertical=center",
    href: "/#",
  },
}: Feature166Props) => {
  return (
    <section className="py-32">
      <div className="container max-w-7xl mx-auto">
        <div className="mb-12 md:mb-24 flex flex-col items-center gap-6">
          <h1 className="text-center text-primary max-sm:text-left  max-sm:pl-4 text-3xl font-bold lg:max-w-3xl lg:text-5xl">
            {heading}
          </h1>
          <p className="text-center text-lg max-sm:px-4 max-sm:text-left font-medium text-muted-foreground/70 md:max-w-4xl lg:text-xl">
            {description}
          </p>
        </div>
        <div className="relative flex justify-center">
          <div className=" bg-white rounded-3xl  relative flex w-full flex-col border md:w-1/2 lg:w-full">
            <div className="relative flex flex-col lg:flex-row">
              <div className="border-muted2 flex flex-col justify-between border-b border-solid p-10 lg:w-3/5 lg:border-r lg:border-b-0">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-primary mb-2">
                      {feature1.title}
                    </h2>
                    <p className="text-muted-foreground">{feature1.description}</p>
                  </div>
                  {feature1.href && (
                    <Button asChild size="sm" variant="outline">
                      <Link href={feature1.href}>Explore</Link>
                    </Button>
                  )}
                </div>
                <img
                  src={feature1.image}
                  alt={feature1.title}
                  className="rounded-2xl  mt-8 aspect-[1.5] h-full w-full object-cover lg:aspect-[2.4]"
                />
              </div>
              <div className="flex flex-col justify-between p-10 lg:w-2/5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-primary mb-2">
                      {feature2.title}
                    </h2>
                    <p className="text-muted-foreground">{feature2.description}</p>
                  </div>
                  {feature2.href && (
                    <Button asChild size="sm" variant="outline">
                      <Link href={feature2.href}>Explore</Link>
                    </Button>
                  )}
                </div>
                <img
                  src={feature2.image}
                  alt={feature2.title}
                  className="rounded-2xl  mt-8 aspect-[1.45] h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="border-muted2 relative flex flex-col border-t border-solid lg:flex-row">
              <div className="border-muted2 flex flex-col justify-between border-b border-solid p-10 lg:w-2/5 lg:border-r lg:border-b-0">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-primary mb-2">
                      {feature3.title}
                    </h2>
                    <p className="text-muted-foreground">{feature3.description}</p>
                  </div>
                  {feature3.href && (
                    <Button asChild size="sm" variant="outline">
                      <Link href={feature3.href}>Explore</Link>
                    </Button>
                  )}
                </div>
                <img
                  src={feature3.image}
                  alt={feature3.title}
                  className="rounded-2xl  mt-8 aspect-[1.45] h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-10 lg:w-3/5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-primary mb-2">
                      {feature4.title}
                    </h2>
                    <p className="text-muted-foreground">{feature4.description}</p>
                  </div>
                  {feature4.href && (
                    <Button asChild size="sm" variant="outline">
                      <Link href={feature4.href}>Explore</Link>
                    </Button>
                  )}
                </div>
                <img
                  src={feature4.image}
                  alt={feature4.title}
                  className="rounded-2xl  mt-8 aspect-[1.5] h-full w-full object-cover lg:aspect-[2.4]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { BentoGrid };