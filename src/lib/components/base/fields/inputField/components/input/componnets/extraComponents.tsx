import { Dispatch, ReactNode, SetStateAction } from "react";
import Button from "../../../../../buttons/button";

interface Props {
  drop_down_list_child?: ReactNode; // to add drop down list if you pass it
  action_button?: ReactNode; // to add action button to the end of the input 
  trailing_label?: string; // to add trailing label
  component_size?: "S" | "M" | "L"; // this is used to change the size style of the component
  setIsActive: Dispatch<SetStateAction<boolean>> // to show or hide the drop down list 
  disabled?: boolean // to disable the button if true
}
export function ExtraComponents({
  drop_down_list_child, action_button, trailing_label, setIsActive, component_size, disabled }: Props) {
  return (
    // show action button or drop down list button or trailing label if you pass any of them
    (trailing_label || drop_down_list_child || action_button) && (
      <span className="glare-input-icon">
        {trailing_label && <p className='glare-input-trailingLabel'>{trailing_label}</p>}
        {drop_down_list_child && (
          <Button type='button' onClick={() => setIsActive(true)} component_size={component_size} disabled={disabled} left_icon={<i className="ri-arrow-down-s-line"></i>} />
        )}
        {action_button}
      </span>
    )
  )
}
