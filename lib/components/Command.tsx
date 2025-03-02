"use client"; // Mark this component as a Client Component

import { HTMLAttributes, useCallback, useState } from 'react';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface Props extends HTMLAttributes<HTMLDivElement> { }

export const Command = ({ ...props }: Props) => {

    const [copied, setCopied] = useState(false);
    const handleCopyClick = useCallback(() => {
        navigator.clipboard.writeText(props.children as string);
        // Optionally, provide user feedback (e.g., a toast notification)
        setCopied(true);
    }, [props.children]);

    return (
        <section
            className={cn(
                [
                    "flex gap-2 justify-between items-center w-full ",
                    "text-content-presentation-global-primary typography-body-large-regular",
                    "bg-background-presentation-form-field-primary rounded-[6px] py-4 px-3 overflow-hidden",
                ],
                props.className
            )}
        >
            <code onClick={(e: any) => {
                setCopied(false)
                props.onClick && props.onClick(e)
            }} className='!leading-0 whitespace-nowrap w-full'  {...props}>{props.children}</code>
            <Button
                variant={"PrimeContStyle"}
                buttonType={"icon"}
                size={"M"}
                onClick={handleCopyClick}
            >
                {copied ? <i className="ri-check-line"></i> : <i className="ri-clipboard-fill"></i>
                }
            </Button>
        </section>
    );
};