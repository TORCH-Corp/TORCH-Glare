import React, { HTMLAttributes, ReactNode, useRef } from "react";
import './style.scss';
import { useShowDropDown } from "@hooks/useShowDropDown";
import { DynamicContainer } from "@components/helpers";
import { LabelAndButton } from "./components/labelAndButton";

interface Props extends HTMLAttributes<HTMLDivElement> {
    component_size?: "S" | "M" | "L"; // this props will change the button style size see on figma design file
    component_label: string;
    drop_down_list_child: ReactNode; // this will show drop down list if you pass it
}

export const DropDownButton: React.FC<Props> = ({
    component_size = "M",
    component_label,
    drop_down_list_child,
    className,
    ...props
}) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    // this hook will show or hide the drop down list
    const { isActive } = useShowDropDown(sectionRef);

    return (
        <section
            {...props}
            ref={sectionRef}
            className={`glare-drop-down-button glare-drop-down-button-size-${component_size} ${className}`}
        >
            <LabelAndButton component_size={component_size} component_label={component_label} isActive={isActive} />
            {/* this dynamic container will show the drop down list when you click on the button. 
                this dynamic container will detect the hit the viewport and change the direction.*/}
            <DynamicContainer style={{ width: sectionRef.current ? sectionRef.current?.offsetWidth * 1.4 : "100%" }} active={isActive} >
                {drop_down_list_child}
            </DynamicContainer>
        </section>
    );
};

export default DropDownButton;
