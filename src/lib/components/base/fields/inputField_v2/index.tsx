import { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react';
import { cn } from '@/utils';
import "@/styles/typography_2/index.scss"
import { Input } from '@/components/base/fields/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/dropDowns/popover';
import { Tooltip } from '@/components/base/tooltips/tooltip-v2';
import { ActionButton } from '@/components/base/buttons/actionButton';
import { childrenContainerStyles, iconContainerStyles, inputFieldStyles } from './variants';


interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'variant'> {
    size?: "S" | "M"  // this is used to change the size style of the component
    variant?: "systemStyle"
    icon?: ReactNode; // to add left side icon if you pass it 
    childrenSide?: ReactNode; // to add action button to the end of the input 
    dropDownListChildren?: ReactNode; // to add drop down list if you pass it
    errorMessage?: string; // to show tooltip component when error_message not null
    onTable?: boolean; // to change the border style of the component when it is on table
}

export const InputField = forwardRef<HTMLInputElement, Props>(({
    size = "M",
    icon,
    childrenSide,
    dropDownListChildren,
    errorMessage,
    onTable,
    variant,
    className,
    ...props
}, ref) => {

    const [fucus, setFucus] = useState(false)
    const [dropDownListWidth, setDropDownListWidth] = useState(0)

    // TODO: make the user input visible when input is focused

    return (
        <Popover open={fucus}>
            <PopoverTrigger asChild>
                <section
                    onFocus={(e) => setDropDownListWidth(e.currentTarget.offsetWidth)}
                    className={cn(inputFieldStyles(
                        {
                            variant: variant,
                            fucus,
                            error: errorMessage !== undefined,
                            disabled: props.disabled,
                            size: size,
                            onTable: onTable
                        }))}>

                    <Tooltip open={errorMessage !== undefined} text={errorMessage} >
                        <section className='flex flex-row flex-1 px-[3px] gap-[4px] overflow-hidden relative'>
                            {icon && <div className={cn(iconContainerStyles({ size: size, variant: variant, fucus: fucus }))}>{icon}</div>}
                            <Input {...props} variant={variant} fucusSetter={setFucus} className={fucus ? `pr-[37px] rtl:pl-[35px] rtl:pr-[4px]` : ''} ref={ref} />

                            <div className={cn(childrenContainerStyles({ size: size, variant: variant }))}>
                                {childrenSide}
                                {dropDownListChildren && <ActionButton asChild size={onTable ? "XS" : size} >
                                    <i>
                                        <i className={cn(
                                            'ri-arrow-down-s-line',
                                            'transition-[transform]',
                                            'duration-400',
                                            'ease-in-out',
                                            { 'rotate-180': fucus },
                                            { "text-[16px]": size === "S" || onTable },
                                            { "text-[26px]": size === "M" && !onTable },
                                            { "text-white": variant === "systemStyle" },
                                        )} />
                                    </i>
                                </ActionButton>}
                            </div>
                        </section>

                    </Tooltip>
                </section>
            </PopoverTrigger>

            {dropDownListChildren &&
                <PopoverContent
                    onFocus={() => setFucus(true)}
                    onPointerOver={() => setFucus(true)}
                    onBlur={() => setFucus(false)}
                    variant='SystemStyle' onOpenAutoFocus={(e) => e.preventDefault()} style={{ width: dropDownListWidth }}  >
                    {dropDownListChildren}
                </PopoverContent>
            }
        </Popover>
    )
});