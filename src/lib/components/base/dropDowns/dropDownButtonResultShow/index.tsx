import { HTMLAttributes, ReactNode, useRef } from "react"
import './style.scss'
import { Button } from "../.."
import { DynamicContainer } from "../../../helpers"
import { useShowDropDown } from "../../../../hooks/useShowDropDown"

interface Props extends HTMLAttributes<HTMLDivElement> {
    component_size?: "S" | "M" | "L"
    selected_value: string
    drop_down_list_child: ReactNode
}

export const DropDownButtonResultShow = (props: Props) => {

    const sectionRef = useRef<any>(null)
    const { isActive } = useShowDropDown(sectionRef)

    return (
        <section {...props} ref={sectionRef} className={`glare-drop-down-button-result-show  glare-drop-down-button-result-show-size-${props.component_size}`}>
            <section className="glare-drop-down-button-result-show-wrapper">
                <p className="glare-drop-down-button-result-show-label">{props.selected_value}</p>
                <Button className={isActive ? "glare-drop-down-button-result-show-icon-flip" : ""} component_size={props.component_size} left_icon={<i className="ri-arrow-down-s-line"></i>} />
            </section>
            <DynamicContainer active={isActive}>
                {props.drop_down_list_child}
            </DynamicContainer>
        </section>
    )
}


