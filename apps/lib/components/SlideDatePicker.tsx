import { cloneElement, ComponentProps, forwardRef, isValidElement, useState, useEffect, useRef } from 'react';
import { getDaysInMonth } from 'date-fns';
import Picker from 'torch-react-mobile-picker';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { InputField } from './InputField';
import { ActionButton } from './ActionButton';
import { formatDateValueToString } from '../utils/dateFormat';

function getDayArray(year: number, month: number): string[] {
  const dayCount = getDaysInMonth(new Date(year, month - 1));
  return Array.from({ length: dayCount }, (_, i) => String(i + 1).padStart(2, '0'));
}

interface SlideDatePickerProps extends Omit<ComponentProps<typeof InputField>, 'onChange'> {
  onChange?: (e: any) => void;
  theme?: "dark" | "light" | "default";
  dateFormat?: string;
  value?: any;
}

type SlideValues = {
  year: string,
  month: string,
  day: string,
  hour?: string,
  minute?: string,
  time?: string
}

export const SlideDatePicker = forwardRef<HTMLInputElement, SlideDatePickerProps>((
  {
    theme = "dark",
    onChange,
    dateFormat = "yyyy/MM/dd",
    children,
    value = new Date(),
    ...props
  }, forwardedRef) => {

  const today = value
  const defaultPickerValue = {
    year: String(today.getFullYear()),
    month: String(today.getMonth() + 1),
    day: String(today.getDate()),
    hour: String(today.getHours()),
    minute: String(today.getMinutes()),
    time: today.getHours() < 12 ? "AM" : "PM"
  };

  const [pickerValue, setPickerValue] = useState<SlideValues>(defaultPickerValue);
  const [date, setDate] = useState<Date>(value);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 200 }, (_, i) => `${currentYear - 100 + i}`);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, ''));
  const days = getDayArray(Number(pickerValue.year), Number(pickerValue.month));
  const monthsNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handlePickerChange = (newValue: SlideValues, key: string) => {
    let { year, month, day, hour, minute, time } = newValue;

    if (key === 'year' || key === 'month') {
      const newDayArray = getDayArray(Number(year), Number(month));
      day = newDayArray.includes(day as string) ? day : newDayArray[newDayArray.length - 1];
    }

    const updatedValue = { year, month, day, hour, minute, time };
    setPickerValue(updatedValue);

    // Create a Date object from the updated value
    const newDate = new Date(
      Number(updatedValue.year),
      Number(updatedValue.month) - 1, // Month is 0-indexed in JavaScript Date
      Number(updatedValue.day)
    );
    setDate(newDate);

    // Call the onChange callback with the Date object
    if (onChange) {
      onChange({
        target: {
          value: newDate
        }
      } as any);
    }
  };

  const formattedValue = formatDateValueToString(date, {
    hour: pickerValue.hour ?? defaultPickerValue.hour,
    minute: pickerValue.minute ?? defaultPickerValue.minute,
    time: pickerValue.time ?? defaultPickerValue.time
  }, dateFormat);

  // Disable body scroll when popover is open
  useEffect(() => {
    if (isOpen) {
      // Save the current overflow style
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Cleanup function to restore original overflow style
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (onChange) {
      onChange({
        target: {
          value: date
        }
      } as any);
    }
  }, [formattedValue]);

  return (
    <Popover onOpenChange={setIsOpen}>
      <PopoverTrigger ref={triggerRef} asChild data-theme={theme} className='w-full flex-1' >
        {
          isValidElement(children) ?
            cloneElement(children as React.ReactElement<HTMLInputElement>, {
              value: (children as React.ReactElement<HTMLInputElement>).props.value ?? formattedValue,
              type: "input",
              readOnly: true
            })
            :
            /* If the children is not a valid element, Show the default input */
            <InputField
              readOnly
              type="input"
              {...props}
              childrenSide={
                <ActionButton type='button' size={"M"} onClick={() => {
                  triggerRef.current?.click();
                }}>
                  <i className="ri-calendar-event-fill"></i>
                </ActionButton>
              }
              value={formattedValue}
              ref={forwardedRef}
            />
        }
      </PopoverTrigger>
      <PopoverContent data-theme={theme} dir="ltr" variant={props.variant} className="overflow-hidden w-[285px] flex justify-center items-center p-[6px] pt-[30px]">
        <div className="flex justify-evenly items-center w-full absolute top-0 py-[6px]">
          <p className="text-content-system-global-secondary typography-headers-medium-regular">Year</p>
          <div className="flex justify-center items-center self-center">
            <span className="h-[13px] w-[1px] bg-border-system-global-secondary rounded-[3px]"></span>
            <p className="text-content-system-global-secondary typography-headers-medium-regular px-[18px]">Month</p>
            <span className="h-[13px] w-[1px] bg-border-system-global-secondary rounded-[3px]"></span>
          </div>
          <p className="text-content-system-global-secondary typography-headers-medium-regular">Day</p>
        </div>
        <Picker
          className="flex-1"
          selectContainerClassName="bg-background-system-body-tertiary z-[-1] rounded-[8px]"
          value={pickerValue}
          onChange={handlePickerChange}
          wheelMode="natural"
        >
          <Picker.Column name="year" >
            {years.map((year) => (
              <Picker.Item key={year} value={year}>
                <div className="typography-display-small-semibold text-content-presentation-action-light-primary">{year}</div>
              </Picker.Item>
            ))}
          </Picker.Column>
          <Picker.Column name="month">
            {months.map((month, i) => (
              <Picker.Item key={month} value={month}>
                <div className="typography-display-small-semibold flex gap-1 whitespace-nowrap text-content-presentation-action-light-primary"> <p className='text-content-presentation-action-light-secondary'>{monthsNames[i].substring(0, 3)} - </p>{month}</div>
              </Picker.Item>
            ))}
          </Picker.Column>
          <Picker.Column name="day">
            {days.map((day) => (
              <Picker.Item key={day} value={day}>
                <div className="typography-display-small-semibold text-content-presentation-action-light-primary">{day}</div>
              </Picker.Item>
            ))}
          </Picker.Column>
        </Picker>
      </PopoverContent>
    </Popover>
  );
});
