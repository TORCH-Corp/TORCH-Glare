import './style.scss';
import { Label } from '../../../../labels/label';
import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    component_size?: "L" | "M";
    name: string;
    label?: string;
    required_label?: string;
    secondary_label?: string;
}

const SideFormBarItem: React.FC<Props> = ({
    component_size,
    name,
    label,
    required_label,
    secondary_label,
    ...props
}) => {
    return (
        <button {...props} name={name} onClick={props.onClick} className={`sideFormBarItem ${props.className}`}>
            <Label
                name={name}
                component_size={component_size}
                label={label}
                required_label={required_label}
                secondary_label={secondary_label}
                as_child={true}
            />
        </button>
    );
};

export default SideFormBarItem;
