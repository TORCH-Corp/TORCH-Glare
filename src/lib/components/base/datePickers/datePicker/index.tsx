import { useState, forwardRef, ForwardedRef } from "react";
import DatePicker from "react-datepicker";
import "./react-datepicker.scss";

interface Props {
    onChange?: (date: Date) => void; // date change event handlers
    selected?: Date; // selected date
    placeholder: string;
    name: string;
    style?: any
    onBlur?: () => void;
    component_style?: "presentation" | "system"; // this props will change the button style see on figma design file
    onTableCell?: boolean; // to have anther sizes for tables when this component in table cell
    component_size?: "S" | "M" | "L"; // this props will change the button style size see on figma design file
}

export const Datepicker = forwardRef((props: Props, ref: ForwardedRef<any>) => {

    const [startDate, setStartDate] = useState<Date>(props.selected || new Date());
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <section
            style={props.style}
            className={`w-full glare-date-picker glare-date-picker-${props.component_size || "S"} glare-date-picker-${props.component_style} ${focus && 'show-datepicker-icon'} ${props.onTableCell && "glare-date-picker-on-table-cell"}`}
        >
            <DatePicker
                selected={startDate}
                onChange={(date: Date) => {
                    setStartDate(date);
                    if (props.onChange) props.onChange(date);
                }}
                onBlur={() => {
                    setFocus(false);
                    if (props.onBlur) props.onBlur();
                }}
                onFocus={() => setFocus(true)}
                showYearDropdown
                showMonthDropdown
                name={props.name}
                placeholderText={props.placeholder}
                dateFormat="dd/MM/yyyy"
                ref={ref} // Forward the ref
            />

            {/* date picker default icon */}
            <span className="glare-date-picker-icon"><i className="ri-calendar-2-line"></i></span>
        </section>
    );
});

