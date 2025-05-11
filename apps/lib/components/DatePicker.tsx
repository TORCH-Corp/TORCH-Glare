import React, {
    useState,
    forwardRef,
    ForwardedRef,
    HTMLAttributes,
    useEffect,
    cloneElement,
    isValidElement,
} from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Calendar } from "./Calendar";
import { ActionButton } from "./ActionButton";
import { DateRange } from "react-day-picker";
import Picker from "torch-react-mobile-picker";

import {
    applyTimeToDateValue,
    formatDateValueToString,
    TimePickerValue,
} from "../utils/dateFormat";
import { InputField } from "./InputField";

export type CalendarProps = React.ComponentProps<typeof Calendar>;

interface DatePickerProps extends HTMLAttributes<HTMLInputElement> {
    mode?: "single" | "multiple" | "range";
    selected?: Date | Date[] | DateRange | undefined;
    min?: number;
    max?: number;
    size?: "M" | "S";
    showWeekNumber?: boolean;
    captionLayout?: "dropdown" | "label" | "dropdown-months" | "dropdown-years";
    dateFormat?: string;
    calendarProps?: CalendarProps;
    timePicker?: boolean;
    value?: any;
}

export const DatePicker = forwardRef(
    (
        {
            size = "M",
            min,
            max,
            mode = "single",
            onChange,
            showWeekNumber = false,
            captionLayout = "dropdown",
            dateFormat = "yyyy/MM/dd",
            calendarProps,
            timePicker = false,
            children,
            value = new Date(),
            ...props
        }: DatePickerProps,
        ref: ForwardedRef<HTMLInputElement>
    ) => {
        const initialDate =
            mode == "multiple"
                ? Array.isArray(value)
                    ? value
                    : [value]
                : mode == "range"
                    ? { from: value, to: value }
                    : value;
        const [date, setDate] = useState<Date[] | Date | DateRange | undefined>(initialDate);
        const [pickerValue, setPickerValue] = useState<TimePickerValue>({
            hour: (date instanceof Date ? date.getHours() : 12).toString(),
            minute: (date instanceof Date ? date.getMinutes() : 0)
                .toString()
                .padStart(2, "0"),
            time: date instanceof Date && date.getHours() < 12 ? "AM" : "PM",
        });
        const [isOpen, setIsOpen] = useState(false);

        // Call the onChange function when the date or picker value changes
        useEffect(() => {
            onChange?.({
                target: {
                    value: date,
                },
            } as any);
        }, [date, pickerValue]);

        // Disable body scroll when popover is open
        useEffect(() => {
            if (isOpen) {
                // Save the current overflow style
                const originalOverflow = document.body.style.overflow;
                document.body.style.overflow = "hidden";

                // Cleanup function to restore original overflow style
                return () => {
                    document.body.style.overflow = originalOverflow;
                };
            }
        }, [isOpen]);
        const formattedValue = formatDateValueToString(
            date,
            pickerValue,
            dateFormat
        );

        return (
            <Popover onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    {/* Clone the children element and pass the formatted value to the input element */}
                    {isValidElement(children) ? (
                        cloneElement(children as React.ReactElement<HTMLInputElement>, {
                            value:
                                (children as React.ReactElement<HTMLInputElement>).props
                                    .value ?? formattedValue,
                            type: "input",
                            readOnly: true,
                        })
                    ) : (
                        /* If the children is not a valid element, Show the default input */
                        <InputField
                            readOnly
                            type="input"
                            childrenSide={
                                <ActionButton type="button" size={"M"}>
                                    <i className="ri-calendar-event-fill"></i>
                                </ActionButton>
                            }
                            {...props}
                            value={formattedValue}
                            ref={ref}
                        />
                    )}
                </PopoverTrigger>
                <PopoverContent
                    data-theme="dark"
                    className="!h-fit max-h-[fit-content] p-0 border-none rounded-[12px] flex flex-col sm:flex-row "
                >
                    <Calendar
                        {...calendarProps}
                        captionLayout={captionLayout}
                        showWeekNumber={showWeekNumber}
                        mode={mode as any}
                        selected={date as any}
                        onSelect={(e: any) => {
                            setDate(applyTimeToDateValue(e, pickerValue));
                        }}
                        min={mode != "single" ? min : undefined}
                        max={mode != "single" ? max : undefined}
                    />
                    {timePicker && (
                        <TimePicker
                            value={pickerValue}
                            onChange={(value: TimePickerValue) => {
                                setPickerValue(value);
                                setDate(applyTimeToDateValue(date, value));
                            }}
                        />
                    )}
                </PopoverContent>
            </Popover>
        );
    }
);

DatePicker.displayName = "DatePicker";

interface TimePickerProps {
    value: TimePickerValue;
    onChange: (value: TimePickerValue) => void;
}

const TimePicker = ({ value, onChange }: TimePickerProps) => {
    return (
        <div className="relative w-full sm:w-[189px]" data-theme="dark">
            <Picker
                className="flex-1"
                selectContainerClassName="bg-background-system-body-tertiary z-[-1] rounded-[8px]"
                value={value}
                onChange={(e: TimePickerValue) => {
                    onChange(e);
                }}
                wheelMode="normal"
            >
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[20px] flex justify-center items-center text-white text-[30px] pr-[55px] pb-[5px]">
                    :
                </span>
                <Picker.Column name="hour">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                        <Picker.Item key={hour + "hour"} value={hour}>
                            <div className="typography-display-small-semibold flex gap-1 whitespace-nowrap text-content-presentation-global-primary pl-[25px]">
                                {" "}
                                <p className="text-content-presentation-global-primary">
                                    {hour}
                                </p>
                            </div>
                        </Picker.Item>
                    ))}
                </Picker.Column>
                <Picker.Column name="minute">
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <Picker.Item key={minute + "minute"} value={minute}>
                            <div className="typography-display-small-semibold text-content-presentation-global-primary">
                                {minute.toString().padStart(2, "0")}
                            </div>
                        </Picker.Item>
                    ))}
                </Picker.Column>
                <Picker.Column name="time">
                    {["AM", "PM"].map((time) => (
                        <Picker.Item key={time + "time"} value={time}>
                            <div className="typography-display-small-semibold text-content-presentation-global-primary pr-[30px]">
                                {time}
                            </div>
                        </Picker.Item>
                    ))}
                </Picker.Column>
            </Picker>
        </div>
    );
};
