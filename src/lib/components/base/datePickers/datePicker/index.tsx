import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "./react-datepicker.scss";

interface Props {
    onChange?: (date: Date) => void;
    selected?: Date
    placeholder: string
    name: string
    onBlur?: () => void
    component_style?: "presentation" | "system"
    onTableCell?: boolean
    component_size?: "S" | "M" | "L"
}
export const Datepicker = (props: Props) => {

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [fucus, setFucus] = useState<boolean>(false);

    return (
        <section className={`w-full glare-date-picker glare-date-picker-${props.component_size} glare-date-picker-${props.component_style} ${fucus && 'show-datepicker-icon'} ${props.onTableCell && "glare-date-picker-on-table-cell"}`}>
            <DatePicker
                selected={startDate}
                onChange={(date: any) => {
                    setStartDate(date)
                    if (props.onChange !== undefined) props.onChange(date)
                }}
                onBlur={() => {
                    setFucus(false)
                    props.onBlur && props.onBlur()
                }}
                onFocus={() => setFucus(true)}
                showYearDropdown
                showMonthDropdown
                name={props.name}
                placeholderText={props.placeholder}
                dateFormat="dd/MM/yyyy"
            />

            <span className="glare-date-picker-icon"><i className="ri-calendar-2-line"></i></span>
        </section>
    );
};