import { MouseEventHandler, ReactNode, ButtonHTMLAttributes } from 'react';
import './styles/index.scss';
import { BadgeIcon } from './components/badgeIcon';

interface Props extends ButtonHTMLAttributes<HTMLSpanElement> {
  label?: string; // label of the badge
  onCloseBtnClick?: MouseEventHandler; // click event of the close button
  selected?: boolean; // to show the close button
  badge_icon?: ReactNode; // if you pass any icon then it will replace the default icon
  badge_style?:
  "badge-green" |
  "badge-green-light" |
  "badge-cocktail-green" |
  "badge-yellow" |
  "badge-red-orange" |
  "badge-red-light" |
  "badge-rose" |
  "badge-purple" |
  "badge-blue-purple" |
  "badge-blue" |
  "badge-navy" |
  "badge-gray" // the component themes see on figma design file
  badge_size?: "S" | "M" | "L"; // the component style sizes 
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
      <BadgeIcon badge_icon={badge_icon} />
      <p className='badge-label'>{label}</p>
      {/* if the badge is selected then show the close button*/}
      {selected && <button onClick={onCloseBtnClick} className='glare-badge-close-icon'><i className="ri-close-line"></i></button>}
    </span>
  );
}


export default Badge