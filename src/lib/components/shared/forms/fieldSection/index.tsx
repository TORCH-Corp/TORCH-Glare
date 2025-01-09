import { HTMLAttributes, ReactNode } from "react";
import './style.scss'


interface Props extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    mainLabel?: ReactNode
    secondaryLabel?: ReactNode
}

export function FieldSection({
    children,
    mainLabel,
    secondaryLabel,
    ...props
}: Props) {

    return (
        <section className="glare-field-section" {...props}>
            <section>

            </section>

            <section className="glare-field-section-input-wrapper">
                {children}
            </section>
        </section>
    )
}
