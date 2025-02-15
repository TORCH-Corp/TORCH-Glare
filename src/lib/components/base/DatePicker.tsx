import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HTMLAttributes, InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import { getYear, getMonth, isSameDay } from "date-fns";
import { Button } from "./Button";
import { cn } from "./utils";
import { cva } from "class-variance-authority";

function range(start: number, end: number, step: number) {
  return Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);
}

interface PickerProps {
  selected?: Date
  placeholderText?: string
  customInput?: any
  onChange?: any
  dateFormat?: any
}

export const Datepicker = ({ onChange, dateFormat, customInput, placeholderText, selected, ...props }: PickerProps) => {

  const [startDate, setStartDate] = useState<Date | any>(selected || new Date(Date.now()));
  useEffect(() => {
    onChange && onChange(startDate)
  }, [])
  return (
    <>
      <DatePicker
        {...props}
        dateFormat={dateFormat}
        customInput={customInput}
        onChange={(date: any) => {
          setStartDate(date)
          onChange && onChange(date)
        }}
        selected={startDate}
        placeholderText={placeholderText}
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
        }) => <CustomDatePickerHeader
            date={date}
            changeMonth={changeMonth}
            changeYear={changeYear}
            decreaseMonth={decreaseMonth}
            increaseMonth={increaseMonth}
            prevMonthButtonDisabled={prevMonthButtonDisabled}
            nextMonthButtonDisabled={nextMonthButtonDisabled}
            onChange={onChange}
            setStartDate={setStartDate}
          />}
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



interface CustomDatePickerHeaderProps {
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
  onChange: (date: Date) => void;
  setStartDate: any
}

export const CustomDatePickerHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  onChange,
  setStartDate
}: CustomDatePickerHeaderProps) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const years = range(1900, getYear(new Date()) * 1.03, 1);

  const setChangeMonth = (monthIndex: number) => {
    const newDate = new Date(date);
    newDate.setMonth(monthIndex);
    onChange && onChange(newDate);
    setStartDate(newDate); // Update the state
  };

  const setChangeYear = (year: number) => {
    const newDate = new Date(date);
    newDate.setFullYear(year);
    onChange && onChange(newDate);
    setStartDate(newDate); // Update the state
  };

  return (
    <div className="w-full flex justify-center items-center flex-col bg-[--background-system-body-base] h-full px-[6px] pt-[6px] rounded-[12px]">
      <div className="flex justify-between items-center flex-1 w-full">
        <Button
          variant={"PrimeStyle"}
          className="hover:border-[--border-system-action-secondary-hover] hover:!bg-[--background-system-action-primary-hover] focus:!border-transparent"
          buttonType={"icon"}
          size={"M"}
          onClick={() => {
            decreaseMonth();
            onChange(date);
            setChangeMonth(date.getMonth());
            setChangeYear(date.getFullYear());
          }}
          disabled={prevMonthButtonDisabled}
        >
          <i className="ri-arrow-left-s-line"></i>
        </Button>

        <div className="flex gap-1 justify-center items-center">
          <OptionsValue
            inputClassName="w-[22px]"
            value={months[getMonth(date)].substring(0, 3)}
            options={months.map((month, i) => (
              <OptionsItem
                key={month}
                selected={getMonth(date) === i}
                onClick={() => {
                  changeMonth(months.indexOf(month));
                  setChangeMonth(months.indexOf(month));
                }}
              >
                {`${month} - ${i + 1}`}
              </OptionsItem>
            ))}
          />

          <OptionsValue
            value={getYear(date)}
            options={years.map((year) => (
              <OptionsItem
                selected={getYear(date) === year}
                key={year}
                onClick={() => {
                  changeYear(year);
                  setChangeYear(year);
                }}
              >
                {year}
              </OptionsItem>
            ))}
          />
        </div>

        <Button
          variant={"PrimeStyle"}
          className="hover:border-[--border-system-action-secondary-hover] hover:!bg-[--background-system-action-primary-hover] focus:!border-transparent"
          buttonType={"icon"}
          size={"M"}
          onClick={() => {
            increaseMonth();
            onChange(date);
            setChangeMonth(date.getMonth());
            setChangeYear(date.getFullYear());
          }}
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
  );
};


