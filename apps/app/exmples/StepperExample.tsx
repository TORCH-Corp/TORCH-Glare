"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";
import { Button } from "@/components/Button";
import {
  Stepper,
  Step,
  StepIndicator,
  StepConnector,
  StepLabel,
  StepDescription,
} from "@/components/Stepper";

export default function StepperExample() {
  const [activeStep, setActiveStep] = useState(1);
  const [verticalStep, setVerticalStep] = useState(2);
  const totalSteps = 4;
  const verticalTotalSteps = 4;

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-presentation-global-primary"
        )}
      >
        Stepper Preview
      </h1>

      {/* Horizontal Stepper — Interactive */}
      <div className="flex flex-col gap-4 w-full">
        <span
          className={cn("text-sm", "text-content-presentation-global-primary")}
        >
          Horizontal — Interactive (Step {activeStep + 1} of {totalSteps})
        </span>

        <Stepper activeStep={activeStep} orientation="horizontal" size="M">
          <Step index={0}>
            <StepIndicator />
            <StepLabel>Account</StepLabel>
          </Step>
          <StepConnector />
          <Step index={1}>
            <StepIndicator />
            <StepLabel>Profile</StepLabel>
          </Step>
          <StepConnector />
          <Step index={2}>
            <StepIndicator />
            <StepLabel>Settings</StepLabel>
          </Step>
          <StepConnector />
          <Step index={3}>
            <StepIndicator />
            <StepLabel>Confirm</StepLabel>
          </Step>
        </Stepper>

        <div className="flex gap-2 mt-2">
          <Button
            size="S"
            variant="BorderStyle"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
          >
            <i className="ri-arrow-left-s-line" /> Back
          </Button>
          <Button
            size="S"
            variant="PrimeStyle"
            disabled={activeStep >= totalSteps}
            onClick={() => setActiveStep((s) => Math.min(totalSteps, s + 1))}
          >
            Next <i className="ri-arrow-right-s-line" />
          </Button>
          <Button
            size="S"
            variant="PrimeContStyle"
            onClick={() => setActiveStep(0)}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-6 w-full mt-8">
        <span
          className={cn("text-sm", "text-content-presentation-global-primary")}
        >
          Sizes
        </span>

        {(["S", "M", "L"] as const).map((size) => (
          <div key={size} className="flex flex-col gap-2">
            <span
              className={cn(
                "text-xs",
                "text-content-presentation-global-primary"
              )}
            >
              Size: {size}
            </span>
            <Stepper activeStep={2} orientation="horizontal" size={size}>
              <Step index={0}>
                <StepIndicator />
                <StepLabel>Step 1</StepLabel>
              </Step>
              <StepConnector />
              <Step index={1}>
                <StepIndicator />
                <StepLabel>Step 2</StepLabel>
              </Step>
              <StepConnector />
              <Step index={2}>
                <StepIndicator />
                <StepLabel>Step 3</StepLabel>
              </Step>
            </Stepper>
          </div>
        ))}
      </div>

      {/* With Descriptions */}
      <div className="flex flex-col gap-4 w-full mt-8">
        <span
          className={cn("text-sm", "text-content-presentation-global-primary")}
        >
          With Descriptions
        </span>

        <Stepper activeStep={1} orientation="horizontal" size="L">
          <Step index={0}>
            <StepIndicator />
            <StepLabel>Account</StepLabel>
            <StepDescription>Create your account</StepDescription>
          </Step>
          <StepConnector />
          <Step index={1}>
            <StepIndicator />
            <StepLabel>Profile</StepLabel>
            <StepDescription>Set up your profile</StepDescription>
          </Step>
          <StepConnector />
          <Step index={2}>
            <StepIndicator />
            <StepLabel>Complete</StepLabel>
            <StepDescription>Review and finish</StepDescription>
          </Step>
        </Stepper>
      </div>

      {/* Error State */}
      <div className="flex flex-col gap-4 w-full mt-8">
        <span
          className={cn("text-sm", "text-content-presentation-global-primary")}
        >
          Error State
        </span>

        <Stepper activeStep={2} orientation="horizontal" size="M">
          <Step index={0}>
            <StepIndicator />
            <StepLabel>Upload</StepLabel>
          </Step>
          <StepConnector />
          <Step index={1}>
            <StepIndicator />
            <StepLabel>Validate</StepLabel>
          </Step>
          <StepConnector />
          <Step index={2} isError>
            <StepIndicator />
            <StepLabel>Process</StepLabel>
            <StepDescription>Validation failed</StepDescription>
          </Step>
          <StepConnector />
          <Step index={3}>
            <StepIndicator />
            <StepLabel>Done</StepLabel>
          </Step>
        </Stepper>
      </div>

      {/* Custom Icons */}
      <div className="flex flex-col gap-4 w-full mt-8">
        <span
          className={cn("text-sm", "text-content-presentation-global-primary")}
        >
          Custom Icons
        </span>

        <Stepper activeStep={1} orientation="horizontal" size="L">
          <Step index={0}>
            <StepIndicator
              icon={<i className="ri-shopping-cart-line" />}
              completedIcon={<i className="ri-shopping-cart-fill" />}
            />
            <StepLabel>Cart</StepLabel>
          </Step>
          <StepConnector />
          <Step index={1}>
            <StepIndicator
              icon={<i className="ri-map-pin-line" />}
              completedIcon={<i className="ri-map-pin-fill" />}
            />
            <StepLabel>Shipping</StepLabel>
          </Step>
          <StepConnector />
          <Step index={2}>
            <StepIndicator
              icon={<i className="ri-bank-card-line" />}
              completedIcon={<i className="ri-bank-card-fill" />}
            />
            <StepLabel>Payment</StepLabel>
          </Step>
          <StepConnector />
          <Step index={3}>
            <StepIndicator
              icon={<i className="ri-check-double-line" />}
            />
            <StepLabel>Confirm</StepLabel>
          </Step>
        </Stepper>
      </div>

      {/* Vertical — Interactive */}
      <div className="flex flex-col gap-4 w-full mt-8">
        <span
          className={cn("text-sm", "text-content-presentation-global-primary")}
        >
          Vertical — Interactive (Step {verticalStep + 1} of {verticalTotalSteps})
        </span>

        <Stepper activeStep={verticalStep} orientation="vertical" size="M">
          <Step index={0}>
            <StepIndicator />
            <div className="flex flex-col gap-1 pb-6">
              <StepLabel>Create Account</StepLabel>
              <StepDescription>
                Sign up with your email address
              </StepDescription>
            </div>
          </Step>

          <Step index={1}>
            <StepIndicator />
            <div className="flex flex-col gap-1 pb-6">
              <StepLabel>Verify Email</StepLabel>
              <StepDescription>
                Check your inbox for a verification link
              </StepDescription>
            </div>
          </Step>

          <Step index={2}>
            <StepIndicator />
            <div className="flex flex-col gap-1 pb-6">
              <StepLabel>Complete Profile</StepLabel>
              <StepDescription>
                Add your name, photo, and preferences
              </StepDescription>
            </div>
          </Step>

          <Step index={3}>
            <StepIndicator />
            <div className="flex flex-col gap-1">
              <StepLabel>Get Started</StepLabel>
              <StepDescription>
                Explore the dashboard and start building
              </StepDescription>
            </div>
          </Step>
        </Stepper>

        <div className="flex gap-2 mt-2">
          <Button
            size="S"
            variant="BorderStyle"
            disabled={verticalStep === 0}
            onClick={() => setVerticalStep((s) => Math.max(0, s - 1))}
          >
            <i className="ri-arrow-left-s-line" /> Back
          </Button>
          <Button
            size="S"
            variant="PrimeStyle"
            disabled={verticalStep >= verticalTotalSteps}
            onClick={() =>
              setVerticalStep((s) => Math.min(verticalTotalSteps, s + 1))
            }
          >
            Next <i className="ri-arrow-right-s-line" />
          </Button>
          <Button
            size="S"
            variant="PrimeContStyle"
            onClick={() => setVerticalStep(0)}
          >
            Reset
          </Button>
        </div>
      </div>
    </>
  );
}
