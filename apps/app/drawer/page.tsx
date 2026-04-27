"use client";

import { ReactNode, useState } from "react";
import {
  Drawer,
  DrawerNested,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerHeaderActions,
  DrawerBadge,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerNotch,
  DrawerNotchClose,
  DrawerNotchPill,
  DrawerNotchDivider,
  DrawerNotchApp,
} from "@/components/Drawer";
import { Button } from "@/components/Button";
import { SectionCard } from "@/components/SectionCard";
import { InputField } from "@/components/InputField";
import { LabeledCheckBox } from "@/components/LabeledCheckBox";
import { LabeledRadio } from "@/components/LabeledRadio";
import { RadioGroup } from "@/components/Radio";
import { Textarea } from "@/components/Textarea";

export default function DrawerPage() {
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <div className="min-h-screen p-8 bg-background-presentation-body-primary">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="space-y-2">
          <h1 className="typography-headers-medium-medium text-content-presentation-global-primary">
            Drawer
          </h1>
          <p className="typography-body-medium-regular text-content-presentation-action-light-secondary">
            Bottom-sheet drawer built on Vaul. Supports drag-to-dismiss and
            nested drawers that stack with an iOS-style scale-back effect.
          </p>
        </header>

        {/* ============================================================== */}
        {/* FORM DRAWER (FIGMA) */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
            Form drawer (Figma) — right-side
          </h2>
          <p className="typography-body-small-regular text-content-presentation-action-light-secondary">
            Right-anchored form drawer with three notch modes: <strong>None</strong>,
            <strong> Simple</strong> (close + "Open in new tab"), and <strong>App</strong>
            (close + app icon + name + "Open in the app").
          </p>

          <div className="flex flex-wrap gap-3">
            {/* No notch */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="PrimeStyle">No notch</Button>
              </DrawerTrigger>
              <FormDrawerContent />
            </Drawer>

            {/* Simple notch */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="PrimeStyle">Simple notch</Button>
              </DrawerTrigger>
              <FormDrawerContent
                notch={
                  <DrawerNotch>
                    <DrawerClose asChild>
                      <DrawerNotchClose />
                    </DrawerClose>
                    <DrawerNotchPill color="Yellow">
                      Open in new tab
                      <i className="ri-arrow-right-up-line text-[12px]" />
                    </DrawerNotchPill>
                  </DrawerNotch>
                }
              />
            </Drawer>

            {/* App notch */}
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="PrimeStyle">App notch</Button>
              </DrawerTrigger>
              <FormDrawerContent
                notch={
                  <DrawerNotch>
                    <DrawerClose asChild>
                      <DrawerNotchClose />
                    </DrawerClose>
                    <DrawerNotchDivider />
                    <DrawerNotchApp
                      icon={
                        <i className="ri-customer-service-2-fill text-white text-[14px]" />
                      }
                      name="Sales & Services App"
                    />
                    <DrawerNotchPill color="Blue">
                      Open in the app
                      <i className="ri-arrow-right-up-line text-[12px]" />
                    </DrawerNotchPill>
                  </DrawerNotch>
                }
              />
            </Drawer>
          </div>
        </section>

        {/* ============================================================== */}
        {/* BASIC */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
            Basic
          </h2>
          <p className="typography-body-small-regular text-content-presentation-action-light-secondary">
            A single drawer. Tap the handle and drag down to dismiss.
          </p>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="PrimeStyle">Open drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Basic drawer</DrawerTitle>
                <DrawerDescription>
                  This is a single-level drawer. Drag the handle down or press
                  Escape to close.
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <p className="typography-body-small-regular text-content-presentation-action-light-secondary">
                  Put any content here — forms, lists, settings.
                </p>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="PrimeStyle">Done</Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="BorderStyle">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </section>

        {/* ============================================================== */}
        {/* NESTED — TWO LEVELS */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
            Nested — Two Levels
          </h2>
          <p className="typography-body-small-regular text-content-presentation-action-light-secondary">
            Use{" "}
            <code className="px-1 rounded bg-background-presentation-action-disabled text-content-presentation-global-primary">
              DrawerNested
            </code>{" "}
            inside an open drawer. The parent scales down and slides back, the
            child slides up on top.
          </p>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="PrimeStyle">Open settings</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Settings</DrawerTitle>
                <DrawerDescription>
                  Pick a sub-section to dive into.
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-4 pb-4 space-y-2">
                <DrawerNested>
                  <DrawerTrigger asChild>
                    <Button variant="BorderStyle" className="w-full justify-between">
                      Account
                      <i className="ri-arrow-right-s-line" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Account</DrawerTitle>
                      <DrawerDescription>
                        Update your profile details. Drag down to go back to
                        Settings.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-4 space-y-3">
                      <InputField defaultValue="Ali Nameer" placeholder="Display name" />
                      <InputField
                        defaultValue="accounts@torchcorp.com"
                        placeholder="Email"
                        type="email"
                      />
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="PrimeStyle">Save</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </DrawerNested>

                <DrawerNested>
                  <DrawerTrigger asChild>
                    <Button variant="BorderStyle" className="w-full justify-between">
                      Notifications
                      <i className="ri-arrow-right-s-line" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Notifications</DrawerTitle>
                      <DrawerDescription>
                        Choose what you want to hear about.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-4 space-y-2">
                      {[
                        { id: "mentions", label: "Mentions" },
                        { id: "dms", label: "Direct messages" },
                        { id: "digest", label: "Weekly digest" },
                      ].map((opt) => (
                        <div
                          key={opt.id}
                          className="p-3 rounded-[6px] border border-border-presentation-action-primary bg-background-presentation-form-base"
                        >
                          <LabeledCheckBox
                            id={opt.id}
                            label={opt.label}
                            defaultChecked
                          />
                        </div>
                      ))}
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="PrimeStyle">Done</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </DrawerNested>
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="BorderStyle">Close settings</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </section>

        {/* ============================================================== */}
        {/* NESTED — THREE LEVELS (CHECKOUT FLOW) */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
            Nested — Three Levels (Checkout)
          </h2>
          <p className="typography-body-small-regular text-content-presentation-action-light-secondary">
            A real-world flow: cart → shipping → payment. Each step pushes a
            new drawer onto the stack and sends the previous one back.
          </p>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="PrimeStyle">Checkout</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Your cart</DrawerTitle>
                <DrawerDescription>1 item — $129.00</DrawerDescription>
              </DrawerHeader>

              <div className="px-4 pb-4">
                <div className="flex items-center justify-between p-3 rounded-[6px] border border-border-presentation-action-primary bg-background-presentation-form-base">
                  <div>
                    <p className="typography-body-medium-medium text-content-presentation-global-primary">
                      TORCH Glare Pro
                    </p>
                    <p className="typography-body-small-regular text-content-presentation-action-light-secondary">
                      Annual license
                    </p>
                  </div>
                  <span className="typography-body-medium-medium text-content-presentation-global-primary">
                    $129.00
                  </span>
                </div>
              </div>

              <DrawerFooter>
                <DrawerNested>
                  <DrawerTrigger asChild>
                    <Button variant="PrimeStyle">Continue to shipping</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Shipping</DrawerTitle>
                      <DrawerDescription>
                        Currently selected: <strong>{shippingMethod}</strong>
                      </DrawerDescription>
                    </DrawerHeader>

                    <div className="px-4 pb-4">
                      <RadioGroup
                        value={shippingMethod}
                        onValueChange={setShippingMethod}
                      >
                        {[
                          { id: "standard", label: "Standard — 5-7 days", price: "Free" },
                          { id: "express", label: "Express — 2 days", price: "$12" },
                          { id: "overnight", label: "Overnight", price: "$28" },
                        ].map((opt) => (
                          <div
                            key={opt.id}
                            className="flex items-center justify-between p-3 rounded-[6px] border border-border-presentation-action-primary bg-background-presentation-form-base"
                          >
                            <LabeledRadio
                              id={opt.id}
                              value={opt.id}
                              label={opt.label}
                            />
                            <span className="typography-body-small-medium text-content-presentation-action-light-secondary">
                              {opt.price}
                            </span>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <DrawerFooter>
                      <DrawerNested>
                        <DrawerTrigger asChild>
                          <Button variant="PrimeStyle">Continue to payment</Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Payment</DrawerTitle>
                            <DrawerDescription>
                              Final step. Currently selected:{" "}
                              <strong>{paymentMethod}</strong>
                            </DrawerDescription>
                          </DrawerHeader>

                          <div className="px-4 pb-4">
                            <RadioGroup
                              value={paymentMethod}
                              onValueChange={setPaymentMethod}
                            >
                              {[
                                { id: "card", label: "Credit card" },
                                { id: "paypal", label: "PayPal" },
                                { id: "apple", label: "Apple Pay" },
                              ].map((opt) => (
                                <div
                                  key={opt.id}
                                  className="p-3 rounded-[6px] border border-border-presentation-action-primary bg-background-presentation-form-base"
                                >
                                  <LabeledRadio
                                    id={opt.id}
                                    value={opt.id}
                                    label={opt.label}
                                  />
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="PrimeStyle">
                                Place order — $129.00
                              </Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </DrawerNested>
                    </DrawerFooter>
                  </DrawerContent>
                </DrawerNested>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </section>

        {/* ============================================================== */}
        {/* RIGHT-SIDE DRAWER */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
            Right-side
          </h2>
          <p className="typography-body-small-regular text-content-presentation-action-light-secondary">
            Slides in from the right edge. Pass{" "}
            <code className="px-1 rounded bg-background-presentation-action-disabled text-content-presentation-global-primary">
              direction="right"
            </code>{" "}
            to{" "}
            <code className="px-1 rounded bg-background-presentation-action-disabled text-content-presentation-global-primary">
              Drawer
            </code>{" "}
            and override the layout classes on{" "}
            <code className="px-1 rounded bg-background-presentation-action-disabled text-content-presentation-global-primary">
              DrawerContent
            </code>
            .
          </p>

          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button variant="PrimeStyle">Open right drawer</Button>
            </DrawerTrigger>
            <DrawerContent
              showHandle={false}
              wrapperClassName="top-2 right-2 bottom-2 left-auto mt-0 h-auto w-[420px] max-w-[calc(100vw-16px)]"
              trayClassName="rounded-[16px]"
              className="rounded-[10px]"
            >
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
                <DrawerDescription>
                  A right-anchored drawer is great for filters, details panels,
                  and side-by-side workflows.
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-4 pb-4 space-y-3 flex-1 overflow-y-auto">
                {[
                  "Status",
                  "Owner",
                  "Created date",
                  "Tags",
                  "Priority",
                ].map((label) => (
                  <div
                    key={label}
                    className="p-3 rounded-[6px] border border-border-presentation-action-primary bg-background-presentation-form-base"
                  >
                    <p className="typography-body-medium-medium text-content-presentation-global-primary">
                      {label}
                    </p>
                    <p className="typography-body-small-regular text-content-presentation-action-light-secondary">
                      Any
                    </p>
                  </div>
                ))}
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="PrimeStyle">Apply</Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="BorderStyle">Reset</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </section>

        {/* ============================================================== */}
        {/* FULL-SCREEN DRAWER */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
            Full-screen
          </h2>
          <p className="typography-body-small-regular text-content-presentation-action-light-secondary">
            Covers the entire viewport. Useful for immersive editors, media
            viewers, or onboarding flows.
          </p>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="PrimeStyle">Open full-screen</Button>
            </DrawerTrigger>
            <DrawerContent
              wrapperClassName="inset-x-0 top-0 bottom-0 m-0 h-screen w-screen max-w-none"
            >
              <DrawerHeader className="flex flex-row items-center justify-between border-b border-border-presentation-action-disabled">
                <div>
                  <DrawerTitle>Editor</DrawerTitle>
                  <DrawerDescription>
                    Full-screen mode — drag the handle down to dismiss.
                  </DrawerDescription>
                </div>
                <DrawerClose asChild>
                  <Button variant="BorderStyle" buttonType="icon">
                    <i className="ri-close-line" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-2xl mx-auto space-y-4">
                  <h3 className="typography-headers-medium-medium text-content-presentation-global-primary">
                    Document title
                  </h3>
                  <Textarea
                    rows={20}
                    defaultValue={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.`}
                  />
                </div>
              </div>

              <DrawerFooter className="border-t border-border-presentation-action-disabled">
                <DrawerClose asChild>
                  <Button variant="PrimeStyle">Save and close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </section>

        {/* ============================================================== */}
        {/* HALF-SCREEN BOTTOM DRAWER */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
            Half-screen (bottom)
          </h2>
          <p className="typography-body-small-regular text-content-presentation-action-light-secondary">
            Opens to roughly half the viewport, then snaps to full when
            dragged up. Driven by Vaul's{" "}
            <code className="px-1 rounded bg-background-presentation-action-disabled text-content-presentation-global-primary">
              snapPoints
            </code>
            .
          </p>

          <Drawer snapPoints={[0.5, 1]} fadeFromIndex={1}>
            <DrawerTrigger asChild>
              <Button variant="PrimeStyle">Open half-screen</Button>
            </DrawerTrigger>
            <DrawerContent wrapperClassName="h-full max-h-[97vh]">
              <DrawerHeader>
                <DrawerTitle>Comments</DrawerTitle>
                <DrawerDescription>
                  Drag up to expand to full height, drag down to dismiss.
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-4 pb-4 space-y-3 flex-1 overflow-y-auto">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-[6px] border border-border-presentation-action-primary bg-background-presentation-form-base"
                  >
                    <div className="flex items-center justify-between">
                      <p className="typography-body-medium-medium text-content-presentation-global-primary">
                        User {i + 1}
                      </p>
                      <span className="typography-body-small-regular text-content-presentation-action-light-secondary">
                        2h ago
                      </span>
                    </div>
                    <p className="typography-body-small-regular text-content-presentation-action-light-secondary mt-1">
                      Looks great — shipping this today.
                    </p>
                  </div>
                ))}
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="BorderStyle">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </section>

        {/* ============================================================== */}
        {/* USAGE NOTE */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
            Usage
          </h2>
          <pre className="p-4 rounded-[6px] bg-background-presentation-action-disabled text-content-presentation-global-primary typography-body-small-regular overflow-x-auto">
{`<Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    ...

    {/* Nested drawer — must live inside an open Drawer */}
    <DrawerNested>
      <DrawerTrigger>Go deeper</DrawerTrigger>
      <DrawerContent>...</DrawerContent>
    </DrawerNested>
  </DrawerContent>
</Drawer>`}
          </pre>
        </section>
      </div>
    </div>
  );
}

function FormDrawerContent({ notch }: { notch?: ReactNode }) {
  return (
    <DrawerContent
      showHandle={false}
      notch={notch}
      wrapperClassName="top-2 right-2 bottom-2 left-auto mt-0 h-auto w-[1046px] max-w-[calc(100vw-16px)]"
      trayClassName={notch ? undefined : "rounded-[22px]"}
      className={
        notch ? "rounded-tr-[16px] rounded-b-[16px]" : "rounded-[16px]"
      }
    >
      <DrawerHeader>
        <DrawerHeaderTitle>
          <DrawerBadge color="Blue">New</DrawerBadge>
          <DrawerTitle>Individual Contact</DrawerTitle>
        </DrawerHeaderTitle>
        <DrawerHeaderActions>
          <Button variant="PrimeStyle" size="L">
            Save Draft
          </Button>
        </DrawerHeaderActions>
      </DrawerHeader>

      <div className="flex-1 overflow-y-auto px-12 py-6 space-y-3">
        <SectionCard
          color="Blue"
          title={
            <span className="flex items-center gap-[6px]">
              <i className="ri-draft-fill" />
              Identity
            </span>
          }
          containerClassName="w-full"
        >
          <FieldRow
            label="Name"
            required
            right={
              <div className="flex flex-1 items-center gap-3">
                <InputField placeholder="First Name*" className="flex-1" />
                <InputField placeholder="Last Name*" className="flex-1" />
              </div>
            }
          />
          <RowDivider />
          <FieldRow
            label="Email"
            required
            right={
              <InputField
                placeholder="name@example.com"
                type="email"
                className="flex-1"
              />
            }
          />
          <RowDivider />
          <FieldRow
            label="Phone"
            right={<InputField placeholder="+1 555 0000" className="flex-1" />}
          />
        </SectionCard>

        <SectionCard
          color="Purple"
          title={
            <span className="flex items-center gap-[6px]">
              <i className="ri-map-pin-line" />
              Address
            </span>
          }
          containerClassName="w-full"
        >
          <FieldRow
            label="Street"
            right={<InputField placeholder="123 Main St" className="flex-1" />}
          />
          <RowDivider />
          <FieldRow
            label="City"
            right={<InputField placeholder="San Francisco" className="flex-1" />}
          />
          <RowDivider />
          <FieldRow
            label="Postal code"
            right={<InputField placeholder="94103" className="flex-1" />}
          />
        </SectionCard>
      </div>
    </DrawerContent>
  );
}

interface FieldRowProps {
  label: string;
  required?: boolean;
  right: ReactNode;
}

function FieldRow({ label, required, right }: FieldRowProps) {
  return (
    <div className="flex items-center gap-6 py-[18px]">
      <div className="flex w-[180px] shrink-0 items-center gap-[6px]">
        <span className="typography-body-medium-regular text-content-presentation-action-light-primary">
          {label}
        </span>
        {required && (
          <span className="typography-body-small-medium text-content-presentation-state-negative">
            (Required)
          </span>
        )}
      </div>
      <div className="flex flex-1 items-center">{right}</div>
    </div>
  );
}

function RowDivider() {
  return <div className="h-px w-full bg-border-presentation-global-primary" />;
}
