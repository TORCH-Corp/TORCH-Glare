import React, { useState, forwardRef, ForwardedRef, HTMLAttributes } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Calender } from './Calender';
import { Input, Trilling } from './Input';
import { ActionButton } from './ActionButton';
import { Group } from './Input';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface DatePickerProps extends HTMLAttributes<HTMLInputElement> {
    mode?: "single" | "multiple" | "range";
    selected?: Date | Date[] | DateRange | undefined;
    min?: number;
    max?: number;
    size?: "M" | "S";
    showWeekNumber?: boolean;
    captionLayout?: "dropdown" | "label" | "dropdown-months" | "dropdown-years";
    dateFormat?: string;
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
        <Popover>
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
            <PopoverContent className='!h-fit max-h-[fit-content] p-0 border-none rounded-[12px]'>
                <Calender
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
            </PopoverContent>
        </Popover>
    )
});

DatePicker.displayName = "DatePicker";
