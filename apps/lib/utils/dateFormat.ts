import { PickerValue } from "../hooks/MobileSlidePicker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

// Date utility functions
export const applyTimeToDate = (date: Date, pickerValue: PickerValue): Date => {
    const newDate = new Date(date);
    let hours = parseInt(String(pickerValue.hour));
    
    // Convert to 24-hour format
    if (pickerValue.time === "PM" && hours < 12) {
        hours += 12;
    } else if (pickerValue.time === "AM" && hours === 12) {
        hours = 0;
    }
    
    newDate.setHours(hours);
    newDate.setMinutes(parseInt(String(pickerValue.minute)));
    return newDate;
};

export const isValidDateObject = (date: Date): boolean => date instanceof Date && !isNaN(date.getTime());

export const applyTimeToDateValue = (dateValue: Date | Date[] | DateRange | undefined, pickerValue: PickerValue): Date | Date[] | DateRange | undefined => {
    if (!dateValue) return undefined;
    
    if (Array.isArray(dateValue)) {
        return dateValue.filter(isValidDateObject).map(date => applyTimeToDate(date, pickerValue));
    }
    
    if (dateValue && 'from' in dateValue) {
        const from = dateValue.from && isValidDateObject(dateValue.from as Date) 
            ? applyTimeToDate(dateValue.from as Date, pickerValue) 
            : undefined;
        const to = dateValue.to && isValidDateObject(dateValue.to as Date) 
            ? applyTimeToDate(dateValue.to as Date, pickerValue) 
            : undefined;
        return { from, to };
    }
    
    return isValidDateObject(dateValue as Date) 
        ? applyTimeToDate(dateValue as Date, pickerValue) 
        : undefined;
};

export const formatDateValueToString = (date: Date | Date[] | DateRange | undefined, pickerValue: PickerValue, dateFormat: string): string => {
    if (!date) return '';
    
    if (Array.isArray(date)) {
        return date.map(d => format(applyTimeToDate(d, pickerValue), dateFormat)).join(', ');
    }
    
    if ('from' in date) {
        const from = date.from 
            ? format(applyTimeToDate(date.from as Date, pickerValue), dateFormat) 
            : '';
        const to = date.to 
            ? format(applyTimeToDate(date.to as Date, pickerValue), dateFormat) 
            : '';
        return from && to ? `${from} - ${to}` : from || to;
    }
    
    return format(applyTimeToDate(date as Date, pickerValue), dateFormat);
};
