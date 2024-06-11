import React, { forwardRef, InputHTMLAttributes, ReactNode, Ref } from "react";
import { InputField } from "../inputField";
import './style.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    negative?: boolean;
    drop_down_list_child?: ReactNode;
    badges_children?: ReactNode | ReactNode[];
    action_button_children?: ReactNode | ReactNode[];
}

export const ActionBarInputField: React.FC<Props> = forwardRef((
    { name, negative, drop_down_list_child, badges_children, action_button_children, className, ...props },
    ref: Ref<HTMLInputElement>
) => {
    return (
        <section className={`glare-action-bar-InputField ${className}`}>
            <section className="glare-action-bar-InputField-wrapper">
                <InputField
                    {...props}
                    ref={ref} // Pass the ref to InputField
                    component_size="M"
                    name={name}
                    drop_down_list_child={drop_down_list_child}
                    negative={negative}
                    badges_children={badges_children}
                />
                <section className="buttons-wrapper">
                    {action_button_children}
                </section>
            </section>
        </section>
    );
});

ActionBarInputField.displayName = 'ActionBarInputField';


