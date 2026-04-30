"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import {
  FormStepper,
  FormStep,
  FormStepIndicator,
  FormStepLabel,
} from "@/components/FormStepper";

export default function FormStepperExample() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="flex flex-col gap-10">
      <h1
        className={cn(
          "text-xl font-bold",
          "text-content-presentation-global-primary",
        )}
      >
        FormStepper Preview
      </h1>

      {/* Type variants — Default state */}
      <Section title="Types — Default state">
        <FormStepper>
          <FormStep index={0} type="default" selected={false}>
            <FormStepIndicator />
            <FormStepLabel>Default</FormStepLabel>
          </FormStep>
          <FormStep index={1} type="success" selected={false}>
            <FormStepIndicator />
            <FormStepLabel>Success</FormStepLabel>
          </FormStep>
          <FormStep index={2} type="negative" selected={false}>
            <FormStepIndicator />
            <FormStepLabel>Negative</FormStepLabel>
          </FormStep>
        </FormStepper>
      </Section>

      {/* Selected state */}
      <Section title="Selected state">
        <FormStepper>
          <FormStep index={0} type="default" selected>
            <FormStepIndicator />
            <FormStepLabel>Default</FormStepLabel>
          </FormStep>
          <FormStep index={1} type="success" selected>
            <FormStepIndicator />
            <FormStepLabel>Success</FormStepLabel>
          </FormStep>
          <FormStep index={2} type="negative" selected>
            <FormStepIndicator />
            <FormStepLabel>Negative</FormStepLabel>
          </FormStep>
        </FormStepper>
      </Section>

      {/* Sizes */}
      <Section title="Sizes">
        <div className="flex flex-col gap-4">
          <FormStepper size="S">
            <FormStep index={0} type="default" selected>
              <FormStepIndicator />
              <FormStepLabel>Size S</FormStepLabel>
            </FormStep>
            <FormStep index={1} type="success">
              <FormStepIndicator />
              <FormStepLabel>Size S</FormStepLabel>
            </FormStep>
          </FormStepper>
          <FormStepper size="M">
            <FormStep index={0} type="default" selected>
              <FormStepIndicator />
              <FormStepLabel>Size M</FormStepLabel>
            </FormStep>
            <FormStep index={1} type="success">
              <FormStepIndicator />
              <FormStepLabel>Size M</FormStepLabel>
            </FormStep>
          </FormStepper>
        </div>
      </Section>

      {/* Interactive */}
      <Section title={`Interactive — Step ${activeStep + 1} of 4`}>
        <FormStepper activeStep={activeStep}>
          <FormStep index={0} type="success" onClick={() => setActiveStep(0)}>
            <FormStepIndicator />
            <FormStepLabel>Account</FormStepLabel>
          </FormStep>
          <FormStep index={1} type="default" onClick={() => setActiveStep(1)}>
            <FormStepIndicator />
            <FormStepLabel>Profile</FormStepLabel>
          </FormStep>
          <FormStep index={2} type="negative" onClick={() => setActiveStep(2)}>
            <FormStepIndicator />
            <FormStepLabel>Payment</FormStepLabel>
          </FormStep>
          <FormStep index={3} type="default" onClick={() => setActiveStep(3)}>
            <FormStepIndicator />
            <FormStepLabel>Confirm</FormStepLabel>
          </FormStep>
        </FormStepper>
      </Section>

      {/* RTL */}
      <Section title="RTL Direction">
        <div dir="rtl">
          <FormStepper>
            <FormStep index={0} type="default" selected>
              <FormStepIndicator />
              <FormStepLabel>افتراضي</FormStepLabel>
            </FormStep>
            <FormStep index={1} type="success">
              <FormStepIndicator />
              <FormStepLabel>نجاح</FormStepLabel>
            </FormStep>
            <FormStep index={2} type="negative">
              <FormStepIndicator />
              <FormStepLabel>خطأ</FormStepLabel>
            </FormStep>
          </FormStepper>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span
        className={cn(
          "text-sm font-medium",
          "text-content-presentation-global-secondary",
        )}
      >
        {title}
      </span>
      {children}
    </div>
  );
}
