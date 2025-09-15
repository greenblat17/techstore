"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutStepsProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: "Shipping", description: "Enter shipping details" },
  { id: 2, name: "Billing", description: "Payment information" },
  { id: 3, name: "Review", description: "Confirm your order" },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              stepIdx !== steps.length - 1 ? "flex-1" : "",
              "relative"
            )}
          >
            {step.id < currentStep ? (
              // Completed step
              <>
                <div className="flex items-center">
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {stepIdx !== steps.length - 1 && (
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="h-0.5 bg-primary" />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium">{step.name}</span>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </>
            ) : step.id === currentStep ? (
              // Current step
              <>
                <div className="flex items-center">
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background">
                    <span className="text-primary font-semibold">{step.id}</span>
                  </span>
                  {stepIdx !== steps.length - 1 && (
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="h-0.5 bg-muted" />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium text-primary">{step.name}</span>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </>
            ) : (
              // Upcoming step
              <>
                <div className="flex items-center">
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted bg-background">
                    <span className="text-muted-foreground">{step.id}</span>
                  </span>
                  {stepIdx !== steps.length - 1 && (
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="h-0.5 bg-muted" />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium text-muted-foreground">{step.name}</span>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}