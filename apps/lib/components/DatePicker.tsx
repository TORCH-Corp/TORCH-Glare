import React, { useState, forwardRef, ForwardedRef, HTMLAttributes } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Calender } from './Calender';
import { Input, Trilling } from './Input';
import { ActionButton } from './ActionButton';
import { Group } from './Input';

interface DatePickerProps extends HTMLAttributes<HTMLInputElement> {
    mode?: "single" | "multiple";
    selected?: Date | Date[] | undefined;
    min?: number;
    max?: number;
    onChange?: (e: any) => void;
    size?: "M" | "S";
    showWeekNumber?: boolean;
    captionLayout?: "dropdown" | "label" | "dropdown-months" | "dropdown-years";
}

export const DatePicker = forwardRef(({
    size = "M",
    min,
    max,
    selected,
    mode = "multiple",
    onChange,
    showWeekNumber = false,
    captionLayout = "dropdown",
    ...props
}: DatePickerProps, ref: ForwardedRef<HTMLInputElement>) => {

    const [date, setDate] = useState<Date[] | Date | undefined>(selected);

    const mapDate = (date: Date | Date[] | undefined) => {
        if (Array.isArray(date)) {
            return date.map(d => d.toLocaleDateString());
        }
        return date?.toLocaleDateString();
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
            <PopoverContent className='!h-fit max-h-[fit-content] p-0 border-none rounded-[12px]'>
                <Calender
                    captionLayout={captionLayout}
                    showWeekNumber={showWeekNumber}
                    mode={mode as any}
                    selected={date as Date | Date[]}
                    onSelect={(e: any) => {
                        setDate(Array.isArray(e) ? [...e] : e);
                        onChange?.({
                            target: {
                                value: e
                            }
                        } as any);
                    }}
                    min={min}
                    max={max}
                />
            </PopoverContent>
        </Popover>
    )
});

DatePicker.displayName = "DatePicker";
