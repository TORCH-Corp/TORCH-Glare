import { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';


interface Props extends HTMLAttributes<HTMLTitleElement> {
    transparent?: boolean
}

export function Article({ transparent = true, ...props }: Props) {

    return (
        <article
            {...props}
            className={cn("flex  flex-col items-start group")}
        >
            <div className={cn("flex ltr:pr-2 rtl:pl-2 items-start gap-2 self-stretch rounded-[0px_6px_6px_0px] bg-border-presentation-action-primary",
                { "bg-transparent": transparent })}>
                <div className="transition-all ease-in-out w-0.5 self-stretch bg-border-presentation-action-primary group-hover:bg-content-presentation-global-primary"></div>
                <p className={cn("flex justify-center items-center py-1 gap-1 text-content-presentation-global-primary typography-body-large-regular", props.className)}>
                    {props.children}
                </p>
            </div>
        </article >
    );
}

