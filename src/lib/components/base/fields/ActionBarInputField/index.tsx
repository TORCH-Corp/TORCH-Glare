import React, { forwardRef, InputHTMLAttributes, ReactNode, Ref } from "react";
import { InputField } from "@components/base/fields/inputField";
import "./style.scss";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string; // important to link the input with the labels
  negative?: boolean; // to have negative style
  drop_down_list_child?: ReactNode; // to display the drop down list if you pass it
  badges_children?: ReactNode | ReactNode[]; // to display the badges if you pass it
  action_button_children?: ReactNode | ReactNode[]; // to display the action buttons if you pass it
}

export const ActionBarInputField: React.FC<Props> = forwardRef(
  (
    {
      name,
      negative,
      drop_down_list_child,
      badges_children,
      action_button_children,
      className,
      ...props
    },
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <section
        className={`glare-action-bar-InputField ${className}`}
        style={props.style}
      >
        <section className="glare-action-bar-InputField-wrapper">
          <section className="buttons-wrapper">
            {/* to render the action buttons here */}
            {action_button_children}
          </section>
        </section>
      </section>
    );
  }
);

ActionBarInputField.displayName = "ActionBarInputField";
