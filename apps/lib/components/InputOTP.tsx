"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { cn } from "../utils/cn"


const InputOTP = React.forwardRef<
    React.ElementRef<typeof OTPInput>,
    React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
    <OTPInput
        ref={ref}
        containerClassName={cn(
            "flex items-center gap-2 has-[:disabled]:opacity-50",
            containerClassName
        )}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
    />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
    React.ElementRef<"div">,
    React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
    React.ElementRef<"div">,
    React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext)
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

    return (
        <div
            ref={ref}
            data-slot="input-otp-slot"
            data-active={isActive}
            className={cn(
                "relative mx-1 flex items-center justify-center text-content-presentation-global-primary",
                "min-w-[40px] h-[40px]", // Size M by default
                "border rounded-[8px]",
                "transition-all duration-200 ease-in-out",
                "bg-background-presentation-form-field-primary",
                "border-border-presentation-action-primary",
                "hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
                "hover:bg-background-presentation-form-field-hover",
                "hover:border-border-presentation-action-hover",
                // Active/Focus styles
                "data-[active=true]:border-border-presentation-state-focus",
                "data-[active=true]:bg-background-presentation-form-field-primary",
                "data-[active=true]:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
                // Typography
                "typography-body-small-regular",
                className
            )}
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="animate-caret-blink bg-border-presentation-state-focus h-4 w-px duration-1000" />
                </div>
            )}
        </div>
    )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
    React.ElementRef<"div">,
    React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
    <div ref={ref} role="separator" {...props}>
        <i className="ri-subtract-line text-border-presentation-global-primary"></i>
    </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
