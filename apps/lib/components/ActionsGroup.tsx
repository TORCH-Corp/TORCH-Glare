import React, { HTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

interface Props extends HTMLAttributes<HTMLDivElement> {
  withDivider?: boolean; // to display the divider line if you pass it see on figma design file
  theme?: Themes
}

const ActionsGroup: React.FC<Props> = ({
  withDivider,
  className,
  children,
  theme,
  ...props
}) => {
  return (
    <section
      {...props}
      data-theme={theme}
      className={cn("flex items-center gap-2 flex-1", className)}
    >
      {withDivider && (
        <div className="flex border-t border-solid border-border-presentation-global-primary flex-1 px-2" />
      )}
      {children}
      {withDivider && (
        <div className="flex border-t border-solid border-border-presentation-global-primary flex-1 px-2" />
      )}
    </section>
  );
};

export default ActionsGroup;
