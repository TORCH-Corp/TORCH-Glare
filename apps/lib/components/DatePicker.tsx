import React, { useState, forwardRef, ForwardedRef, HTMLAttributes, useEffect, cloneElement, isValidElement } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Calender } from './Calender';
import { Input, Trilling } from './Input';
import { ActionButton } from './ActionButton';
import { Group } from './Input'; import { DateRange } from 'react-day-picker';
import Picker from 'torch-react-mobile-picker';
// Define PickerValue type directly to avoid the type import issue
type PickerValue = {
    hour: string;
    minute: string;
    time: string;
};
import { applyTimeToDateValue, formatDateValueToString } from '../utils/dateFormat';

export type CalendarProps = React.ComponentProps<typeof Calender>

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
}

export const DatePicker = forwardRef(({
    size = "M",
    min,
    max,
    selected,
    mode = "single",
    onChange,
    showWeekNumber = false,
    captionLayout = "dropdown",
    dateFormat = "yyyy/MM/dd hh:mm a",
    calendarProps,
    timePicker = false,
    children,
    ...props
}: DatePickerProps, ref: ForwardedRef<HTMLInputElement>) => {

    const fallbackDate = mode == "multiple" ? [new Date()] : mode == "range" ? { from: new Date(), to: new Date() } : new Date();
    const [date, setDate] = useState<Date[] | Date | DateRange | undefined>(selected || fallbackDate);
    const [pickerValue, setPickerValue] = useState<PickerValue>({
        hour: "12",
        minute: "00",
        time: "AM"
    });

    useEffect(() => {
        onChange?.({
            target: {
                value: date
            }
        } as any);
    }, [date, pickerValue]);

    const formattedValue = formatDateValueToString(date, pickerValue, dateFormat);

    return (
        <Popover>
            <PopoverTrigger asChild >
                {
                    <Group size={"M"}>
                        <Input {...props} value={formattedValue} ref={ref} />
                        <Trilling>
                            <ActionButton type='button' size={"M"}>
                                <i className="ri-calendar-event-fill"></i>
                            </ActionButton>
                        </Trilling>
                    </Group>
                }

            </PopoverTrigger >
            <PopoverContent data-theme="dark" className='!h-fit max-h-[fit-content] p-0 border-none rounded-[12px] flex flex-col sm:flex-row'>
                <Calender
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
                        onChange={(value: PickerValue) => {
                            setPickerValue(value);
                            setDate(applyTimeToDateValue(date, value));
                        }}
                    />
                )}
            </PopoverContent>
        </Popover>
    )
});

DatePicker.displayName = "DatePicker";



interface TimePickerProps {
    value: PickerValue;
    onChange: (value: PickerValue) => void;
}

const TimePicker = ({ value, onChange }: TimePickerProps) => {
    return (
        <div className='relative w-full sm:w-[189px]'>
            <Picker
                className="flex-1"
                selectContainerClassName="bg-background-system-body-tertiary z-[-1] rounded-[8px]"
                value={value}
                onChange={(e: PickerValue) => {
                    onChange(e);
                }}
                wheelMode="normal"
            >
                <span className='absolute left-0 top-1/2 -translate-y-1/2 w-full h-[20px] flex justify-center items-center text-white text-[30px] pr-[55px] pb-[5px]' >:</span>
                <Picker.Column name="hour">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                        <Picker.Item key={hour + "hour"} value={hour}>
                            <div className="typography-display-small-semibold flex gap-1 whitespace-nowrap text-content-presentation-global-primary pl-[25px]"> <p className='text-content-presentation-global-primary'>{hour}</p></div>
                        </Picker.Item>
                    ))}
                </Picker.Column>
                <Picker.Column name="minute">
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                        <Picker.Item key={minute + "minute"} value={minute}>
                            <div className="typography-display-small-semibold text-content-presentation-global-primary">
                                {minute.toString().padStart(2, '0')}
                            </div>
                        </Picker.Item>
                    ))}
                </Picker.Column>
                <Picker.Column name="time">
                    {["AM", "PM"].map((time) => (
                        <Picker.Item key={time + "time"} value={time}>
                            <div className="typography-display-small-semibold text-content-presentation-global-primary pr-[30px]">{time}</div>
                        </Picker.Item>
                    ))}
                </Picker.Column>
            </Picker>
        </div>
    )
}
