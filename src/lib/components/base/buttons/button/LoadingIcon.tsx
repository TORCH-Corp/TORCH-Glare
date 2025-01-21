import { cn } from "@/utils";
import { cva } from "class-variance-authority";

interface IconProps {
  size?: "S" | "M" | "L" | null;
  className?: string;
}

export function LoadingIcon({ size, className }: IconProps) {
  const iconVariants = cva("animate-spin ", {
    variants: {
      size: {
        S: "w-[12px] h-[12px]",
        M: "w-[14px] h-[14px]",
        L: "w-[16px] h-[16px]",
      },
    },
    defaultVariants: {
      size: "M",
    },
  });

  return (
    <svg
      className={cn(iconVariants({ size, className }))}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6ZM2.25 6C2.25 8.07107 3.92893 9.75 6 9.75C8.07107 9.75 9.75 8.07107 9.75 6C9.75 3.92893 8.07107 2.25 6 2.25C3.92893 2.25 2.25 3.92893 2.25 6Z"
        fill="#F4F4F4"
      />
      <path
        d="M11 6C11 5.34339 10.8707 4.69321 10.6194 4.08658C10.3681 3.47995 9.99983 2.92876 9.53553 2.46447C9.07124 2.00017 8.52004 1.63188 7.91342 1.3806C7.30679 1.12933 6.65661 1 6 1V2.25C6.49246 2.25 6.98009 2.347 7.43506 2.53545C7.89003 2.72391 8.30343 3.00013 8.65165 3.34835C8.99987 3.69657 9.27609 4.10997 9.46455 4.56494C9.653 5.01991 9.75 5.50754 9.75 6H11Z"
        fill="#0075FF"
      />
    </svg>
  );
}
