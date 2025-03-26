import { cn } from "../utils/cn";
import { HTMLAttributes } from "react";

interface BodyProps
    extends HTMLAttributes<HTMLDivElement> {
}
export function Body({ ...props }: BodyProps) {
    return (
        <main {...props} className={cn("flex flex-grow flex-1 overflow-hidden", props.className)}>
            <div className="flex lg:rounded-xl bg-background-system-body-tertiary shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)] flex-1 flex-grow lg:p-1">
                <div
                    className="lg:rounded-lg flex-1 flex-grow overflow-scroll  scrollbar-hide lg:p-[2px] lg:bg-[linear-gradient(130deg,var(--blue-sparkle-600)_0px,rgba(44,45,46,1)_46px)]"
                >
                    {props.children}
                </div>
            </div>
        </main>
    );
}
