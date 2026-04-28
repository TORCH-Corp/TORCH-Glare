"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/cn";

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = "Drawer";

const DrawerNested = (
  props: React.ComponentProps<typeof DrawerPrimitive.NestedRoot>,
) => <DrawerPrimitive.NestedRoot {...props} />;
DrawerNested.displayName = "DrawerNested";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 ", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

interface DrawerContentProps extends React.ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Content
> {
  showHandle?: boolean;
  notch?: React.ReactNode;
  notchSide?: "left" | "right";
  /**
   * Show the dark "tray" frame (and panel border + inset shadow) around the
   * drawer panel. Defaults to `true`. Set to `false` for bottom-anchored
   * drawers (slide up from below) where a surrounding frame would just look
   * like a stray border at the top.
   */
  framed?: boolean;
  wrapperClassName?: string;
  trayClassName?: string;
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      children,
      showHandle = true,
      notch,
      notchSide = "left",
      framed: framedProp,
      wrapperClassName,
      trayClassName,
      ...props
    },
    ref,
  ) => {
    const framed = framedProp ?? true;
    return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col items-stretch m-1",
          wrapperClassName,
        )}
        {...props}
      >
        {notch && (
          <div className={notchSide === "right" ? "self-end" : "self-start"}>
            {React.isValidElement(notch)
              ? React.cloneElement(
                  notch as React.ReactElement<{ side?: "left" | "right" }>,
                  { side: notchSide },
                )
              : notch}
          </div>
        )}
        <div
          className={cn(
            "flex flex-1 flex-col min-h-0",
            framed
              ? "p-1.5 bg-black-400 shadow-[0_0_4px_rgba(0,0,0,0.2),0_0_30px_rgba(0,0,0,0.4)]"
              : "p-0",
            framed && notch
              ? notchSide === "right"
                ? "rounded-tr-none rounded-tl-[22px] rounded-b-[22px]"
                : "rounded-tl-none rounded-tr-[22px] rounded-b-[22px]"
              : framed
                ? "rounded-t-[22px]"
                : "",
            trayClassName,
          )}
        >
          <div
            className={cn(
              "flex flex-1 flex-col gap-2 rounded-t-[16px] p-1.5 bg-[#F0F0F0] min-h-0",
              framed && "border border-[#D4D4D4] shadow-[inset_0_-4px_16px_rgba(0,0,0,0.1)]",
              className,
            )}
          >
            {showHandle && !notch && (
              <div className="mx-auto h-2 w-[100px] rounded-full bg-[#D4D4D4]" />
            )}
            {children}
          </div>
        </div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
    );
  },
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-row justify-between items-stretch gap-2 px-1 pt-1",
      className,
    )}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const drawerHeaderPane = cva(
  "flex items-center gap-2 rounded-[14px] border p-2 bg-[#131415] border-[#2C2D2E] shadow-[0_0_32px_2px_rgba(0,0,0,0.05)]",
);

const DrawerHeaderTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(drawerHeaderPane(), className)} {...props} />
);
DrawerHeaderTitle.displayName = "DrawerHeaderTitle";

const DrawerHeaderActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(drawerHeaderPane(), "justify-end", className)}
    {...props}
  />
);
DrawerHeaderActions.displayName = "DrawerHeaderActions";

const drawerBadge = cva(
  "inline-flex items-center justify-center rounded-[8px] px-1 py-0.5 typography-display-medium-medium uppercase",
  {
    variants: {
      color: {
        Blue: "bg-[rgba(0,117,255,0.5)] text-[#CCE3FF]",
        Green: "bg-[rgba(34,197,94,0.5)] text-[#D1FAE5]",
        Red: "bg-[rgba(239,68,68,0.5)] text-[#FEE2E2]",
        Yellow: "bg-[rgba(234,179,8,0.5)] text-[#FEF3C7]",
        Purple: "bg-[rgba(139,92,246,0.5)] text-[#EDE9FE]",
        Gray: "bg-[rgba(255,255,255,0.15)] text-[#E5E5E5]",
      },
    },
    defaultVariants: { color: "Blue" },
  },
);

interface DrawerBadgeProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof drawerBadge> {}

