import { cn } from "@/utils/cn";
import { Button } from "@/components/Button";
import ActionButtonExample from "./ActionButtonExample";
import ButtonExample from "./ButtonExample";
import FieldSectionExample from "./FieldSectionExample";
import DropdownMenuExample from "./DropdownMenuExample";
import InputFieldExample from "./InputFieldExample";
import LabelLessInputExample from "./labelLessInputExample";
import { FieldAlertExample } from "./FieldAlertExample";
import { BadgeExample } from "./BadgeExample";
import { ButtonFieldExample } from "./ButtonFieldExample";
import LabelFieldExample from "./LabelFieldExample";
import LinkButtonExample from "./LinkButtonExample";
import { RadioCardExample } from "./RadioCardExample";
import RadioLabelExample from "./RadioLabelExample";
import RingLoadingExample from "./RingLoadingExample";
import SwitcherExample from "./SwitcherExample";
import { TabFormItemExample } from "./TabFormItemExample";
import TableExample from "./TableExample";
import TextareaExample from "./TextareaExample";
import TooltipExample from "./TooltipExample";
import AttachmentExample from "./AttachmentExample";
import DropDownButtonExample from "./DropDownButtonExample";
import { useEffect } from "react";
import BadgeFieldExample from "./BadgeFieldExample";
import CheckboxLabelExample from "./CheckboxLabelExample";
import PasswordLevelExample from "./PasswordLevelExample";
import SlideDatePickerExample from "./SlideDatePickerExample";
import DatePickerExample from "./DatePickerExample";
import Counter from "@/components/Counter";
import { useTheme } from "@/providers/ThemeProvider";
import IosDatePickerExample from "./IosDatePicerExample";
import FieldAlertDialogExample from "./FieldAlertDialogExample";
export default function Examples() {
  const { theme, updateTheme } = useTheme();

  useEffect(() => {
    document.documentElement.dir = "ltr";
  }, [document.documentElement.dir]);

  return (
    <div
      className={cn("w-full flex justify-center pt-12 bg-background-system-body-primary", {

      })}
    >
      <section className="flex flex-col gap-8 p-4 max-w-[800px] overflow-hidden">
        <Button
          className="fixed top-[10px] right-[10px]"
          onClick={() => updateTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "GO TO Dark THEME" : "GO TO Light THEME"}
        </Button>

        <Button
          className="fixed top-[10px] left-[10px]"
          onClick={() =>
            document.documentElement.dir === "ltr"
              ? (document.documentElement.dir = "rtl")
              : (document.documentElement.dir = "ltr")
          }
        >
          Change Direction
        </Button>

        <Counter label={10}></Counter>
        <ActionButtonExample />
        <ButtonExample />
        <TabFormItemExample />
        <LinkButtonExample />
        <TooltipExample />
        <FieldAlertExample />
        <BadgeExample />
        <CheckboxLabelExample />
        <RadioLabelExample />
        <RadioCardExample />
        <SwitcherExample />
        <DropdownMenuExample />
        <DropDownButtonExample />
        <ButtonFieldExample />
        <InputFieldExample />
        <BadgeFieldExample />
        <LabelFieldExample />
        <LabelLessInputExample />
        <PasswordLevelExample />
        <TextareaExample />
        <SlideDatePickerExample />
        <IosDatePickerExample />
        <DatePickerExample />
        <AttachmentExample />
        <FieldSectionExample />
        <TableExample />
        <RingLoadingExample />
        <FieldAlertDialogExample />
        <div className="my-10"></div>
      </section>
    </div>
  );
}
