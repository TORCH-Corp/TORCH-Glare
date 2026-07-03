import { type ReactNode } from "react";
import { SectionBlock, type SectionColor } from "@/components/SectionBlock";
import { InputField } from "@/components/InputField";
import { ActionButton } from "@/components/ActionButton";
import { cn } from "@/utils/cn";

const COLORS: SectionColor[] = [
  "Blue",
  "Yellow",
  "Green",
  "Red",
  "Orange",
  "Purple",
  "Pink",
  "Gray",
];

export default function SectionBlockExample() {
  return (
    <div className="flex flex-col gap-[24px] w-full items-center">
      <h1
        className={cn(
          "text-xl font-bold self-start",
          "text-content-system-global-primary",
        )}
      >
        SectionBlock
      </h1>

      {/* All colors, default content */}
      {COLORS.map((color) => (
        <SectionBlock key={color} color={color} title={`${color} section`}>
          <p className="text-content-system-global-primary py-4">
            This is a {color.toLowerCase()} sectioned card. The badge above
            inherits the color variant; the body uses the form-base background
            with a soft outer shadow.
          </p>
          <p className="text-content-system-global-secondary pb-2">
            Replace this content with anything — forms, tables, lists, etc.
          </p>
        </SectionBlock>
      ))}

      {/* No-title variant */}
      <SectionBlock>
        <p className="text-content-system-global-primary py-4">
          A SectionBlock without a title — header is hidden, body still padded.
        </p>
      </SectionBlock>

      {/* Custom rich title */}
      <SectionBlock
        color="Purple"
        title={
          <span className="flex items-center gap-[6px]">
            <i className="ri-magic-line" />
            Rich title with icon
          </span>
        }
      >
        <p className="text-content-presentation-action-light-primary py-4">
          The `title` prop accepts any ReactNode — pass JSX for icons, links,
          counts, etc.
        </p>
      </SectionBlock>

      {/* Custom fields form (matches reference screenshot) */}
      <SectionBlock
        color="Blue"
        title={
          <span className="flex items-center gap-[6px]">
            <i className="ri-edit-box-line" />
            Custom fields
          </span>
        }
      >
        <FieldRow
          label="Name"
          required
          right={
            <div className="flex flex-1 items-center gap-[12px]">
              <InputField placeholder="First Name*" className="flex-1" />
              <InputField placeholder="Last Name*" className="flex-1" />
            </div>
          }
        />

        <RowDivider />

        <FieldRow
          label="Department"
          right={<InputField placeholder="Write Hint Here" className="flex-1" />}
        />

        <RowDivider />

        <FieldRow
          label="Alias names"
          right={
            <InputField
              placeholder="Write Hint Here"
              className="flex-1"
              childrenSide={
                <ActionButton aria-label="Add alias name">
                  <i className="ri-add-line" />
                </ActionButton>
              }
            />
          }
        />
      </SectionBlock>
    </div>
  );
}

interface FieldRowProps {
  label: string;
  required?: boolean;
  right: ReactNode;
}

function FieldRow({ label, required, right }: FieldRowProps) {
  return (
    <div className="flex items-center gap-[24px] py-[18px]">
      <div className="flex w-[220px] shrink-0 items-center gap-[6px]">
        <span className="typography-body-medium-regular text-content-presentation-action-light-primary">
          {label}
        </span>
        {required && (
          <span className="typography-body-small-medium text-content-presentation-state-negative">
            (Required)
          </span>
        )}
      </div>
      <div className="flex flex-1 items-center">{right}</div>
    </div>
  );
}

function RowDivider() {
  return <div className="h-px w-full bg-border-presentation-global-primary" />;
}
