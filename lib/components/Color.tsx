import { cn } from '../utils/cn'
import { Tooltip } from './Tooltip'
import React, { ReactNode } from 'react'




interface ColorProps extends React.HTMLAttributes<HTMLButtonElement> {
    color: string
    valueToCopy: string
    label: ReactNode
}

export function Color({ label, color, valueToCopy, ...props }: ColorProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(valueToCopy)
            .then(() => {
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    };

    return (
        <Tooltip text={label}>
            <button {...props} className={cn("relative cursor-pointer rounded-[4px] bg-background-system-body-primary outline-none", props.className, {
            })} onClick={handleCopy}>
                <div
                    className={cn("relative z-20 flex w-[40px]  h-[40px] rounded-[4px] border-black-200 border-[1px]", {
                        "w-[150px] h-[130px]": props.children
                    })}
                    dir='ltr'
                >
                    <div className='w-1/2 rounded-l-[4px]' data-theme="dark" style={{ backgroundColor: color }}>

                    </div>
                    <div className='w-1/2 rounded-r-[4px]' data-theme="light" style={{ backgroundColor: color }}>

                    </div>
                </div>
                <svg className={cn("absolute inset-0 z-[10] w-[40px] h-[40px]", {
                    "w-[150px] h-[130px]": props.children
                })} viewBox="0 0 138 128" fill="none"
                    xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <rect width="138" height="128" className="" fill="url(#pattern0_13040_5537)" fillOpacity="0.05" />
                    <defs>
                        <pattern id="pattern0_13040_5537" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlinkHref="#image0_13040_5537"
                                transform="matrix(0.015625 0 0 0.0168457 0 -0.0390625)" />
                        </pattern>
                        <image id="image0_13040_5537" width="64" height="64" preserveAspectRatio="none"
                            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAONJREFUeF7t20EOhEAIRFG4/6F7DvEnYeFzryQIv6pBd2behOu9dPvsbog+k+NLgArQAqmJcw9iAAhSgZKB3IJkkAySQTJ4CiE+gA8oBeg0mH3Ai084P89HhqwEqIA209ICsQdjAeaZIgaAYKxBDMCAYy8fXwAIgiAIcoJpJEYGI4VjB3YrbC9gL2AvkCB43cM5PgZgAAZgQFnNZAhdGykQBEEQBEEQDBmgAm2glM/z+QUYisYUGoldO7kY32IEAzCg6RgIRgjFAsw+AgRBMNYgBmCAT2TCYfoPPz/HCqQCX1eBHzHnv7C7WhBSAAAAAElFTkSuQmCC" />
                    </defs>
                </svg>
                <div className={cn('hidden gap-[10px] p-[6px] w-[150px] min-h-[50px] overflow-hidden items-start justify-between flex-col', {
                    "flex": props.children
                })}>
                    <p className='text-content-system-global-primary text-[10px] break-all leading-normal text-start'>{label}</p>
                    {props.children}
                </div>
            </button>
        </Tooltip>
    );
}
