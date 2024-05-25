import { MouseEventHandler, ReactNode, ButtonHTMLAttributes } from 'react';
import './styles/default.scss';

interface Props extends ButtonHTMLAttributes<HTMLSpanElement> {
  label?: string;
  onCloseBtnClick?: MouseEventHandler;
  selected?: boolean;
  badge_icon?: ReactNode;
  badge_style?: "badge-green" | "badge-green-light" | "badge-cocktail-green" | "badge-yellow" | "badge-red-orange" | "badge-red-light" | "badge-rose" | "badge-purple" | "badge-blue-purple" | "badge-blue" | "badge-navy" | "badge-gray";
  badge_size?: "S" | "M" | "L";
}

export default function Badge(props: Props) {
  return (
    <span
      {...props}
      className={`glare-badge glare-badge-size-${props.badge_size ? props.badge_size : "S"} ${props.badge_style} ${props.className}`}
    >
      <span className='badge-icon'> {props.badge_icon ? props.badge_icon : <i className="ri-circle-fill badge-def-icon"></i>}</span>
      {props.label}
      {props.selected && <button onClick={props.onCloseBtnClick} className='glare-badge-close-icon'><i className="ri-close-line"></i></button>}
    </span>
  );
}