const DrawerBadge = React.forwardRef<HTMLSpanElement, DrawerBadgeProps>(
  ({ className, color, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(drawerBadge({ color }), className)}
      {...props}
    />
  ),
);
DrawerBadge.displayName = "DrawerBadge";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

interface DrawerNotchProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right";
}

const DrawerNotch = ({
  className,
  children,
  side = "left",
  ...props
}: DrawerNotchProps) => {
  // Wedge bridges the notch's bottom-edge corner into the tray's top edge.
  // For a left-attached notch (the default), the wedge sits at the notch's
  // bottom-right; for a right-attached notch, mirror it to the bottom-left.
  const wedge = (
    <svg
      aria-hidden
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className="block shrink-0 self-end"
    >
      <path
        d={
          side === "right"
            ? "M 12 0 L 12 12 L 0 12 A 12 12 0 0 0 12 0 Z"
            : "M 0 0 L 0 12 L 12 12 A 12 12 0 0 1 0 0 Z"
        }
        fill="#434446"
      />
    </svg>
  );

  return (
    <div className="relative flex flex-row items-end">
      {side === "right" && wedge}
      <div
        className={cn(
          "flex items-center gap-1 rounded-t-[18px] bg-black-400 px-1.5 pt-1.5 pb-1.5",
          side === "right" ? "flex-row-reverse" : "flex-row",
          className,
        )}
        {...props}
      >
        {children}
      </div>
      {side === "left" && wedge}
    </div>
  );
};
DrawerNotch.displayName = "DrawerNotch";

const DrawerNotchClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Close"
    className={cn(
      "inline-flex h-[22px] w-[22px] items-center justify-center rounded-[13px] bg-white/15 text-content-presentation-global-primary transition-colors hover:bg-white/25",
      className,
    )}
    {...props}
  >
    {children ?? <i className="ri-close-fill text-[14px]" />}
  </button>
));
DrawerNotchClose.displayName = "DrawerNotchClose";

const drawerNotchPill = cva(
  "inline-flex items-center gap-1 rounded-[16px] px-1.5 py-0.5 typography-body-small-medium text-white transition-colors",
  {
    variants: {
      color: {
        Yellow: "bg-white/15 hover:bg-white/25",
        Blue: "bg-[#005ECC] hover:bg-[#0070E0]",
        Gray: "bg-white/10 hover:bg-white/20",
      },
    },
    defaultVariants: { color: "Yellow" },
  },
);

interface DrawerNotchPillProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof drawerNotchPill> {}

const DrawerNotchPill = React.forwardRef<
  HTMLButtonElement,
  DrawerNotchPillProps
>(({ className, color, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(drawerNotchPill({ color }), className)}
    {...props}
  >
    {children}
  </button>
));
DrawerNotchPill.displayName = "DrawerNotchPill";

const DrawerNotchDivider = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    aria-hidden
    className={cn("h-[18px] w-px bg-white/20", className)}
    {...props}
  />
);
DrawerNotchDivider.displayName = "DrawerNotchDivider";

interface DrawerNotchAppProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  name: React.ReactNode;
}

const DrawerNotchApp = ({
  className,
  icon,
  name,
  ...props
}: DrawerNotchAppProps) => (
  <div className={cn("flex items-center gap-2.5 px-1", className)} {...props}>
    {icon && (
      <div className="flex h-[22px] w-[22px] items-center justify-center overflow-hidden rounded-[5.6px] bg-black shadow-[0_0_4.66px_rgba(0,0,0,0.3),0_0.75px_0.75px_rgba(0,0,0,0.2)]">
        {icon}
      </div>
    )}
    <span className="text-white text-[14px] leading-[1.475]">{name}</span>
  </div>
);
DrawerNotchApp.displayName = "DrawerNotchApp";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "typography-display-medium-medium uppercase text-white leading-none",
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("typography-body-small-regular text-[#9FA0A1]", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerNested,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerHeaderActions,
  DrawerBadge,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerNotch,
  DrawerNotchClose,
  DrawerNotchPill,
  DrawerNotchDivider,
  DrawerNotchApp,
};
