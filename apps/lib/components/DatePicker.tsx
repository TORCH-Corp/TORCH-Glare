import React, { useState, forwardRef, ForwardedRef, HTMLAttributes } from 'react';
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
    dateFormat = "yyyy/MM/dd",
    calendarProps,
    ...props
}: DatePickerProps, ref: ForwardedRef<HTMLInputElement>) => {

    const [date, setDate] = useState<Date[] | Date | DateRange | undefined>(selected);

    const mapDate = () => {
        if (Array.isArray(date)) {
            return date.map(d => format(d, dateFormat)).join(' - ');
        }
        if (date && 'from' in date) {
            const fromStr = date.from ? format(date.from, dateFormat) : '';
            const toStr = date.to ? format(date.to, dateFormat) : '';
            return fromStr && toStr ? `${fromStr} - ${toStr}` : fromStr || toStr;
        }
        return date ? format(date as Date, dateFormat) : "";
    }

    return (
        <Popover open>
            <PopoverTrigger asChild >
                <Group size={size}>
                    <Input{...props} value={mapDate()} ref={ref} />
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
                        setDate(Array.isArray(e) ? [...e] : e);
                        onChange?.({
                            target: {
                                value: e
                            }
                        } as any);
                    }}
                    min={mode != "single" ? min : undefined}
                    max={mode != "single" ? max : undefined}
                />
                <TimePicker />
            </PopoverContent>
        </Popover>
    )
});

DatePicker.displayName = "DatePicker";




const TimePicker = () => {
    const [pickerValue, setPickerValue] = useState<PickerValue>({
        hour: "12",
        minute: "00",
        time: "AM"
    });

    return (
        <div className='relative w-full sm:w-[189px]'>
            <Picker
                className="flex-1"
                selectContainerClassName="bg-background-system-body-tertiary z-[-1] rounded-[8px]"
                value={pickerValue}
                onChange={(e: PickerValue) => {
                    setPickerValue(e);
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