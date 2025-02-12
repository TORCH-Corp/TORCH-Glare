import { ComponentProps, forwardRef, useState, useEffect } from 'react';
import { getDaysInMonth } from 'date-fns';
import Picker, { PickerValue } from 'torch-react-mobile-picker';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { InputField } from './InputField';

function getDayArray(year: number, month: number): string[] {
  const dayCount = getDaysInMonth(new Date(year, month - 1));
  return Array.from({ length: dayCount }, (_, i) => String(i + 1).padStart(2, '0'));
}

interface SlideDatePickerProps extends ComponentProps<typeof InputField> {
  onChange?: (e: any) => void;
}

export const SlideDatePicker = forwardRef<HTMLInputElement, SlideDatePickerProps>(({ onChange, ...props }, forwardedRef) => {
  const today = new Date();
  const pickerValueData = {
    year: String(today.getFullYear()),
    month: String(today.getMonth() + 1).padStart(2, '0'),
    day: String(today.getDate()).padStart(2, '0'),
  };

  const [pickerValue, setPickerValue] = useState<PickerValue>(pickerValueData);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 150 }, (_, i) => `${currentYear - 100 + i}`);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const days = getDayArray(Number(pickerValue.year), Number(pickerValue.month));

  const handlePickerChange = (newValue: PickerValue, key: string) => {
    let { year, month, day } = newValue;

    if (key === 'year' || key === 'month') {
      const newDayArray = getDayArray(Number(year), Number(month));
      day = newDayArray.includes(day as string) ? day : newDayArray[newDayArray.length - 1];
    }

    const updatedValue = { year, month, day };
    setPickerValue(updatedValue);

    // Call the onChange callback with the updated value
    if (onChange) {
      onChange(updatedValue);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <InputField {...props} ref={forwardedRef} value={`${pickerValue.year}/${pickerValue.month}/${pickerValue.day}`} />
      </PopoverTrigger>
      <PopoverContent variant="SystemStyle" className="overflow-hidden w-[265px] flex justify-center items-center p-[6px] pt-[30px]">
        <div className="flex justify-evenly items-center w-full absolute top-0 py-[6px]">
          <p className="text-[--content-system-global-secondary] typography-headers-medium-regular">Year</p>
          <div className="flex justify-center items-center self-center">
            <span className="h-[13px] w-[1px] bg-[--border-system-global-secondary] rounded-[3px]"></span>
            <p className="text-[--content-system-global-secondary] typography-headers-medium-regular px-[18px]">Month</p>
            <span className="h-[13px] w-[1px] bg-[--border-system-global-secondary] rounded-[3px]"></span>
          </div>
          <p className="text-[--content-system-global-secondary] typography-headers-medium-regular">Day</p>
        </div>
        <Picker
          className="flex-1"
          selectContainerClassName="bg-[--background-system-body-tertiary] z-[-1] rounded-[8px]"
          value={pickerValue}
          onChange={handlePickerChange}
          wheelMode="natural"
        >
          <Picker.Column name="year">
            {years.map((year) => (
              <Picker.Item key={year} value={year}>
                <div className="typography-display-small-semibold text-[--content-presentation-action-light-primary]">{year}</div>
              </Picker.Item>
            ))}
          </Picker.Column>
          <Picker.Column name="month">
            {months.map((month) => (
              <Picker.Item key={month} value={month}>
                <div className="typography-display-small-semibold text-[--content-presentation-action-light-primary]">{month}</div>
              </Picker.Item>
            ))}
          </Picker.Column>
          <Picker.Column name="day">
            {days.map((day) => (
              <Picker.Item key={day} value={day}>
                <div className="typography-display-small-semibold text-[--content-presentation-action-light-primary]">{day}</div>
              </Picker.Item>
            ))}
          </Picker.Column>
        </Picker>
      </PopoverContent>
    </Popover>
  );
});