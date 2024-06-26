import React, { HTMLAttributes, ReactNode, useRef } from "react";
import './style.scss';
import Button from "../../buttons/button";
import { DynamicContainer } from "../../../helpers/dynamicContainer";
import { useShowDropDown } from "../../../../hooks/useShowDropDown";

interface Props extends HTMLAttributes<HTMLDivElement> {
    component_size?: "S" | "M" | "L"; // this props will change the button style size see on figma design file
    selected_value: string; // this will show selected value if you pass it
    drop_down_list_child: ReactNode; // this will show drop down list if you pass it
}

export const DropDownButtonResultShow: React.FC<Props> = ({
    component_size = "M",
    selected_value,
    drop_down_list_child,
    className,
    ...props
}) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    // this hook will detect user events and show or hide the drop down list
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
                    // the button icon will flip when you click on the button
                    className={isActive ? "glare-drop-down-button-result-show-icon-flip" : ""}
                    component_size={component_size}
                    left_icon={<i className="ri-arrow-down-s-line"></i>}
                />
            </section>

            {/* this dynamic container will show the drop down list when you click on the button. 
                this dynamic container will detect the hit the viewport and change the direction.*/
            }
            <DynamicContainer active={isActive}>
                {drop_down_list_child}
            </DynamicContainer>
        </section>
    );
};

export default DropDownButtonResultShow;
