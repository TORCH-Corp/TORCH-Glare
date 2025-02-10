import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/components/base/utils";
import { Button } from "@/components/base/Button";
import ActionButtonExample from "./ActionButtonExample";
import ButtonExample from "./ButtonExample";
import FieldSectionExample from "./FieldSectionExample";
import DropdownMenuExample from "./DropdownMenuExample";
import InputFieldExample from "./InputFieldExample";
import LabelLessInputExample from "./labelLessInputExample";
import { AlertExample } from "./AlertExample";
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

export default function Examples() {
  const { theme, updateTheme } = useTheme();

  useEffect(() => {
    document.documentElement.dir = "ltr";
  }, [document.documentElement.dir]);

  return (
    <div
      className={cn("w-full flex justify-center pt-12 ", {
        "bg-white": theme === "light",
        "bg-black": theme === "dark",
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

        <ActionButtonExample />
        <ButtonExample />
        <TabFormItemExample />
        <LinkButtonExample />
        <TooltipExample />
        <AlertExample />
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
        <AttachmentExample />
        <FieldSectionExample />
        <TableExample />
        <RingLoadingExample />
        <div className="my-10"></div>
      </section>
    </div>
  );
}
