import { Dispatch, InputHTMLAttributes, SetStateAction } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  ref: any,
  setFocus: Dispatch<SetStateAction<boolean>>
  setIsActive: Dispatch<SetStateAction<boolean>>
}

export default function InputElement({
  ref, setFocus, setIsActive, ...props
}: Props) {
  return (
    <input
      {...props}
      ref={ref}
      onBlur={(e) => {
        // to disable fucus state style
        setFocus(false);
        props.onBlur && props.onBlur(e);
      }}
      onFocus={(e) => {
        setFocus(true);
        // for dropdown list show or hide when user click on the input
        setIsActive(true);
        props.onFocus && props.onFocus(e);
      }}
      className={`glare-input-field`}
      placeholder={props.placeholder}
    />
  )
}
