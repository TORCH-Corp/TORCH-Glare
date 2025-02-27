import * as React from "react";
import { cn } from "../utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { useRef } from "react";
import { Button } from "./Button";
import { Checkbox } from "./CheckboxLabel";
import { useResize } from "../hooks/useResize";

const tableHeadVariants = cva(
  [
    "text-content-presentation-global-primary",
    "px-[8px]",
    "w-full",
    "flex",
    "items-center",
    "justify-center",
    "text-start",
    "hover:bg-background-presentation-action-hover",
    "hover:text-content-presentation-action-hover",
    "transition-[background-color,color]",
    "duration-200",
    "rounded-[3px]",
  ],
  {
    variants: {
      size: {
        S: "h-[20px] min-w-[20px] typography-body-small-semibold",
        M: "h-[32px] min-w-[32px] typography-body-medium-semibold",
      },
      disabled: {
        true: [
          "bg-background-presentation-table-row-disabled",
          "cursor-not-allowed",
          "hover:bg-background-presentation-table-row-disabled",
          "hover:text-content-presentation-global-primary",
        ],
      },
      isDummy: {
        true: [
          "hover:bg-transparent",
          "hover:text-content-presentation-global-primary",
        ],
      },
      defaultVariants: {
        size: "M",
      },
    },
  }
);

type TableHeadVariantsProps = VariantProps<typeof tableHeadVariants>;

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    theme?: "dark" | "light" | "default";
  }
>(({ className, theme, ...props }, ref) => (
  <table
    data-theme={theme}
    ref={ref}
    className={cn("overflow-scroll w-auto", className)}
    {...props}
  >
    {props.children}
  </table>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "border border-b-[2px]  border-border-presentation-table-header bg-background-presentation-form-header shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15)]",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("", className)} {...props}>
    {props.children}
  </tbody>
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("", className)} {...props} />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    state?: "delete" | "update" | "add" | "selected" | "open";
  }
>(({ className, state = "", ...props }, ref) => (
  <tr
    ref={ref}
    className={cn([
      "border-b border-border-presentation-table-header border-x-0  [&_button]:hover:opacity-100 hover:bg-background-presentation-table-row-hover transition-colors",
      {
        "bg-background-presentation-table-row-negative border-border-presentation-badge-red":
          state === "delete",
      },
      {
        "bg-background-presentation-table-row-information border-border-presentation-badge-navy":
          state === "update",
      },
      {
        "bg-background-presentation-table-row-success border-border-presentation-badge-green":
          state === "add",
      },
      {
        "bg-background-presentation-table-row-selected border-t  border-[2px] border-border-presentation-table-selected":
          state === "selected",
      },
      {
        "bg-background-presentation-table-row-hover border-t  border-[2px] border-border-presentation-table-dropdown":
          state === "open",
      },
      className,
    ])}
    {...props}
  >
    {props.children}
  </tr>
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> &
  TableHeadVariantsProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    sortType?: "asc" | "desc" | undefined;
    onSort?: () => void;
  }
>(
  (
    { className, size = "M", disabled, sortType, onSort, isDummy, ...props },
    forwardedRef
  ) => {
    const headRef = useRef<HTMLTableCellElement>(null);
    const { width, handleStartResize } = useResize(headRef);

    // Combine refs using useEffect
    React.useEffect(() => {
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") forwardedRef(headRef.current);
      else forwardedRef.current = headRef.current;
    }, [forwardedRef]);

    return (
      <th
        ref={headRef}
        className={cn(
          "relative py-[2px] px-[2px] bg-background-presentation-form-header"
        )}
      >
        <div
          {...props}
          className={cn(
            tableHeadVariants({ size, disabled, isDummy }),
            { "min-w-[200px]": !isDummy },
            className
          )}
        >
          <div
            style={{ width: `${width}px` }}
            className={cn("flex items-center justify-between flex-1", {
              "justify-center": isDummy,
            })}
          >
            {props.children}
            {!isDummy && <SortButton onSort={onSort} sortType={sortType} />}
          </div>
        </div>
        <button className="absolute top-[50%] translate-y-[-50%] right-[-1px] rtl:left-[-1px] rtl:right-[unset] h-[20px] w-[2px] rounded-full bg-border-presentation-action-primary">
          {!isDummy && (
            <ResizeIcon
              onMouseDown={handleStartResize}
              onTouchStart={handleStartResize}
            />
          )}
        </button>
      </th>
    );
  }
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    isDummy?: boolean;
  }
>(({ className, isDummy, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      [
        "h-[40px] text-content-presentation-action-light-primary",
        "typography-body-small-regular relative",
        " border-l border-r border-border-presentation-table-header px-1",
        "break-all",
        "[mask-image:linear-gradient(to_right,black_0%,black_0%,black_75%,transparent_100%)]",
        "rtl:[mask-image:linear-gradient(to_left,black_0%,black_0%,black_75%,transparent_100%)]",
      ],
      className
    )}
    {...props}
  >
    <div
      className={cn(
        "flex justify-start items-center gap-1 w-[200px] min-w-full overflow-hidden",
        { "w-auto justify-center": isDummy },
        className
      )}
    >
      {props.children}
    </div>
  </td>
));
TableCell.displayName = "TableCell";

const TableCheckbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    id: string;
  }
>(({ className, id, ...props }, ref) => {
  return (
    <div className={cn(["flex items-center justify-center"], className)}>
      <Checkbox {...props} ref={ref} size="S" />
    </div>
  );
});
TableCheckbox.displayName = "TableCheckbox";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

const TableFooterButton = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<{
    className?: string;
  }>
>(({ children, className, ...props }, ref) => {
  return (
    <TableRow
      className={cn(
        "h-[40px] relative group hover:bg-background-presentation-table-acton-hover",
        className
      )}
    >
      <TableCell
        className={cn(
          "before:absolute before:left-0 before:right-0 before:top-[0px] before:h-[2px] before:bg-transparent before:transition-all before:duration-200 before:ease-out group-hover:before:bg-border-presentation-table-action-hover after:absolute after:left-0 after:right-0 after:bottom-[0px] after:h-[2px] after:bg-transparent after:transition-all after:duration-200 after:ease-out group-hover:after:bg-border-presentation-table-action-hover",
          className
        )} colSpan={100}>
        <button
          ref={ref}
          {...props}
          className={cn(
            "overflow-hidden w-full flex items-center justify-start gap-2 typography-body-medium-semibold [&_i]:text-[20px]",
            className
          )}
        >
          {children}
        </button>
      </TableCell>

    </TableRow>
  );
});
TableFooterButton.displayName = "TableFooterButton";

const SubTableButton = ({
  isActive,
  className,
  dummy,
}: {
  isActive?: boolean;
  className?: string;
  dummy?: boolean;
}) => {
  return (
    <Button
      className={cn(
        "transition-opacity duration-200 opacity-0  border-none bg-transparent focus:bg-background-presentation-state-information-primary active:bg-background-presentation-state-information-primary",
        {
          "hover:bg-transparent hover:text-black focus:bg-transparent focus:text-black active:bg-transparent active:text-black":
            dummy,
        },
        className
      )}
      variant={"PrimeStyle"}
      buttonType={"icon"}
    >
      <i
        className={cn(
          "ri-arrow-right-s-line",
          "rtl:rotate-180",
          "transition-transform duration-200",
          { "rotate-90": isActive }
        )}
      ></i>
    </Button>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableCheckbox,
  SubTableButton,
  TableFooterButton,
};

const ResizeIcon = (props: any) => {
  return (
    <svg
      {...props}
      className="z-50 cursor-col-resize absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] opacity-0 hover:opacity-100 transition-opacity duration-200"
      width="8"
      height="32"
      viewBox="0 0 8 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect {...props} y="5" width="8" height="30" rx="3" fill="#3391FF" />
      <circle {...props} cx="2.75" cy="15.5" r="0.75" fill="#F9F9F9" />
      <circle {...props} cx="5.25" cy="15.5" r="0.75" fill="#F9F9F9" />
      <circle {...props} cx="2.75" cy="18.5" r="0.75" fill="#F9F9F9" />
      <circle {...props} cx="5.25" cy="18.5" r="0.75" fill="#F9F9F9" />
      <circle {...props} cx="2.75" cy="21.5" r="0.75" fill="#F9F9F9" />
      <circle {...props} cx="5.25" cy="21.5" r="0.75" fill="#F9F9F9" />
      <circle {...props} cx="2.75" cy="24.5" r="0.75" fill="#F9F9F9" />
      <circle {...props} cx="5.25" cy="24.5" r="0.75" fill="#F9F9F9" />
    </svg>
  );
};

const SortButton = ({
  onSort,
  sortType,
}: {
  onSort?: () => void;
  sortType?: "asc" | "desc" | undefined;
}) => {
  return (
    <button
      className={cn("cursor-pointer text-[16px] z-10")}
      onPointerDown={onSort}
    >
      {sortType === "asc" ? (
        <i className="ri-arrow-up-line text-border-presentation-state-focus" />
      ) : sortType === "desc" ? (
        <i className="ri-arrow-down-line text-border-presentation-state-focus" />
      ) : (
        <i className="ri-arrow-up-down-line text-content-presentation-global-secondary" />
      )}
    </button>
  );
};
