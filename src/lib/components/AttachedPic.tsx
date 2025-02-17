import { HTMLAttributes, ReactNode } from "react";
import { Button } from "./Button";
import { cn } from "../utils/cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
  src: any;
  header?: ReactNode;
  onHide?: () => void;
  theme?: "dark" | "light" | "default"
}

export function AttachedPic({ theme, src, header, onHide, ...props }: Props) {
  return (
    <section
      {...props}
      data-theme={theme}
      className={cn(
        " overflow-hidden flex flex-col items-center justify-center w-80 p-2 gap-2 rounded-md border shadow-md border-[var(--border-presentation-global-primary)] bg-[var(--background-presentation-form-base)]",
        props.className
      )}
    >
      <section className="flex items-center justify-between w-full m-0">
        <p className="m-0 text-[var(--content-presentation-global-primary)] typography-display-medium-semibold">
          {header}
        </p>
        <Button theme={theme} onClick={onHide} size="M" buttonType="icon">
          <i className="ri-close-line text-[16px]"></i>
        </Button>
      </section>

      <img className="w-full object-cover object-center rounded-md" src={src} />

      <section className="flex items-center justify-end w-full gap-2">
        {props.children}
      </section>
    </section>
  );
}
