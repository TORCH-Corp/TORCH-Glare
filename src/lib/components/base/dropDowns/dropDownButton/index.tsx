import { HTMLAttributes, ReactNode, useRef } from "react"
import './style.scss'
import { Button } from "../../main"
import { useShowDropDown } from "../../../../hooks/useShowDropDown"
import { DynamicContainer } from "../../../helpers"

interface Props extends HTMLAttributes<HTMLDivElement> {
    component_size?: "S" | "M" | "L"
    component_label: string
    drop_down_list_child: ReactNode
}

export const DropDownButton = (props: Props) => {

    const sectionRef = useRef<any>(null)
    const { isActive } = useShowDropDown(sectionRef)

    return (
        <section {...props} ref={sectionRef} className={`glare-drop-down-button  glare-drop-down-button-size-${props.component_size}`}>
            <section className="glare-drop-down-button-wrapper">
                <p className="glare-drop-down-button-label">{props.component_label}</p>
                <Button className={isActive ? "glare-drop-down-button-icon-flip" : ""} component_size={props.component_size} left_icon={<i className="ri-arrow-down-s-line"></i>} />
            </section>
            <DynamicContainer active={isActive}>
                {props.drop_down_list_child}
            </DynamicContainer>
        </section>
    )
}


