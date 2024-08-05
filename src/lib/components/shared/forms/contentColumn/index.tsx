import { HTMLAttributes } from 'react';
import { Alert } from '@components/base/alerts/alert';
import './style.scss';
import { Label } from '@components/base/labels/label';

interface Props extends HTMLAttributes<HTMLDivElement> {
    component_label: string // this is the label of the component
    secondary_label?: string // this is the secondary style label
    required_label?: string // this is the required style label
    warning_label?: string // this is the warning component label
    error_label?: string // this is the error component label
    component_size?: "S" | "M" | "L"; // this is used to change the size style of the component
    name: string // this important to link the component
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
                {/* this for the primary label and required label if any of them exist */}
                <Label
                    label={component_label}
                    required_label={required_label}
                    component_size={component_size}
                    component_style='horizontal'
                    name={name}
                />
                {/* this only for the secondary label if it exist */}
                {
                    secondary_label ?
                        <Label
                            secondary_label={secondary_label}
                            className='content-column-required-label'
                            component_size={component_size}
                            name={name}
                        />
                        : null
                }

            </section>

            {/* show the warning and error components if the props not null */}
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
