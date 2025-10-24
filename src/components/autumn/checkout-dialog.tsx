"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CheckoutDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  checkoutUrl: string;
}

export function CheckoutDialog({ open, setOpen, checkoutUrl }: CheckoutDialogProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenInNewTab = () => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage(
        { type: "OPEN_EXTERNAL_URL", data: { url: checkoutUrl } },
        "*"
      );
    } else {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="relative flex-1 p-6 pt-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <iframe
            src={checkoutUrl}
            className="w-full h-full border-0 rounded-lg"
            onLoad={() => setIsLoading(false)}
            title="Checkout"
          />
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={handleOpenInNewTab}>
              Open in New Tab
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
