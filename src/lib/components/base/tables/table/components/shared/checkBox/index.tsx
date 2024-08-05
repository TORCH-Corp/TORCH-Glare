import { InputHTMLAttributes, ForwardedRef, forwardRef } from 'react';
import { CellSizingLine } from '../../../../components/ui/cellSizingLine';
import './style.scss';
import { CheckboxLabel } from '@components/base/checkBoxes/checkboxLabel';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    forSubTable: boolean;
}

// Using forwardRef to pass refs down to the input element
export const CheckBox = forwardRef<HTMLInputElement, Props>(({
    forSubTable,
    ...props
}, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <section className={`table-button-checkbox`} dir='ltr'>
            {!forSubTable && <CellSizingLine noneSizing={true} className='table-button-checkbox-left-line' />}
            <CheckboxLabel {...props} ref={ref} check_box_name="table-check-box" />
            {!forSubTable && <CellSizingLine noneSizing={true} className='table-button-checkbox-right-line' />}
        </section>
    );
});
