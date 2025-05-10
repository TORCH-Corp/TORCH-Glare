"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css";
import { cn } from "../utils/cn"
import { Button } from "./Button"
import { SimpleSelectValue, SimpleSelectItem } from "./SimpleSelect";

export type CalendarProps = React.ComponentProps<typeof DayPicker>

const Calendar = ({
  className,
  classNames,
  captionLayout = "dropdown",
  components,
  showOutsideDays = true,
  ...props
}: CalendarProps) => {
  return (
    <DayPicker
      data-theme="dark"
      className={cn("w-fit p-[6px] rounded-[12px] bg-background-system-body-base relative", className)}
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      components={{
        Nav: (e) => {
          return (
            <div className="w-full flex items-center justify-between absolute top-0 left-0 p-[6px]">
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
              inputClassName="w-[23px]"
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
              inputClassName="w-[30px]"
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
        ...components
      }}
      classNames={{
        day: cn("w-[30px] h-[30px] [&_button]:w-[28px] [&_button]:h-[28px] [&_button]:rounded-[6px] [&_button]:text-content-system-global-primary [&_button]:bg-background-system-body-secondary [&_button]:m-[2px] [&_button]:text-[10px] [&_button]:border-[1px]  [&_button]:outline-none",
          "[&_button]:hover:border-border-system-action-secondary-hover [&_button]:hover:bg-background-system-action-secondary-hover",
          "[&_button]:focus-within:border-border-system-action-secondary-hover [&_button]:focus-within:bg-background-system-action-primary-hover",
          "[&_button]:transition-all [&_button]:duration-200"
        ),
        today: `[&_button]:bg-background-system-action-primary-hover`, // Add a border to today's date
        selected: `[&_button]:!bg-background-system-action-primary-hover [&_button]:border-border-system-action-secondary-hover [&_button]:text-white`,
        outside: `[&_button]:bg-transparent [&_button]:text-content-system-global-disabled`,
        range_start: `rounded-l-[8px] bg-background-system-action-secondary-hover`,
        range_end: `rounded-r-[8px] bg-background-system-action-secondary-hover`,
        range_middle: `bg-background-system-action-secondary-hover [&_button]:!border-none [&_button]:!bg-transparent`,
        weekdays: `text-content-presentation-global-primary text-[12px]`,
        week_number: `text-content-presentation-global-primary text-[12px] px-1`,
        month_caption: `flex items-center justify-center`,
        caption_label: `text-content-presentation-global-primary text-[14px] pt-[2px]`,
        months: `flex items-end justify-center gap-4 flex-wrap`,
        ...classNames
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
