import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useRef, useState } from "react";
import { getYear, getMonth, isSameDay } from "date-fns";
import { Button } from "./Button";
import { cn } from "./utils";
import { DropDownButton, DropDownButtonContent, DropDownButtonItem, DropDownButtonTrigger, DropDownButtonValue } from "./DropDownButton";
import { InputField } from "./InputField";

function range(start: number, end: number, step: number) {
  return Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);
}

export function Datepicker() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const years = range(1900, getYear(new Date()) * 1.05, 1);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return (
    <>
      <DatePicker
        weekDayClassName={() => "hidden"}
        dayClassName={(date) => {
          const isCurrentMonth = getMonth(date) === getMonth(startDate || new Date());
          const isSelected = startDate && isSameDay(date, startDate);
          return cn(
            "w-[29px] h-[29px] bg-transparent rounded-[6px] border border-transparent text-[--content-system-global-disabled] text-[10px] leading-0 hover:border-[--border-system-action-secondary-hover] hover:!bg-[--background-system-action-primary-hover]",
            {
              "bg-[--background-system-body-secondary] text-[--content-system-global-primary]": isCurrentMonth,
              "border-[--border-system-action-secondary-hover] bg-[--background-system-action-secondary-hover] hover:!bg-[--background-system-action-secondary-hover]": isSelected,
            }
          );
        }}
        calendarClassName="custom-datepicker bg-[--background-system-body-base] rounded-[12px] shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)]"
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="w-full flex justify-center items-center flex-col bg-[--background-system-body-base] h-full px-[6px] pt-[6px] rounded-[12px]">
            <div className="flex justify-between items-center flex-1 w-full">
              <Button
                variant={"PrimeStyle"}
                className="hover:border-[--border-system-action-secondary-hover] hover:!bg-[--background-system-action-primary-hover] focus:!border-transparent"
                buttonType={"icon"}
                size={"M"}
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
              >
                <i className="ri-arrow-left-s-line"></i>
              </Button>

              <div className="flex gap-1"  >
                <DropDownButton onValueChange={(value) => changeMonth(months.indexOf(value))}>
                  <DropDownButtonTrigger icon="ri-arrow-down-s-fill" className="h-[26px] [&_p]:!px-0 pl-[8px] pr-[4px] gap-1 [&_li]:!w-[12px] ] [&_li]:!bg-transparent [&_li]:!border-none [&_li]:!text-[--border-system-action-secondary-hover]" size={"S"} variant={"SystemStyle"} value={months[getMonth(date)]}>
                    <DropDownButtonValue />
                  </DropDownButtonTrigger>
                  <DropDownButtonContent className="z-[1000]" variant={"SystemStyle"} >
                    {months.map((month, i) => (
                      <DropDownButtonItem className="!w-[125px]" size={"S"} variant={"SystemStyle"} key={month} value={month.toString()}  >
                        {`${month} - ${i + 1}`}
                      </DropDownButtonItem>
                    ))}
                  </DropDownButtonContent>
                </DropDownButton>

                <DropDownButton onValueChange={(value) => changeYear(parseInt(value, 10))}>
                  <DropDownButtonTrigger icon="ri-arrow-down-s-fill" className="h-[26px] [&_p]:!px-0 pl-[8px] pr-[4px] gap-1 [&_li]:!w-[12px] [&_li]:!bg-transparent [&_li]:!border-none [&_li]:!text-[--border-system-action-secondary-hover]" variant={"SystemStyle"} value={getYear(date)} size={"S"}>
                    <DropDownButtonValue />
                  </DropDownButtonTrigger>
                  <DropDownButtonContent className="z-[1000]" variant={"SystemStyle"} >
                    {years.map((year) => (
                      <DropDownButtonItem className="!w-[125px]" size={"S"} variant={"SystemStyle"} key={year} value={year.toString()}  >
                        {year}
                      </DropDownButtonItem>
                    ))}
                  </DropDownButtonContent>
                </DropDownButton>
              </div>

              <Button
                variant={"PrimeStyle"}
                className="hover:border-[--border-system-action-secondary-hover] hover:!bg-[--background-system-action-primary-hover] focus:!border-transparent"
                buttonType={"icon"}
                size={"M"}
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
              >
                <i className="ri-arrow-right-s-line"></i>
              </Button>
            </div>

            <div className="flex justify-center items-center w-full gap-[19px] my-[6px]">
              <p className="text-[--content-presentation-global-highlight-darkback] typography-body-small-medium">Su</p>
              <p className="text-[--content-presentation-global-highlight-darkback] typography-body-small-medium">Mo</p>
              <p className="text-[--content-presentation-global-highlight-darkback] typography-body-small-medium">Tu</p>
              <p className="text-[--content-presentation-global-highlight-darkback] typography-body-small-medium">We</p>
              <p className="text-[--content-presentation-global-highlight-darkback] typography-body-small-medium">Th</p>
              <p className="text-[--content-presentation-global-highlight-darkback] typography-body-small-medium">Fr</p>
              <p className="text-[--content-presentation-global-highlight-darkback] typography-body-small-medium">Sa</p>
            </div>
          </div>
        )}
        selected={startDate}
        onChange={(date: Date | null) => setStartDate(date)}
      />

      {/* Add a <style> tag to override the header styles */}
      <style>
        {`
          .custom-datepicker .react-datepicker__header {
            padding: 0 !important;
            border: none !important;
            background-color: transparent !important;
          }
        `}
      </style>
    </>
  );
}

