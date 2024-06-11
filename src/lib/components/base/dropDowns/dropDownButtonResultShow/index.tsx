import React, { HTMLAttributes, ReactNode, useRef } from "react";
import './style.scss';
import { Button } from "../..";
import { DynamicContainer } from "../../../helpers";
import { useShowDropDown } from "../../../../hooks/useShowDropDown";

interface Props extends HTMLAttributes<HTMLDivElement> {
    component_size?: "S" | "M" | "L";
    selected_value: string;
    drop_down_list_child: ReactNode;
}

export const DropDownButtonResultShow: React.FC<Props> = ({
    component_size = "M",
    selected_value,
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
            className={`glare-drop-down-button-result-show glare-drop-down-button-result-show-size-${component_size} ${className}`}
        >
            <section className="glare-drop-down-button-result-show-wrapper">
                <p className="glare-drop-down-button-result-show-label">{selected_value}</p>
                <Button
                    className={isActive ? "glare-drop-down-button-result-show-icon-flip" : ""}
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

export default DropDownButtonResultShow;
