import React, { HTMLAttributes, ReactNode, useRef } from "react";
import './style.scss';
import Button from "../../buttons/button";
import { useShowDropDown } from "../../../../hooks/useShowDropDown";
import { DynamicContainer } from "../../../helpers/dynamicContainer";

interface Props extends HTMLAttributes<HTMLDivElement> {
    component_size?: "S" | "M" | "L";
    component_label: string;
    drop_down_list_child: ReactNode;
}

export const DropDownButton: React.FC<Props> = ({
    component_size = "M",
    component_label,
    drop_down_list_child,
    className,
    ...props
}) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { isActive } = useShowDropDown(sectionRef);

    return (
        <section
            {...props}
            ref={sectionRef}
            className={`glare-drop-down-button glare-drop-down-button-size-${component_size} ${className}`}
        >
            <section className="glare-drop-down-button-wrapper">
                <p className="glare-drop-down-button-label">{component_label}</p>
                <Button
                    className={isActive ? "glare-drop-down-button-icon-flip" : ""}
                    component_size={component_size}
                    left_icon={<i className="ri-arrow-down-s-line"></i>}
                />
            </section>
            <DynamicContainer active={isActive}>
                {drop_down_list_child}
            </DynamicContainer>
        </section>
    );
};

export default DropDownButton;
