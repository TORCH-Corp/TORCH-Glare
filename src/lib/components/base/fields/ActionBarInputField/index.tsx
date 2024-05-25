import { InputHTMLAttributes, ReactNode } from "react";
import { InputField } from "../inputField";
import './style.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    negative?: boolean
    drop_down_list_child?: ReactNode
    badges_children?: ReactNode | ReactNode[]
    action_button_children?: ReactNode | ReactNode[]
}

export default function ActionBarInputField(props: Props) {
    return (
        <section className="glare-action-bar-InputField">
            <section className="glare-action-bar-InputField-wrapper">
                <InputField
                    drop_down={true}
                    component_size="M"
                    name={props.name}
                    drop_down_list_child={props.drop_down_list_child}
                    negative={props.negative}
                    badges_children={props.badges_children}
                />
                <section className="buttons-wrapper">
                    {props.action_button_children}
                </section>
            </section>
        </section>
    )
}
