"use client";

import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCustomer } from "autumn-js/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CheckoutDialog } from "./checkout-dialog";
import { ProductChangeDialog } from "./product-change-dialog";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PricingTable() {
  const [isAnnually, setIsAnnually] = useState(false);
  const { customer, checkout, attach, isLoading } = useCustomer();
  const { data: session } = useSession();
  const router = useRouter();
  const [checkoutState, setCheckoutState] = useState<{
    open: boolean;
    url: string;
  }>({ open: false, url: "" });

  const currentPlan = customer?.products?.at(-1);
  const currentPlanId = currentPlan?.id;

  const handlePurchase = async (productId: string) => {
    if (!session?.user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      // Check if user already has this plan
      if (currentPlanId === productId) {
        toast.info("You're already on this plan!");
        return;
      }

      // If user has a paid plan, use attach for upgrade/downgrade
      if (currentPlanId && currentPlanId !== "free") {
        const result = await attach({
          productId,
          dialog: ProductChangeDialog,
        });
        
        if (result) {
          toast.success("Plan changed successfully!");
        }
      } else {
        // New purchase - use checkout
        const result = await checkout({
          productId,
          dialog: CheckoutDialog,
          openInNewTab: true,
          successUrl: `${window.location.origin}/dashboard?payment=success`,
          cancelUrl: window.location.href,
        });

        if (result?.url) {
          const isInIframe = window.self !== window.top;
          if (isInIframe) {
            window.parent.postMessage(
              { type: "OPEN_EXTERNAL_URL", data: { url: result.url } },
              "*"
            );
          } else {
            window.open(result.url, "_blank", "noopener,noreferrer");
          }
        }
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const getButtonText = (productId: string) => {
    if (isLoading) return "Loading...";
    if (currentPlanId === productId) return "Current Plan";
    if (productId === "free") return "Get Started";
    if (currentPlanId && currentPlanId !== "free") return "Change Plan";
    return "Purchase";
  };

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <h2 className="text-pretty text-primary text-4xl font-bold lg:text-6xl">
            Find your dream job today
          </h2>
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <p className="text-muted-foreground/70 max-w-3xl lg:text-xl">
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

          {/* Show current plan badge if user is logged in */}
          {session?.user && currentPlan && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Current Plan:</span>
              <Badge variant="secondary" className="text-sm">
                {currentPlan.name}
              </Badge>
            </div>
          )}

          <div className="flex w-full flex-col items-stretch gap-6 md:flex-row">
            {/* FREE PLAN */}
            <div className="flex w-full bg-white flex-col rounded-lg border p-6 text-left">
              <Badge className="mb-8 block w-fit">FREE</Badge>
              <span className="text-4xl font-medium">$0</span>
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
                <Button
                  className="w-full"
                  onClick={() => handlePurchase("free")}
                  disabled={isLoading || currentPlanId === "free"}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {getButtonText("free")}
                </Button>
              </div>
            </div>

            {/* PRO PLAN */}
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
                <Button
                  className="w-full"
                  onClick={() =>
                    handlePurchase(isAnnually ? "pro_yearly" : "pro_monthly")
                  }
                  disabled={
                    isLoading ||
                    currentPlanId === "pro_monthly" ||
                    currentPlanId === "pro_yearly"
                  }
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {getButtonText(isAnnually ? "pro_yearly" : "pro_monthly")}
                </Button>
              </div>
            </div>

            {/* ELITE PLAN */}
            <div className="bg-violet-200 flex w-full flex-col rounded-lg border p-6 text-left">
              <Badge className="mb-8 block w-fit">ELITE</Badge>
              {isAnnually ? (
                <>
                  <span className="text-4xl font-medium">$249</span>
                  <p className="text-muted-foreground">Per year</p>
                </>
              ) : (
                <>
                  <span className="text-4xl font-medium">$25</span>
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
                <Button
                  className="w-full"
                  onClick={() =>
                    handlePurchase(isAnnually ? "elite_yearly" : "elite_monthly")
                  }
                  disabled={
                    isLoading ||
                    currentPlanId === "elite_monthly" ||
                    currentPlanId === "elite_yearly"
                  }
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {getButtonText(isAnnually ? "elite_yearly" : "elite_monthly")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
