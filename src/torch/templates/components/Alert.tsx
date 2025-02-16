import { HTMLAttributes, ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "./utils";

export const glareAlert = cva(
  "flex relative justify-start items-center rounded-[4px] min-h-26px w-fit pr-1 rtl:pl-1 rtl:pr-0 [&>section]:text-white",
  {
    variants: {
      state: {
        info: "bg-[var(--background-presentation-state-information-secondary)] [&>section]:bg-[var(--background-presentation-state-information-primary)] [&>section]:text-[var(--background-presentation-state-information-secondary)]",
        warning:
          "bg-[var(--background-presentation-state-warning-secondary)] [&>section]:bg-[var(--background-presentation-state-warning-primary)] [&>section]:text-[var(--background-presentation-state-warning-secondary)]",
        error:
          "bg-[var(--background-presentation-state-negative-secondary)] [&>section]:bg-[var(--background-presentation-state-negative-primary)] [&>section]:text-[var(--background-presentation-state-negative-secondary)]",
        success:
          "bg-[var(--background-presentation-state-success-secondary)] [&>section]:bg-[var(--background-presentation-state-success-primary)] [&>section]:text-[var(--background-presentation-state-success-secondary)]",
      },
    },
    defaultVariants: {
      state: "info",
    },
  }
);

interface Props extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  state?: "info" | "warning" | "error" | "success";
  icon?: ReactNode;
  theme?: "dark" | "light" | "default"
}

export const Alert: React.FC<Props> = ({
  label,
  state,
  theme,
  icon,
  className,
  ...props
}) => {
  return (
    <section
      {...props}
      data-theme={theme}
      className={cn(
        glareAlert({
          state,
        }),
        className
      )}
    >
      <section className="flex items-center justify-center min-w-[26px] min-h-[26px] h-full rounded-[4px] text-[18px]">
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
      <p
        className={
          "p-1 word-break-all text-[var(--content-presentation-global-primary)] text-wrap text-start whitespace-pre-wrap text-sm"
        }
      >
        {label}
      </p>
    </section>
  );
};

export default Alert;
