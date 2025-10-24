import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const FeatureSection = () => {
  // Enhanced feature data
  const features = [
    {
      title: "Smart Job Matching",
      description:
        "Find perfect job matches based on your skills and experience.",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-5oYbG-sEImY-unsplash.jpg",
      href: "/#",
      isPremium: false,
    },
    {
      title: "Interview Preparation",
      description: "Access curated questions and ace your next interview.",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-9__Q24sJqKg-unsplash.jpg",
      href: "/interview-prep",
      isPremium: true,
    },
    {
      title: "Resume Builder Tool",
      description: "Create professional resumes and export them as PDF.",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-duxeKbu9FDE-unsplash.jpg",
      href: "/resume-builder",
      isPremium: true,
    },
    {
      title: "Track Applications",
      description: "Bookmark opportunities and monitor your progress.",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-xYFl3Q9am1E-unsplash.jpg",
      href: "/track-applications",
      isPremium: false,
    },
  ];

  return (
    <section className="bg-background">
      <div className="container max-w-7xl mx-auto py-32">
        <div className="mb-16 max-w-2xl space-y-8 pl-4">
          <h2 className="text-5xl font-bold tracking-tighter text-primary md:text-6xl">
            JobQuest Features
          </h2>
          <p className="text-lg tracking-tight text-muted-foreground md:text-xl">
            Everything students need to find jobs and prepare for interviews.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="p-2">
            {features.map((item, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <DottedDiv className="group h-[500px] place-self-end p-4">
                  <Card className="h-full w-full shrink-0 rounded-lg border border-border bg-muted">
                    <CardContent className="relative flex h-full flex-col items-center justify-center gap-6 p-6">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="mb-4 size-40 rounded-lg object-cover"
                      />
                      <h3 className="mb-2 text-center text-2xl font-semibold tracking-tighter text-primary md:text-3xl">
                        {item.title}
                      </h3>
                      <p className="text-center text-base tracking-tight text-muted-foreground/80 md:text-lg">
                        {item.description}
                      </p>
                      <Button asChild className="mt-auto">
                        <Link href={item.href}>
                          {item.isPremium ? "Explore Feature" : "Learn More"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </DottedDiv>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="my-3 flex justify-end gap-3 pr-5">
            <CarouselPrevious className="static m-0 size-12 translate-y-0 p-0" />
            <CarouselNext
              variant="default"
              className="static size-12 translate-y-0"
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export { FeatureSection };

const DottedDiv = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("relative", className)}>
    <div className="absolute top-4 -left-0 h-[1.5px] w-[115%] bg-muted" />
    <div className="absolute bottom-4 -left-0 h-[1.5px] w-[115%] bg-muted" />
    <div className="absolute -top-25 left-4 h-[130%] w-[1.5px] bg-muted" />
    <div className="absolute -top-25 right-4 h-[130%] w-[1.5px] bg-muted" />
    <div className="absolute top-[12.5px] left-[12.5px] z-10 size-2 rounded-full bg-foreground" />
    <div className="absolute top-[12.5px] right-[12.5px] z-10 size-2 rounded-full bg-foreground" />
    <div className="absolute bottom-[12.5px] left-[12.5px] z-10 size-2 rounded-full bg-foreground" />
    <div className="absolute right-[12.5px] bottom-[12.5px] z-10 size-2 rounded-full bg-foreground" />
    {children}
  </div>
);