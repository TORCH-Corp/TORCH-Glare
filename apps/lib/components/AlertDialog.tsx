"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

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


const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Overlay
        className={cn(
            "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
        ref={ref}
    />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & {
        variant?: "info" | "success" | "warning" | "error" | "default"
    }
>(({ className, variant = "default", ...props }, ref) => (
    <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogPrimitive.Content
            ref={ref}
            className={cn(StatusTextStyle({ variant }),
                "text-content-presentation-global-primary max-w-[800px] !m-1 sm:m-0",
                "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-2 border bg-background-presentation-body-overlay-primary p-2 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "rounded-[16px] border-2 border-border-presentation-global-primary",
                className
            )}
            {...props}
        />
    </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
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
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
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
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Title
        ref={ref}
        className={cn("typography-display-medium-semibold", className)}
        {...props}
    />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogLabel = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> & {
        title: string
    }
>(({ className, title, ...props }, ref) => {
    const words = title.split(' ');
    const firstWord = words[0];
    const restOfTitle = words.slice(1).join(' ');

    return (
        <AlertDialogPrimitive.Title
            ref={ref}
            className={cn("text-lg font-semibold", className)}
            {...props}
        >
            <p >
                <strong >{firstWord}</strong>
                {restOfTitle.length > 0 && ' ' + restOfTitle}
            </p>
        </AlertDialogPrimitive.Title>
    )
})
AlertDialogLabel.displayName = "AlertDialogLabel"

const AlertDialogDescription = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
        data-description=""
        ref={ref}
        className={cn("bg-background-presentation-form-base border border-border-presentation-global-primary p-2 rounded-[8px]"
            , "p-[12px_8px_12px_8px] sm:p-[24px_48px_48px_48px] typography-body-large-medium",
            className)}

        {...props}
    >
        {props.children}
    </AlertDialogPrimitive.Description>
))
AlertDialogDescription.displayName =
    AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Action>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & {
        size?: "M" | "S" | "L" | "XL"
        variant?: ButtonVariant
        buttonType?: "button" | "icon"
    }
>(({ className,
    size = "M",
    variant = "BorderStyle",
    buttonType = "button",
    ...props }, ref) => (
    <AlertDialogPrimitive.Action
        ref={ref}
        className={cn(buttonVariants({ variant: variant, size: size, buttonType: buttonType }), className)}
        {...props}
    />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> & {
        size?: "M" | "S" | "L" | "XL"
        variant?: ButtonVariant
        buttonType?: "button" | "icon"
    }
>(({ className,
    size = "M",
    variant = "RedSecStyle",
    buttonType = "icon",
    ...props }, ref) => (
    <AlertDialogPrimitive.Cancel
        ref={ref}
        className={cn(
            buttonVariants({ variant: variant, size: size, buttonType: buttonType }),
            "",
            className
        )}
        {...props}
    />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogLabel,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
}
