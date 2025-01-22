import React, { ButtonHTMLAttributes, ReactNode } from "react";
import "./style.scss";
import Counter from "@/components/base/counter";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode; // icon for the button
  count?: number; // will show the Counter component and pass the count to it if not null
}

const IconButton: React.FC<Props> = ({
  icon,
  count,
  className,
  ...buttonProps
}) => {
  return (
    <button {...buttonProps} className={`glare-small-button ${className}`}>
      {/* if count is not null then show the counter and pass the count to it */}
      {count ? <Counter label={count} /> : null}
      {icon}
    </button>
  );
};

export default IconButton;
