import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export type TimePickerValue = {
    hour: string
    minute: string
    time: string
}

/**
 * Applies time from a picker value to a given date object
 * @param {Date} date - The base date to apply time to
 * @param {TimePickerValue} TimePickerValue - Object containing hour, minute, and time period (AM/PM)
 * @returns {Date} A new Date object with the applied time
 */
export const applyTimeToDate = (date: Date, TimePickerValue: TimePickerValue): Date => {
    const newDate = new Date(date);
    let hours = parseInt(String(TimePickerValue.hour));

    // Convert to 24-hour format
    if (TimePickerValue.time === "PM" && hours < 12) {
        hours += 12;
    } else if (TimePickerValue.time === "AM" && hours === 12) {
        hours = 0;
    }

    newDate.setHours(hours);
    newDate.setMinutes(parseInt(String(TimePickerValue.minute)));
    return newDate;
};

/**
 * Validates if a given value is a valid Date object
 * @param {Date} date - The date to validate
 * @returns {boolean} True if the value is a valid Date object, false otherwise
 */
export const isValidDateObject = (date: Date): boolean => date instanceof Date && !isNaN(date.getTime());

/**
 * Applies time from a picker value to various date value types
 * @param {Date | Date[] | DateRange | undefined} dateValue - The date value to apply time to
 * @param {TimePickerValue} TimePickerValue - Object containing hour, minute, and time period (AM/PM)
 * @returns {Date | Date[] | DateRange | undefined} The date value with applied time, or undefined if invalid
 */
export const applyTimeToDateValue = (dateValue: Date | Date[] | DateRange | undefined, TimePickerValue: TimePickerValue): Date | Date[] | DateRange | undefined => {
    if (!dateValue) return undefined;

    // Handle array of dates
    if (Array.isArray(dateValue)) {
        return dateValue.filter(isValidDateObject).map(date => applyTimeToDate(date, TimePickerValue));
    }

    // Handle date range
    if (dateValue && 'from' in dateValue) {
        const from = dateValue.from && isValidDateObject(dateValue.from as Date)
            ? applyTimeToDate(dateValue.from as Date, TimePickerValue)
            : undefined;
        const to = dateValue.to && isValidDateObject(dateValue.to as Date)
            ? applyTimeToDate(dateValue.to as Date, TimePickerValue)
            : undefined;
        return { from, to };
    }

    // Handle single date
    return isValidDateObject(dateValue as Date)
        ? applyTimeToDate(dateValue as Date, TimePickerValue)
        : undefined;
};

/**
 * Formats a date value to a string based on the provided format
 * @param {Date | Date[] | DateRange | undefined} date - The date value to format
 * @param {TimePickerValue} TimePickerValue - Object containing hour, minute, and time period (AM/PM)
 * @param {string} dateFormat - The format string to use for formatting (e.g., 'MM/dd/yyyy')
 * @returns {string} Formatted date string, or empty string if date is undefined
 */
export const formatDateValueToString = (date: Date | Date[] | DateRange | undefined, TimePickerValue: TimePickerValue, dateFormat: string): string => {
    if (!date) return '';

    // Handle array of dates
    if (Array.isArray(date)) {
        return date.map(d => format(applyTimeToDate(d, TimePickerValue), dateFormat)).join(', ');
    }

    // Handle date range
    if ('from' in date) {
        const from = date.from
            ? format(applyTimeToDate(date.from as Date, TimePickerValue), dateFormat)
            : '';
        const to = date.to
            ? format(applyTimeToDate(date.to as Date, TimePickerValue), dateFormat)
            : '';
        return from && to ? `${from} - ${to}` : from || to;
    }

    // Handle single date
    return format(applyTimeToDate(date as Date, TimePickerValue), dateFormat);
};
