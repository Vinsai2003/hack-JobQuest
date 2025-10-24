import { Activity, Briefcase, FileText, Target } from "lucide-react";
import Image from "next/image";

export default function FeatureSectionTwo() {
  return (
    <section className="py-16 md:py-32 ">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
          <div className="lg:col-span-2">
            <div className="md:pr-6 lg:pr-0">
              <h2 className="text-4xl text-primary font-bold lg:text-6xl">
                Launch your career with JobQuest
              </h2>
              <p className="mt-6 text-lg text-muted-foreground/80 md:text-xl">
                Match skills, find opportunities, and ace interviews with ease.
              </p>
            </div>
            <ul className="mt-8 divide-y border-y text-purple-800/90 *:flex *:items-center *:gap-3 *:py-3">
              <li>
                <Target className="size-5" />
                Smart skill matching
              </li>
              <li>
                <Briefcase className="size-5" />
                Curated job listings
              </li>
              <li>
                <Activity className="size-5" />
                Application tracking
              </li>
              <li>
                <FileText className="size-5" />
                Interview prep tools
              </li>
            </ul>
          </div>
          <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="https://cdn.cosmos.so/faa10ec9-5599-4197-b7bd-2dee543a44a9?format=jpeg"
                className="rounded-[15px] shadow dark:hidden"
                alt="job search platform illustration"
                width={1207}
                height={929}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}