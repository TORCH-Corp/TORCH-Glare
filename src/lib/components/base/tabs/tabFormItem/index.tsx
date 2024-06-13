import { ButtonHTMLAttributes } from "react";
import SideFormBarItem from "./components/sideFormBarItem";
import TopFormBarItem from "./components/topFormBar-Item";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    component_size?: "L" | "M";
    name: string;
    label?: string;
    required_label?: string;
    secondary_label?: string;
    componentType: "Top" | "Side"
}

const TabFormItem: React.FC<Props> = ({
    component_size,
    name,
    label,
    required_label,
    secondary_label,
    componentType,
    ...props
}) => {
    return (
        componentType === 'Top' ?
            <TopFormBarItem
                {...props}
                component_size={component_size}
                name={name}
                label={label}
                required_label={required_label}
                secondary_label={secondary_label}
            />
            :
            <SideFormBarItem
                {...props}
                component_size={component_size}
                name={name}
                label={label}
                required_label={required_label}
                secondary_label={secondary_label}
            />
    )
}

export default TabFormItem
