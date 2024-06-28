import { Dispatch, InputHTMLAttributes, SetStateAction, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  setFocus: Dispatch<SetStateAction<boolean>>;
  setIsActive: Dispatch<SetStateAction<boolean>>;
}

export const InputElement = forwardRef<HTMLInputElement, Props>(({
  setFocus,
  setIsActive,
  onBlur,
  onFocus,
  ...props
}, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      onBlur={(e) => {
        // to disable focus state style
        setFocus(false);
        onBlur && onBlur(e);
      }}
      onFocus={(e) => {
        setFocus(true);
        // for dropdown list show or hide when user click on the input
        setIsActive(true);
        onFocus && onFocus(e);
      }}
      className="glare-input-field"
      placeholder={props.placeholder}
    />
  );
});
