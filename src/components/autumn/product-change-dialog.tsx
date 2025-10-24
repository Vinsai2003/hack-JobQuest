"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductChangeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  preview: {
    current_product: string;
    new_product: string;
    prorated_amount: number;
    next_billing_date: string;
  };
}

export function ProductChangeDialog({
  open,
  setOpen,
  preview,
}: ProductChangeDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    // The confirmation is handled by the useCustomer hook
    setOpen(false);
    setIsConfirming(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Plan Change</DialogTitle>
          <DialogDescription>
            Review the details of your plan change
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Plan:</span>
            <span className="font-medium">{preview.current_product}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">New Plan:</span>
            <span className="font-medium">{preview.new_product}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Prorated Amount:</span>
            <span className="font-medium">
              ${(preview.prorated_amount / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next Billing Date:</span>
            <span className="font-medium">
              {new Date(preview.next_billing_date).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1"
            disabled={isConfirming}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              "Confirm Change"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
