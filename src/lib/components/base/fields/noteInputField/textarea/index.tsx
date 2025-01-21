import { forwardRef, TextareaHTMLAttributes } from "react";
import "./style.scss";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  negative?: boolean;
  error_message?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ name, negative, ...props }, ref) => {
    return (
      <section className="glare-textarea-wrapper">
        {/* // show error message tooltip if error_message is passed */}
      </section>
    );
  }
);
