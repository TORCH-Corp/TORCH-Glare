'use client'
import { Codeblock } from "@/components/CodeBlock";
import TabFormItem from "@/components/TabFormItem";
import { cn } from "@/utils/cn";
import { HTMLAttributes, ReactNode, useState } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
    code: string;
    previewComponent: ReactNode | any;
    header: ReactNode;
}

export const CodeBlockAndPreview = ({
    previewComponent,
    header,
    code,
    ...props
}: Props) => {
    const [preview, setPreview] = useState(true);
    return (
        <div
            {...props}
            className={cn("flex flex-col w-full flex-1 gap-[16px]")}
        >
            <div className="flex w-full justify-between items-center border-b border-border-presentation-global-primary p-2">
                <p className="text-content-presentation-global-secondary  typography-headers-large-medium whitespace-nowrap">
                    {header}
                </p>

                <div className="flex justify-between items-center gap-2 flex-nowrap">
                    <div className="bg-border-presentation-global-primary h-[28px] w-[1px] rounded-sm" />
                    <TabFormItem
                        componentType="top"
                        active={preview && true}
                        onClick={() => setPreview(true)}
                    >
                        Preview
                    </TabFormItem>
                    <TabFormItem
                        componentType="top"
                        active={preview && false}
                        onClick={() => setPreview(false)}
                    >
                        Code
                    </TabFormItem>
                </div>
            </div>
            {preview ? (
                <div className="relative  bg-background-presentation-form-field-primary w-full flex-1  flex justify-center items-center rounded-[6px] p-[16px] min-h-[230px] gap-2">
                    <div className="w-full z-0 top-0 left-[-3px] overflow-hidden absolute inset-0">
                        <BackgroundSvg />
                    </div>
                    <div className="z-10 top-0 left-0 w-full leading-none flex justify-center items-center gap-2 overflow-scroll">{previewComponent}</div>
                </div>
            ) : (
                <Codeblock code={code} />
            )}
        </div>
    );
};
const BackgroundSvg = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1928"
        height="1128"
        className=" "
        viewBox="0 0 1928 1128"
        fill="none"
    >
        <g opacity="0.15" filter="url(#filter0_d_324_15076)">
            {Array.from({ length: 24 }, (_, columnIndex) => {
                const x = columnIndex * 40 + 4;
                return Array.from({ length: 14 }, (_, rowIndex) => {
                    const y = rowIndex * 40;
                    const opacity = (columnIndex + rowIndex) % 2 === 0 ? 0.7 : 0.5;
                    return (
                        <rect
                            key={`${columnIndex}-${rowIndex}`}
                            x={x}
                            y={y}
                            width={40}
                            height={40}
                            fill="white"
                            fillOpacity={opacity}
                        />
                    );
                });
            })}
        </g>
    </svg>
);
