'use client'
import { DayPicker } from 'react-day-picker';
import "react-day-picker/style.css";
import { Button } from '@/components/Button';
import { SimpleSelectValue, SimpleSelectItem } from '@/components/SimpleSelect';

export default function Page() {

  return (
    <div className='w-full h-full p-6'>
      <DayPicker
        className="w-fit p-[6px] rounded-[12px] bg-background-system-body-base"
        mode="single"
        showOutsideDays
        captionLayout="dropdown"
        onSelect={(e) => {
          console.log(e);
        }}
        components={{
          Nav: (e) => {
            return (
              <div className="w-full flex items-center justify-between absolute top-0 left-0">
                <Button onClick={e.onPreviousClick} buttonType="icon" variant="PrimeStyle" size="M" className="w-[26px] h-[26px]">
                  <i className="ri-arrow-left-s-line"></i>
                </Button>
                <Button onClick={e.onNextClick} buttonType="icon" variant="PrimeStyle" size="M" className="w-[26px] h-[26px]">
                  <i className="ri-arrow-right-s-line"></i>
                </Button>
              </div>
            )
          },
          MonthsDropdown: (e) => {
            return (
              <SimpleSelectValue
                inputClassName="w-[22px]"
                className="absolute top-0 left-[68px]"
                value={e.options?.find(month => month.value === e.value)?.label.slice(0, 3) || ''}
              >
                {e.options?.map((month, i) => (
                  <SimpleSelectItem
                    key={month.value}
                    selected={e.value === month.value}
                    onClick={() => e.onChange?.({
                      target: {
                        value: month.value
                      }
                    } as any)}
                  >
                    {`${month.label} - ${i + 1}`}
                  </SimpleSelectItem>
                ))}
              </SimpleSelectValue>
            )
          },
          YearsDropdown: (e) => {
            return (
              <SimpleSelectValue
                inputClassName="w-[28px]"
                className="absolute top-0 left-[125px]"
                value={e.value}
              >
                {e.options?.map((year, i) => (
                  <SimpleSelectItem key={year.value} selected={e.value === year.value} onClick={() => e.onChange?.({ target: { value: year.value } } as any)}>
                    {year.label}
                  </SimpleSelectItem>
                ))}
              </SimpleSelectValue>
            )
          },
        }}
        classNames={{
          day: "w-[30px] h-[30px] [&_button]:w-[28px] [&_button]:h-[28px] [&_button]:rounded-[6px] [&_button]:text-white [&_button]:bg-background-system-body-secondary [&_button]:m-[2px] [&_button]:text-[10px]",
          day_selected: "!text-[#000]",
          day_outside: "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          day_today: "!text-[#000]",
        }}
      />
    </div>
  );
}




