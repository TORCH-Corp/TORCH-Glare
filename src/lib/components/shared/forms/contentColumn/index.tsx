import { HTMLAttributes } from 'react';
import { Alert } from '../../../../components/base/alerts/alert';
import './style.scss';
import { Label } from '../../../base/labels/label';

interface Props extends HTMLAttributes<HTMLDivElement> {
    component_label: string
    secondary_label?: string
    required_label?: string
    warning_label?: string
    error_label?: string
    component_size?: "S" | "M" | "L";
    name: string

}
export function ContentColumn({
    component_label,
    secondary_label,
    warning_label,
    required_label,
    error_label,
    component_size,
    name,
    ...props
}: Props) {
    return (
        <section {...props} className={`content-column content-column-size-${component_size ? component_size : "S"}`}>
            <section className='content-column-labels'>
                <Label
                    label={component_label}
                    secondary_label={secondary_label}
                    component_size={component_size}
                    component_style='vertical'
                    name={name}
                />
                <Label
                    required_label={required_label}
                    component_size={component_size}
                    name={name}
                />
            </section>

            {warning_label || error_label ?
                <section className='content-column-wrapper'>
                    {warning_label ? <Alert component_label={warning_label} component_state={'Warning'} /> : null}
                    {error_label ? <Alert component_label={error_label} component_state={'Error'} /> : null}
                </section>
                :
                null
            }

        </section>
    )
}
