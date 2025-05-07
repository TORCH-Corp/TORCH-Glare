import React, { useState, forwardRef, ForwardedRef, HTMLAttributes, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Calender } from './Calender';
import { Input, Trilling } from './Input';
import { ActionButton } from './ActionButton';
import { Group } from './Input';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import Picker, { PickerValue } from '../hooks/MobileSlidePicker';

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
    ...props
}: DatePickerProps, ref: ForwardedRef<HTMLInputElement>) => {

    const fallbackDate = mode == "multiple" ? [new Date()] : mode == "range" ? {from: new Date(), to: new Date()} : new Date();
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
    }, [date,pickerValue]);

    const catchTime = (date: Date) => {
        const newDate = new Date(date);
        let hours = parseInt(String(pickerValue.hour));
        // Convert to 24-hour format if PM
        if (pickerValue.time === "PM" && hours < 12) {
            hours += 12;
        } else if (pickerValue.time === "AM" && hours === 12) {
            // 12 AM should be 0 in 24-hour format
            hours = 0;
        }
        newDate.setHours(hours);
        newDate.setMinutes(parseInt(String(pickerValue.minute)));
        return newDate;
    }

    const injectTime = (e: Date[] | Date | DateRange | undefined) : Date[] | Date | DateRange | undefined => {
        const isValidDate = (d: Date) => d instanceof Date && !isNaN(d.getTime());
        
        if (!e) return undefined;
        
        if (Array.isArray(e)) {
            return e.filter(d => isValidDate(d)).map(d => catchTime(d));
        }
        if (e && 'from' in e) {
            const from = e.from && isValidDate(e.from) ? catchTime(e.from as Date) : undefined;
            const to = e.to && isValidDate(e.to) ? catchTime(e.to as Date) : undefined;
            return { from, to };
        }
        return isValidDate(e as Date) ? catchTime(e as Date) : undefined;
    }

    const mapDate = (date: Date | Date[] | DateRange | undefined) => {
        if (!date) return '';
        if (Array.isArray(date)) {
            return date.map(d => format(catchTime(d), dateFormat)).join(', ');
        }
        if ('from' in date) {
            const from = date.from ? format(catchTime(date.from), dateFormat) : '';
            const to = date.to ? format(catchTime(date.to), dateFormat) : '';
            return `${from} - ${to}`;
        }
        return format(catchTime(date), dateFormat);
    }

    return (
        <Popover>
            <PopoverTrigger asChild >
                <Group size={size}>
                    <Input{...props} value={mapDate(date)} ref={ref} />
                    <Trilling>
                        <ActionButton type='button' size={size == "M" ? "M" : "S"}>
                            <i className="ri-calendar-event-fill"></i>
                        </ActionButton>
                    </Trilling>
                </Group>
            </PopoverTrigger>
            <PopoverContent className='!h-fit max-h-[fit-content] p-0 border-none rounded-[12px] flex flex-col sm:flex-row'>
                <Calender
                    {...calendarProps}
                    captionLayout={captionLayout}
                    showWeekNumber={showWeekNumber}
                    mode={mode as any}
                    selected={date as any}
                    onSelect={(e: any) => {
                        setDate(injectTime(e));
                    }}
                    min={mode != "single" ? min : undefined}
                    max={mode != "single" ? max : undefined}
                />
                {timePicker && (
                    <TimePicker
                        value={pickerValue}
                        onChange={(value: PickerValue) => {
                            setPickerValue(value);
                            setDate(injectTime(date))
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
                wheelMode=""
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