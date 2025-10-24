"use client";

import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface Banner4Props {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  defaultVisible?: boolean;
}

const Banner = ({
  title = "JobQuest Launch! 🚀",
  description = "Match with top jobs & internships. Build your career today!",
  defaultVisible = true,
}: Banner4Props) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <section className="bg-primary w-full p-4 py-1">
      <div className="container">
        <div className="relative flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-8 w-8 md:hidden"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="text-primary-foreground flex flex-col items-center gap-3 pt-2 md:flex-row md:items-center md:pt-0">
            <div className="flex flex-col gap-1 md:flex-row md:items-center">
              <p className="text-sm font-medium">{title}</p>
              <p className="text-primary-foreground/80 text-sm">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden h-8 w-8 invert md:inline-flex"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Banner };