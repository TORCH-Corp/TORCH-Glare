"use client";
import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import { cva } from "class-variance-authority";
import { cn } from "./utils";

export const glareAlert = cva(
  "flex relative justify-start items-center rounded-[4px] min-h-26px w-fit pr-1 rtl:pl-1 rtl:pr-0",
  {
    variants: {
      state: {
        info: "bg-[var(--background-presentation-state-information-secondary)]",
        warning: "bg-[var(--background-presentation-state-warning-secondary)]",
        error: "bg-[var(--background-presentation-state-negative-secondary)]",
        success: "bg-[var(--background-presentation-state-success-secondary)]",
      },
    },
    defaultVariants: {
      state: "info",
    },
  }
);

export const glareAlertIconWrapper = cva(
  "flex items-center justify-center min-w-[26px] min-h-[26px] h-full rounded-[4px] text-[18px]",
  {
    variants: {
      state: {
        info: "bg-[var(--background-presentation-state-information-primary)] text-white",
        warning:
          "bg-[var(--background-presentation-state-warning-primary)] text-[var(--background-presentation-state-warning-secondary)]",
        error:
          "bg-[var(--background-presentation-state-negative-primary)] text-white",
        success:
          "bg-[var(--background-presentation-state-success-primary)] text-white",
      },
    },
    defaultVariants: {
      state: "info",
    },
  }
);

export const glareAlertLabel = cva(
  "p-1 word-break-all text-[var(--content-presentation-global-primary)] text-wrap text-start whitespace-pre-wrap",
  {
    variants: {
      typography: {
        small: "text-sm", // Replace with your Tailwind typography utility or mixin.
      },
    },
    defaultVariants: {
      typography: "small",
    },
  }
);

interface Props extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  state?: "info" | "warning" | "error" | "success";
  icon?: ReactNode;
}

export const Alert: React.FC<Props> = ({
  label,
  state,
  icon,
  className,
  ...props
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentHeight, setParentHeight] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
      setParentHeight(parentRef.current.offsetHeight);
    }
  }, [parentRef]);

  return (
    <section
      ref={parentRef}
      {...props}
      className={cn(
        glareAlert({
          state,
        }),
        className
      )}
    >
      <section
        style={{ height: `${parentHeight}px` }}
        className={glareAlertIconWrapper({
          state,
        })}
      >
        {icon ? (
          icon
        ) : state === "error" ? (
          <i className="ri-alert-fill"></i>
        ) : state === "success" ? (
          <i className="ri-checkbox-circle-fill"></i>
        ) : (
          <i className="ri-error-warning-fill"></i>
        )}
      </section>
      <p className={glareAlertLabel()}>{label}</p>
    </section>
  );
};

export default Alert;
