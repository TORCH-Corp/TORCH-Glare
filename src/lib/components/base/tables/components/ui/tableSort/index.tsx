import React from 'react';
import './style.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    sort_direction: "UP" | "DOWN" | "Default";
    component_size?: "S" | "M" | "L";
}

export const TableSort: React.FC<Props> = ({
    sort_direction,
    component_size = "S",
    className,
    ...props
}) => {
    return (
        <span {...props} className={`glare-TableSort glare-CellSizingLine-${component_size} ${className}`}>
            <span className={`glare-CellSizingLine-icons ${sort_direction === 'Default' ? "glare-CellSizingLine-not-active" : ""}`}>
                {sort_direction === "UP" ? (
                    <i className="ri-arrow-up-line"></i>
                ) : sort_direction === 'DOWN' ? (
                    <i className="ri-arrow-down-line"></i>
                ) : (
                    <i className="ri-arrow-up-down-line"></i>
                )}
            </span>
        </span>
    );
};
