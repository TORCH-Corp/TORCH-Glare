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

const Badge: React.FC<Props> = ({
  label,
  onCloseBtnClick,
  selected,
  badge_icon,
  badge_style,
  badge_size
  , ...props }) => {

  return (
    <span
      {...props}
      className={`glare-badge glare-badge-size-${badge_size ? badge_size : "S"} ${badge_style} ${props.className}`}
    >
      {/* default icon for badge is circle in case you don't pass any icon*/}
      <span className='badge-icon'>
        {badge_icon ? badge_icon : <i className="ri-circle-fill badge-def-icon"></i>}
      </span>
      <p className='badge-label'>{label}</p>

      {/* if the badge is selected then show the close button*/}
      {selected && <button onClick={onCloseBtnClick} className='glare-badge-close-icon'><i className="ri-close-line"></i></button>}
    </span>
  );
}


export default Badge