export const MenuItemStyles = cva(
  [
    "text-[--content-presentation-action-light-primary]",
    "outline-none",
    "border",
    "border-transparent",
    "flex",
    "gap-[8px]",
    "items-center",
    "justify-start",
    "text-overflow",
    "overflow-hidden",
    "px-[12px]",
    "rounded-[4px]",
    "transition-all",
    "ease-in-out",
    "duration-300",
  ],
  {
    variants: {
      variant: {
        SystemStyle: [
          "bg-[--background-system-body-primary]",
          "text-[--content-system-global-primary]",
          "hover:!bg-[--background-system-action-secondary-hover]",
          "hover:!text-[--content-system-action-primary-hover]",
          "hover:!border-[--border-system-action-primary-hover]",
          "focus:bg-[--background-System-Action-Primary-Selected]",
          "focus:border-transparent",
          "active:border-transparent",
          "active:bg-[--background-System-Action-Primary-Selected]",
          "disabled:bg-[--background-system-body-secondary]",
          "disabled:text-[--content-system-global-disabled]",
        ],
      },
      size: {
        S: ["typography-body-small-regular", "h-[24px]"],
        M: ["typography-body-medium-regular", "h-[32px]"],
      },

      disabled: {
        true: [
          "text-[--content-presentation-state-disabled]",
          "bg-[--white-00]",
        ],
      },

      selected: {
        true: [
          "bg-[--background-presentation-action-selected]",
          "text-[--content-presentation-action-light-primary]",
        ],
      },

      defaultVariants: {
        variant: "Default",
        size: "M",
        active: false,
        disabled: false,
      },
    }
  }
);
export const dropdownMenuStyles = cva(
  [
    "p-1",
    "rounded-[8px]",
    "border",
    "max-h-[200px]",
    "outline-none",
    "overflow-scroll",
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0",
    "data-[state=open]:fade-in-0",
    "overflow-x-hidden",
    "scrollbar-hide",
  ],
  {
    variants: {
      variant: {
        SystemStyle: [
          "border-[--border-system-global-secondary]",
          "bg-[--background-system-body-primary]",
          "shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)]",
        ]
      },
      defaultVariants: {
        variant: "SystemStyle",
      },
    },
  }
);



const OptionsDropDown = ({ className, ...props }: any) => {
  return (
    <div className={cn("absolute min-w-[100px] z-[20] top-[27px] left-0", dropdownMenuStyles({ variant: "SystemStyle" }), className)}>
      {props.children}
    </div>
  )
}


interface OptionsItemProps
  extends HTMLAttributes<HTMLLIElement> {
  selected: boolean
}

const OptionsItem = ({ selected, ...props }: OptionsItemProps) => {
  return (
    <li {...props} className={cn(" whitespace-nowrap", MenuItemStyles({ variant: "SystemStyle", selected: selected, size: "S" }))}>
      {props.children}
    </li>
  )
}

interface OptionsValueProps
  extends InputHTMLAttributes<HTMLInputElement> {
  options: ReactNode
  inputClassName?: string
}

const OptionsValue = ({ inputClassName, options, ...props }: OptionsValueProps) => {
  const [active, setActive] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sectionRef.current &&
        !sectionRef.current.contains(event.target as Node)
      ) {
        setActive(false);
      } else {
        setActive(true);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);
  return (
    <div
      ref={sectionRef}
      className={cn([
        "relative flex justify-between items-center",
        "bg-[--black-alpha-20]",
        "text-white",
        "border-[#2C2D2E]",
        "hover:border-[#9748FF]",
        "hover:bg-[--purple-alpha-10]",
        "typography-body-small-regular leading-0",
        "border",
        "transition-all duration-200 ease-in-out",
        "h-[26px]",
        "w-fit",
        "rounded-[6px]",
        "outline-none",
        "pl-[8px]",
      ])}>
      <input {...props} className={cn([
        "bg-[--black-alpha-20]",
        "text-white",
        "h-[24px]",
        "border-none",
        "max-w-[30px]",
        "outline-none",
        "typography-body-small-regular leading-0",
      ], inputClassName)} {...props} readOnly />
      <i className="ri-arrow-down-s-fill text-[12px] text-[#9748FF] px-1"></i>
      {
        <OptionsDropDown className={options && !active ? "opacity-0 z-[-1]" : ""} >
          {options}
        </OptionsDropDown>
      }
    </div>
  )
}