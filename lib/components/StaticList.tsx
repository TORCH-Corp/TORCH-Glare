import { HTMLAttributes, ReactNode } from 'react'
import { Checkbox } from './CheckboxLabel'
import { Radio } from './RadioLabel'


interface Props extends HTMLAttributes<HTMLUListElement> {

}

export const StaticList = (props: Props) => {
    return (
        <ul {...props} className='w-full overflow-hidden flex flex-col rounded-[6px] p-[10px] bg-background-presentation-form-field-primary gap-[10px]'>

        </ul>
    )
}

interface ItemProps extends HTMLAttributes<HTMLLIElement> {
    label?: ReactNode
    type?: "checkbox" | "radio"
}

export const StaticListItem = ({ type, label, ...props }: ItemProps) => {
    return (
        <li {...props} className='w-full flex  items-center justify-center gap-2 overflow-hidden'>
            {type === "checkbox" && <Checkbox checked size='M' />}
            {type === "radio" && < Radio checked size='S' />}
            <div className='typography-body-medium-semibold text-content-presentation-global-primary w-full whitespace-nowrap text-ellipsis overflow-hidden'>{label}</div>
            {props.children}
        </li>
    )
}


export const StaticListDivider = () => {
    return (
        <div className='w-full h-[1px] bg-border-presentation-global-primary'></div>
    )
}



