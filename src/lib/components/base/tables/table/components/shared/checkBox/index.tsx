import { InputHTMLAttributes } from 'react'
import { CheckboxLabel } from '../../../../..'
import { CellSizingLine } from '../../../../components/ui/cellSizingLine'
import './style.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    forSubTable: boolean
    Ref?: any
}
export const CheckBox = (props: Props) => {
    return (
        <section className={`table-button-checkbox `} dir='ltr'>
            {!props.forSubTable && <CellSizingLine noneSizing={true} className='table-button-checkbox-left-line' />}
            <CheckboxLabel  {...props} ref={props.Ref} check_box_name="table-check-box" />
            {!props.forSubTable && <CellSizingLine noneSizing={true} className='table-button-checkbox-right-line' />}
        </section>
    )
}

