import { useState } from "react";
import { useTheme } from "@/providers/themeProvider";
import { cn } from "@/utils";
import { Button } from "@/components/base/button";
import ActionButtonExample from "./actionButton.example";
import ButtonExample from "./button.example";
import FieldSectionExample from "./fieldSection.example";
import DropdownMenuExample from "./dropdownMenu.example";
import InputFieldExample from "./inputFieldExample.example";
import LabelLessInputExample from "./labelLessInput.example";

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
    </div>
  );
}
