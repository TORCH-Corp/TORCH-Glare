import { InputHTMLAttributes, ReactNode } from "react"
import './style.scss'
import { TableLabel } from "../../../../ui/tableLabel"
import { Datepicker } from "../../../../../../datePickers/datePicker"
import { InputField } from "../../../../../../fields/inputField"
import ButtonField from "../../../../../../fields/buttonField"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    onDateChange?: (date: Date) => void
    name: string
    cellLabel: string
    component_size?: "S" | "M"
    disabled?: boolean
    negative?: boolean
    component_type: "Input-Field" | "Input-DropList" | "Input-Trailing-Label" | "input-date-picker" | "Label-Buttons"
    drop_down?: boolean
    drop_down_list_child?: ReactNode
    trailing_label?: string
    action_button?: ReactNode
    buttons_or_labels_children?: ReactNode | ReactNode[]
}

export const NormalTableCell = (props: Props) => {
    return (
        <td className={`glare-table-cell ${props.className} glare-table-cell-${props.component_size || 'S'}`}>


            {
                <TableLabel  {...props} label={props.cellLabel} style={{ padding: "0 8px" }} component_size={props.component_size || "S"} typo_size='SemiBold' />
            }

            {
                props.component_type == 'input-date-picker' &&
                <Datepicker
                    component_style='presentation'
                    component_size={props.component_size}
                    name={props.name}
                    placeholder="dd/MM/yyyy"
                    onChange={props.onDateChange}
                />
            }

            {
                props.component_type == 'Input-Field' &&
                <InputField
                    {...props}
                    name={props.name} // input name attribute
                    component_size={"S"}
                    disabled={props.disabled}
                    negative={props.negative}
                    type={props.type}
                />
            }

            {
                props.component_type == 'Input-DropList' &&
                <InputField
                    {...props}
                    name={props.name} // input name attribute
                    component_size={"S"}
                    disabled={props.disabled}
                    negative={props.negative}
                    drop_down_list_child={props.drop_down_list_child}
                />
            }

            {
                props.component_type == 'Input-Trailing-Label' &&
                <InputField
                    {...props}
                    name={props.name} // input name attribute
                    component_size={"S"}
                    disabled={props.disabled}
                    negative={props.negative}
                    type={props.type}
                    trailing_label={props.trailing_label}
                />
            }

            {
                props.component_type == 'Label-Buttons' &&
                <ButtonField  {...props}>
                    {props.buttons_or_labels_children}
                </ButtonField>
            }
        </td>
    )
}

