import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/components/base/utils";
import { Button } from "@/components/base/Button";
import ActionButtonExample from "./ActionButtonExample";
import ButtonExample from "./ButtonExample";
import FieldSectionExample from "./FieldSectionExample";
import DropdownMenuExample from "./DropdownMenuExample";
import InputFieldExample from "./InputFieldExampleExample";
import LabelLessInputExample from "./LabelLessInputExample";
import { AlertExample } from "./AlertExample";
import { BadgeExample } from "./BadgeExample";
import { ButtonFieldExample } from "./ButtonFieldExample";

export default function Examples() {
  const { theme, updateTheme } = useTheme();
  return (
    <div
      className={cn("flex flex-col gap-8 p-4 w-full overflow-scroll", {
        "bg-white": theme === "light",
        "bg-black": theme === "dark",
      })}
    >
      <Button
        className="fixed top-[10px] right-[10px]"
        onClick={() => updateTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? "GO TO Dark THEME" : "GO TO Light THEME"}{" "}
      </Button>

      <ActionButtonExample />
      <ButtonExample />
      <FieldSectionExample />
      <DropdownMenuExample />
      <InputFieldExample />
      <LabelLessInputExample />
      <AlertExample />
      <BadgeExample />
      <ButtonFieldExample />
    </div>
  );
}
