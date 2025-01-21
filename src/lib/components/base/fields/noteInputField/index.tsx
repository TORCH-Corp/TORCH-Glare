import { forwardRef, TextareaHTMLAttributes } from "react";
import { Label } from "@/components/base/labels/label";
import { Textarea } from "./textarea";
import "./style.scss";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string; // the name of the textArea and this is important to link the textArea with the label
  label?: string;
  requiredLabel?: string;
  secondaryLabel?: string;
  labelDirections?: "vertical" | "horizontal"; // this is used to change the label direction
  errorMessage?: string; // this is used to show the error message tooltip
  negative?: boolean; // this is used to have negative style
}

export const NoteInputField = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      name,
      label,
      requiredLabel,
      secondaryLabel,
      labelDirections,
      errorMessage,
      negative,
      ...props
    },
    ref
  ) => {
    return (
      <Label
        label={label}
        secondaryLabel={secondaryLabel}
        size="M"
        requiredLabel={requiredLabel}
        className="custom-label"
        style={props.style}
      ></Label>
    );
  }
);

export default NoteInputField;
