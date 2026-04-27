"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerNested,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/Drawer";
import { Button } from "@/components/Button";

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
                      <input
                        defaultValue="Ali Nameer"
                        className="w-full h-[34px] px-3 rounded-[6px] bg-background-presentation-form-field-primary border border-border-presentation-action-primary typography-body-medium-regular text-content-presentation-global-primary outline-none focus:border-border-presentation-state-focus"
                        placeholder="Display name"
                      />
                      <input
                        defaultValue="accounts@torchcorp.com"
                        className="w-full h-[34px] px-3 rounded-[6px] bg-background-presentation-form-field-primary border border-border-presentation-action-primary typography-body-medium-regular text-content-presentation-global-primary outline-none focus:border-border-presentation-state-focus"
                        placeholder="Email"
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
                      {["Mentions", "Direct messages", "Weekly digest"].map(
                        (label) => (
                          <label
                            key={label}
                            className="flex items-center justify-between p-3 rounded-[6px] border border-border-presentation-action-primary"
                          >
                            <span className="typography-body-medium-regular text-content-presentation-global-primary">
                              {label}
                            </span>
                            <input type="checkbox" defaultChecked />
                          </label>
                        )
                      )}
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
                <div className="flex items-center justify-between p-3 rounded-[6px] border border-border-presentation-action-primary">
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

                    <div className="px-4 pb-4 space-y-2">
                      {[
                        { id: "standard", label: "Standard — 5-7 days", price: "Free" },
                        { id: "express", label: "Express — 2 days", price: "$12" },
                        { id: "overnight", label: "Overnight", price: "$28" },
                      ].map((opt) => (
                        <label
                          key={opt.id}
                          className="flex items-center justify-between p-3 rounded-[6px] border border-border-presentation-action-primary cursor-pointer"
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              checked={shippingMethod === opt.id}
                              onChange={() => setShippingMethod(opt.id)}
                            />
                            <span className="typography-body-medium-regular text-content-presentation-global-primary">
                              {opt.label}
                            </span>
                          </span>
                          <span className="typography-body-small-medium text-content-presentation-action-light-secondary">
                            {opt.price}
                          </span>
                        </label>
                      ))}
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

                          <div className="px-4 pb-4 space-y-2">
                            {[
                              { id: "card", label: "Credit card" },
                              { id: "paypal", label: "PayPal" },
                              { id: "apple", label: "Apple Pay" },
                            ].map((opt) => (
                              <label
                                key={opt.id}
                                className="flex items-center gap-3 p-3 rounded-[6px] border border-border-presentation-action-primary cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name="payment"
                                  checked={paymentMethod === opt.id}
                                  onChange={() => setPaymentMethod(opt.id)}
                                />
                                <span className="typography-body-medium-regular text-content-presentation-global-primary">
                                  {opt.label}
                                </span>
                              </label>
                            ))}
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
              className="inset-y-0 right-0 left-auto mt-0 h-full w-[420px] max-w-[90vw] rounded-l-[10px] rounded-tr-none"
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
                    className="p-3 rounded-[6px] border border-border-presentation-action-primary"
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
            <DrawerContent className="inset-0 m-0 h-screen w-screen max-w-none rounded-none border-0">
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
                  <textarea
                    rows={20}
                    defaultValue={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.`}
                    className="w-full p-4 rounded-[6px] bg-background-presentation-form-field-primary border border-border-presentation-action-primary typography-body-medium-regular text-content-presentation-global-primary outline-none focus:border-border-presentation-state-focus resize-none"
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
            <DrawerContent className="h-full max-h-[97vh]">
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
                    className="p-3 rounded-[6px] border border-border-presentation-action-primary"
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
