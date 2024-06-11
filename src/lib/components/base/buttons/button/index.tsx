import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import './variants/default.scss';
import loadingIcon from './icons/loading.svg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  left_icon?: ReactNode;
  right_icon?: ReactNode;
  is_loading?: boolean;
  component_style?:
  | "BlueSecStyle"
  | "YelSecStyle"
  | "RedSecStyle"
  | "BorderStyle"
  | "PrimeContStyle"
  | "BlueContStyle"
  | "RedContStyle";
  component_size?: "S" | "M" | "L";
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
      className={`glare-button glare-button-${component_size} glare-button-without-icon-${!children && component_size} ${is_loading && !right_icon && !left_icon ? "glare-button-loading" : ''} ${component_style} ${className}`}
    >
      {left_icon && !is_loading ? <div className='glare-button-icon'>{left_icon}</div> : null}
      {children}
      {right_icon && !is_loading ? <div className='glare-button-icon'>{right_icon}</div> : null}
      <img className='glare-button-loading-img' src={loadingIcon} alt='loading' />
    </button>
  );
};


export default Button