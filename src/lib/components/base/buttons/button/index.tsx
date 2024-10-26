import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  forwardRef,
} from "react";
import "./variants/default.scss";
import { ButtonIcon } from "./components/buttonIcon";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  left_icon?: ReactNode; // this will show icon on the left side if you pass it
  right_icon?: ReactNode; // this will show icon on the right side if you pass it
  is_loading?: boolean; // this will show loading icon if true
  component_style?:
    | "BlueSecStyle"
    | "YelSecStyle"
    | "RedSecStyle"
    | "BorderStyle"
    | "PrimeContStyle"
    | "BlueContStyle"
    | "RedContStyle"; // this prop will change the button style see on figma design file
  component_size?: "S" | "M" | "L"; // this prop will change the button style size see on figma design file
}

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      left_icon,
      right_icon,
      is_loading,
      component_style,
      component_size = "S",
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        className={`glare-button glare-button-${component_size} glare-button-without-icon-${!children && component_size} ${is_loading ? "glare-button-loading" : ""} ${component_style} ${className}`}
      >
        <ButtonIcon is_loading={is_loading} icon={left_icon} />
        {children}
        <ButtonIcon is_loading={is_loading} icon={right_icon} />
        {is_loading && <LoadingRing className="glare-button-loading-img" />}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

const LoadingRing = (props: HTMLAttributes<HTMLOrSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5ZM1.25 5C1.25 7.07107 2.92893 8.75 5 8.75C7.07107 8.75 8.75 7.07107 8.75 5C8.75 2.92893 7.07107 1.25 5 1.25C2.92893 1.25 1.25 2.92893 1.25 5Z"
      fill="#F4F4F4"
    />
    <path
      d="M10 5C10 4.34339 9.87067 3.69321 9.6194 3.08658C9.36812 2.47995 8.99983 1.92876 8.53553 1.46447C8.07124 1.00017 7.52004 0.631876 6.91342 0.380602C6.30679 0.129329 5.65661 -2.87013e-08 5 0V1.25C5.49246 1.25 5.98009 1.347 6.43506 1.53545C6.89003 1.72391 7.30343 2.00013 7.65165 2.34835C7.99987 2.69657 8.27609 3.10997 8.46455 3.56494C8.653 4.01991 8.75 4.50754 8.75 5H10Z"
      fill="#0075FF"
    />
  </svg>
);
