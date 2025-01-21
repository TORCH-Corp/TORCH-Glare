import { InputHTMLAttributes } from "react";
import "./style.scss";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  component_size?: "S" | "M" | "L"; // this props will change the button style size see on figma design file
  check_box_name: string; // this important for link the label with the input
  label?: string;
  required_label?: string;
  secondary_label?: string;
  component_type?: "checkbox" | "radio";
  isChecked?: boolean; // this will check the input if true
}
