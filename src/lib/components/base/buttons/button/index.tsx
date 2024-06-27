import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import './variants/default.scss';
import loadingIcon from './icons/loading.svg';
import { ButtonIcon } from './components/buttonIcon';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  left_icon?: ReactNode; // this will show icon on the left side if you pass it
  right_icon?: ReactNode;// this will show icon on the right side if you pass it
  is_loading?: boolean; // this will show loading icon if true
  component_style?:
  | "BlueSecStyle"
  | "YelSecStyle"
  | "RedSecStyle"
  | "BorderStyle"
  | "PrimeContStyle"
  | "BlueContStyle"
  | "RedContStyle";// this props will change the button style see on figma design file
  component_size?: "S" | "M" | "L"; // this props will change the button style size see on figma design file
  ref?: any
}

const Button: React.FC<Props> = ({
  left_icon,
  right_icon,
  is_loading,
  component_style,
  component_size = "S",
  children,
  className,
  ref,
  ...props
}) => {
  return (
    <button
      {...props}
      ref={ref}
      className={`glare-button glare-button-${component_size} glare-button-without-icon-${!children && component_size} ${is_loading ? "glare-button-loading" : ''} ${component_style} ${className}`}
    >
      <ButtonIcon is_loading={is_loading} icon={left_icon} />
      {children}
      <ButtonIcon is_loading={is_loading} icon={right_icon} />
      {/* loading icon will show only if is_loading is true */}
      <img className='glare-button-loading-img' src={loadingIcon} alt='loading' />
    </button>
  );
};


export default Button