import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { getYear, getMonth, getDate, isSameDay } from "date-fns";
import { Button } from "./Button";
import { cn } from "./utils";

function range(start: number, end: number, step: number) {
  return Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);
}

export function Datepicker() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const years = range(1990, getYear(new Date()) + 1, 1);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  /* 
  `
            ${isCurrentMonth ? "text-white" : "text-gray-400"} 
            ${isSelected ? "bg-[#9748FF] text-white font-bold rounded-full" : ""} 
            hover:bg-gray-700 hover:text-white transition-all duration-200
          `;
   */
  return (
    <DatePicker
      dayClassName={(date) => {
        const isCurrentMonth = getMonth(date) === getMonth(startDate || new Date());
        const isSelected = startDate && isSameDay(date, startDate);

        return (`w-[29px] h-[29px] rounded-[6px] text-[--content-system-global-disabled] text-[10px] leading-0 

          ${isCurrentMonth && "bg-[--background-system-body-secondary] text-[--content-system-global-primary]"}
          ${isSelected && ""}
          `
        )
      }}
      calendarClassName="bg-[--background-system-body-base] rounded-[12px] shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)]"
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="flex justify-between items-center bg-[--background-system-body-base]">
          <Button
            variant={"PrimeStyle"}
            className="hover:border-[#9748FF]"
            buttonType={"icon"}
            size={"M"}
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
          >
            <i className="ri-arrow-left-s-line"></i>
          </Button>

          <div className="flex gap-1">
            <select
              className="outline-none text-[--content-system-global-primary] border border-[--border-system-primary] bg-[--background-system-body-base] rounded-[6px]"
              value={months[getMonth(date)]}
              onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
            >
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <select
              className="border border-[--border-system-primary] bg-[--background-system-body-base] rounded-[6px]"
              value={getYear(date)}
              onChange={({ target: { value } }) => changeYear(parseInt(value, 10))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant={"PrimeStyle"}
            className="hover:border-[#9748FF]"
            buttonType={"icon"}
            size={"M"}
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
          >
            <i className="ri-arrow-right-s-line"></i>
          </Button>
        </div>
      )}
      inline
      selected={startDate}
      onChange={(date: Date | null) => setStartDate(date)}
    />
  );
}
