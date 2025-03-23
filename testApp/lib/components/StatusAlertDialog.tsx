"use client"
import * as React from "react"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./AlertDialog"
import { ReactNode } from "react"
import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const StatusTextStyle = cva("", {
    variants: {
        variant: {
            info: "text-content-presentation-state-information",
            success: "text-content-presentation-state-success",
            warning: "text-content-presentation-state-warning",
            error: "text-content-presentation-state-negative",
        }
    },
    defaultVariants: {
        variant: "info",
    },
});

interface StatusAlertDialogProps extends VariantProps<typeof StatusTextStyle> {
    title: string
    description: ReactNode
    TriggerChild?: ReactNode
    actionButton?: ReactNode
}


export const StatusAlertDialog = ({ title, description, TriggerChild, variant, actionButton }: StatusAlertDialogProps) => {
    // Split the title to get first word and the rest
    const words = title.split(' ');
    const firstWord = words[0];
    const restOfTitle = words.slice(1).join(' ');

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {TriggerChild}
            </AlertDialogTrigger>

            <AlertDialogContent className="text-content-presentation-global-primary max-w-[800px] !m-1 sm:m-0" >
                <AlertDialogHeader>
                    <AlertDialogTitle className="typography-display-medium-semibold">
                        <p >
                            <strong className={cn(StatusTextStyle({ variant }), "")}>{firstWord}</strong>
                            {restOfTitle.length > 0 && ' ' + restOfTitle}
                        </p>
                    </AlertDialogTitle>
                    <div className="flex justify-center items-center gap-2">
                        {actionButton}
                        <span className="w-[1px] h-[28px] bg-border-presentation-action-disabled rounded-sm"></span>
                        <AlertDialogCancel> <i className="ri-close-line"></i></AlertDialogCancel>
                    </div>
                </AlertDialogHeader>
                <AlertDialogDescription className={cn(StatusTextStyle({ variant }), "p-[12px_8px_12px_8px] sm:p-[24px_48px_48px_48px] typography-body-large-medium")}>
                    {description}
                </AlertDialogDescription>
            </AlertDialogContent>
        </AlertDialog>
    )
}
