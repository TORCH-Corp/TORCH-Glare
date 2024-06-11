import React from 'react';
import './style.scss';

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
    component_size: "S" | "M" | "L";
    typo_size: "SemiBold" | "Regular";
    text_align?: "start" | "center" | "end";
    disabled?: boolean;
    label?: string;
    secondary_label?: string;
}

export const TableLabel: React.FC<Props> = ({
    component_size = "S",
    typo_size = "SemiBold",
    text_align = "start",
    disabled = false,
    label,
    secondary_label,
    className,
    ...restProps
}) => {
    return (
        <section
            {...restProps}
            className={`glare-table-label glare-table-label-${typo_size}-${component_size} ${disabled ? 'glare-table-label-disabled' : ''} glare-table-label-${text_align} ${className}`}
        >
            {label && <p className='glare-table-label-main-label'>{label}</p>}
            {secondary_label && <p className='glare-table-label-second-label'>{secondary_label}</p>}
        </section>
    );
};
