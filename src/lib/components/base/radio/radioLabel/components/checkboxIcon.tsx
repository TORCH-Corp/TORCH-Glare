
interface Props {
    fucus: boolean
    selected: boolean
    disabled?: boolean
}
export function CheckboxIcon({ fucus, selected, disabled }: Props) {
    return (
        <span
            className={`check-box-icon-wrapper ${fucus && !selected ? "glare-RadioLabel-focus" : ""} ${disabled ? "glare-RadioLabel-disabled" : ""}`}
        >
            {/* here if the input is checked we will show the check box icon */}
            {selected ? <i className="ri-radio-button-fill"></i> : <span className="check-box-icon"></span>}
        </span>
    )
}
