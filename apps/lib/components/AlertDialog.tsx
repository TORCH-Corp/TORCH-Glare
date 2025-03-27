"use client"

import * as React from "react"
import * as FieldAlertDialogPrimitive from "@radix-ui/react-FieldAlert-dialog"

import { cn } from "../utils/cn"
import { buttonVariants } from "./Button"
import { ButtonVariant } from "@/utils/types"
import { cva } from "class-variance-authority"

const StatusTextStyle = cva("", {
    variants: {
        variant: {
            default: "[&_strong]:text-content-presentation-global-primary  [&_[data-description]]:text-content-presentation-global-primary",
            info: "[&_strong]:text-content-presentation-state-information  [&_[data-description]]:text-content-presentation-state-information",
            success: "[&_strong]:text-content-presentation-state-success [&_[data-description]]:text-content-presentation-state-success",
            warning: "[&_strong]:text-content-presentation-state-warning  [&_[data-description]]:text-content-presentation-state-warning",
            error: "[&_strong]:text-content-presentation-state-negative  [&_[data-description]]:text-content-presentation-state-negative",
        }
    },
    defaultVariants: {
        variant: "default",
    },
});


const FieldAlertDialog = FieldAlertDialogPrimitive.Root

const FieldAlertDialogTrigger = FieldAlertDialogPrimitive.Trigger

const FieldAlertDialogPortal = FieldAlertDialogPrimitive.Portal

const FieldAlertDialogOverlay = React.forwardRef<
    React.ElementRef<typeof FieldAlertDialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof FieldAlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <FieldAlertDialogPrimitive.Overlay
        className={cn(
            "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
        ref={ref}
    />
))
FieldAlertDialogOverlay.displayName = FieldAlertDialogPrimitive.Overlay.displayName

const FieldAlertDialogContent = React.forwardRef<
    React.ElementRef<typeof FieldAlertDialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof FieldAlertDialogPrimitive.Content> & {
        variant?: "info" | "success" | "warning" | "error" | "default"
    }
>(({ className, variant = "default", ...props }, ref) => (
    <FieldAlertDialogPortal>
        <FieldAlertDialogOverlay />
        <FieldAlertDialogPrimitive.Content
            ref={ref}
            className={cn(StatusTextStyle({ variant }),
                "text-content-presentation-global-primary max-w-[800px] !m-1 sm:m-0",
                "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-2 border bg-background-presentation-body-overlay-primary p-2 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "rounded-[16px] border-2 border-border-presentation-global-primary",
                className
            )}
            {...props}
        />
    </FieldAlertDialogPortal>
))
FieldAlertDialogContent.displayName = FieldAlertDialogPrimitive.Content.displayName

const FieldAlertDialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex justify-between space-x-2 text-left",
            className
        )}
        {...props}
    />
)
FieldAlertDialogHeader.displayName = "FieldAlertDialogHeader"

const FieldAlertDialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
)
FieldAlertDialogFooter.displayName = "FieldAlertDialogFooter"

const FieldAlertDialogTitle = React.forwardRef<
    React.ElementRef<typeof FieldAlertDialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof FieldAlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <FieldAlertDialogPrimitive.Title
        ref={ref}
        className={cn("typography-display-medium-semibold", className)}
        {...props}
    />
))
FieldAlertDialogTitle.displayName = FieldAlertDialogPrimitive.Title.displayName

const FieldAlertDialogLabel = React.forwardRef<
    React.ElementRef<typeof FieldAlertDialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof FieldAlertDialogPrimitive.Title> & {
        title: string
    }
>(({ className, title, ...props }, ref) => {
    const words = title.split(' ');
    const firstWord = words[0];
    const restOfTitle = words.slice(1).join(' ');

    return (
        <FieldAlertDialogPrimitive.Title
            ref={ref}
            className={cn("text-lg font-semibold", className)}
            {...props}
        >
            <p >
                <strong >{firstWord}</strong>
                {restOfTitle.length > 0 && ' ' + restOfTitle}
            </p>
        </FieldAlertDialogPrimitive.Title>
    )
})
FieldAlertDialogLabel.displayName = "FieldAlertDialogLabel"

const FieldAlertDialogDescription = React.forwardRef<
    React.ElementRef<typeof FieldAlertDialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof FieldAlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <FieldAlertDialogPrimitive.Description
        data-description=""
        ref={ref}
        className={cn("bg-background-presentation-form-base border border-border-presentation-global-primary p-2 rounded-[8px]"
            , "p-[12px_8px_12px_8px] sm:p-[24px_48px_48px_48px] typography-body-large-medium",
            className)}

        {...props}
    >
        {props.children}
    </FieldAlertDialogPrimitive.Description>
))
FieldAlertDialogDescription.displayName =
    FieldAlertDialogPrimitive.Description.displayName

const FieldAlertDialogAction = React.forwardRef<
    React.ElementRef<typeof FieldAlertDialogPrimitive.Action>,
    React.ComponentPropsWithoutRef<typeof FieldAlertDialogPrimitive.Action> & {
        size?: "M" | "S" | "L" | "XL"
        variant?: ButtonVariant
        buttonType?: "button" | "icon"
    }
>(({ className,
    size = "M",
    variant = "BorderStyle",
    buttonType = "button",
    ...props }, ref) => (
    <FieldAlertDialogPrimitive.Action
        ref={ref}
        className={cn(buttonVariants({ variant: variant, size: size, buttonType: buttonType }), className)}
        {...props}
    />
))
FieldAlertDialogAction.displayName = FieldAlertDialogPrimitive.Action.displayName

const FieldAlertDialogCancel = React.forwardRef<
    React.ElementRef<typeof FieldAlertDialogPrimitive.Cancel>,
    React.ComponentPropsWithoutRef<typeof FieldAlertDialogPrimitive.Cancel> & {
        size?: "M" | "S" | "L" | "XL"
        variant?: ButtonVariant
        buttonType?: "button" | "icon"
    }
>(({ className,
    size = "M",
    variant = "RedSecStyle",
    buttonType = "icon",
    ...props }, ref) => (
    <FieldAlertDialogPrimitive.Cancel
        ref={ref}
        className={cn(
            buttonVariants({ variant: variant, size: size, buttonType: buttonType }),
            "",
            className
        )}
        {...props}
    />
))
FieldAlertDialogCancel.displayName = FieldAlertDialogPrimitive.Cancel.displayName

export {
    FieldAlertDialog,
    FieldAlertDialogPortal,
    FieldAlertDialogOverlay,
    FieldAlertDialogTrigger,
    FieldAlertDialogContent,
    FieldAlertDialogHeader,
    FieldAlertDialogFooter,
    FieldAlertDialogTitle,
    FieldAlertDialogLabel,
    FieldAlertDialogDescription,
    FieldAlertDialogAction,
    FieldAlertDialogCancel,
}
