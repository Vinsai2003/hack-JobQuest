"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const Pricing = () => {
  const [isAnnually, setIsAnnually] = useState(false);
  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <h2 className="text-pretty text-primary text-4xl font-bold lg:text-6xl">
            Find your dream job today
          </h2>
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <p className="text-muted-foreground/70  max-w-3xl lg:text-xl">
              Match with opportunities, prep for interviews, and land your next role. Choose the plan that accelerates your career.
            </p>
            <div className="bg-violet-200 flex h-11 w-fit shrink-0 items-center rounded-md p-1 text-lg">
              <RadioGroup
                defaultValue="monthly"
                className="h-full grid-cols-2"
                onValueChange={(value) => {
                  setIsAnnually(value === "annually");
                }}
              >
                <div className='has-[button[data-state="checked"]]:bg-background h-full rounded-md transition-all'>
                  <RadioGroupItem
                    value="monthly"
                    id="monthly"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="monthly"
                    className="text-muted-foreground peer-data-[state=checked]:text-primary flex h-full cursor-pointer items-center justify-center px-7 font-semibold"
                  >
                    Monthly
                  </Label>
                </div>
                <div className='has-[button[data-state="checked"]]:bg-background h-full rounded-md transition-all'>
                  <RadioGroupItem
                    value="annually"
                    id="annually"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="annually"
                    className="text-muted-foreground peer-data-[state=checked]:text-primary flex h-full cursor-pointer items-center justify-center gap-1 px-7 font-semibold"
                  >
                    Yearly
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="flex w-full flex-col items-stretch gap-6 md:flex-row">
            <div className="flex w-full bg-white flex-col rounded-lg border p-6 text-left">
              <Badge className="mb-8 block w-fit">FREE</Badge>
              <span className="text-4xl font-medium">$0</span>{" "}
              <p className="text-muted-foreground">Per year</p>
              <p className="text-muted-foreground invisible">
                Get started with basic features
              </p>
              <Separator className="my-6" />
              <div className="flex flex-col justify-between gap-20">
                <ul className="text-muted-foreground space-y-4">
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Basic job search & filters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Skill-based job matching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Email support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Basic integrations</span>
                  </li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </div>
            </div>
            <div className="flex w-full bg-white flex-col rounded-lg border p-6 text-left">
              <Badge className="mb-8 block w-fit">PRO</Badge>
              {isAnnually ? (
                <>
                  <span className="text-4xl font-medium">$99</span>
                  <p className="text-muted-foreground">Per year</p>
                </>
              ) : (
                <>
                  <span className="text-4xl font-medium">$9</span>
                  <p className="text-muted-foreground">Per month</p>
                </>
              )}
              <p className="text-muted-foreground">
                Advanced tools for serious job seekers
              </p>
              <Separator className="my-6" />
              <div className="flex h-full flex-col justify-between gap-20">
                <ul className="text-muted-foreground space-y-4">
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Everything in FREE</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Resume builder & templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Interview prep resources</span>
                  </li>
                </ul>
                <Button className="w-full">Purchase</Button>
              </div>
            </div>
            <div className="bg-violet-200 flex w-full flex-col rounded-lg border p-6 text-left">
              <Badge className="mb-8 block w-fit">Elite</Badge>
              {isAnnually ? (
                <>
                  <span className="text-4xl font-medium">$249</span>
                  <p className="text-muted-foreground">Per year</p>
                </>
              ) : (
                <>
                  <span className="text-4xl font-medium">$9</span>
                  <p className="text-muted-foreground">Per month</p>
                </>
              )}
              <p className="text-muted-foreground">
              Complete career acceleration suite
              </p>
              <Separator className="my-6" />
              <div className="flex h-full flex-col justify-between gap-20">
                <ul className="text-muted-foreground space-y-4">
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Everything in PRO</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Priority job alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Advanced profile analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Unlimited bookmarking</span>
                  </li>
                </ul>
                <Button className="w-full">Purchase</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing };