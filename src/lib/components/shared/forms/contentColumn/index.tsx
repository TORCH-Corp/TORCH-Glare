import { HTMLAttributes } from 'react';
import { Alert } from '../../../../components/base/alerts/alert';
import './style.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
    component_label: string
    component_subLabel?: string
    warning_label?: string
    error_label?: string
}
export function ContentColumn({
    component_label,
    component_subLabel,
    warning_label,
    error_label,
    ...props
}: Props) {
    return (
        <section {...props} className='content-column'>
            <p className='content-column-label'>{component_label}</p>
            <section className='content-column-wrapper'>
                {component_subLabel && <p className='content-column-sub-label'>{component_subLabel}</p>}
                {warning_label ? <Alert component_label={warning_label} component_state={'Warning'} /> : null}
                {error_label ? <Alert component_label={error_label} component_state={'Error'} /> : null}
            </section>
        </section>
    )
}
