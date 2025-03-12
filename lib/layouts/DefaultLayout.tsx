import { Themes } from "../utils/types";
import { cn } from "../utils/cn";
import React, { HTMLAttributes, ReactNode } from "react";


interface LayoutProps
  extends HTMLAttributes<HTMLDivElement> {
}
export function DefaultLayout({ ...props }: LayoutProps) {
  return (
    <div {...props} className="flex h-screen gap-[10px] bg-background-system-body-base lg:p-[16px]">
      {props.children}
    </div>
  );
}

interface ContentProps
  extends HTMLAttributes<HTMLDivElement> {
}
export function Content({ ...props }: ContentProps) {
  return (
    <main {...props} className={cn("flex flex-grow flex-1 overflow-hidden", props.className)}>
      <div className="flex rounded-xl bg-background-system-body-tertiary shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)] flex-1 flex-grow md:p-1">
        <div
          className="p-[2px] rounded-lg bg-[linear-gradient(130deg,var(--blue-sparkle-600)_0px,rgba(44,45,46,1)_46px)]  flex-1 flex-grow overflow-scroll  scrollbar-hide"
        >
          {props.children}
        </div>
      </div>
    </main>
  );
}

interface SideBarProps
  extends HTMLAttributes<HTMLDivElement> {
  iconButtons?: ReactNode
  headerChild?: ReactNode
  navigationChildren?: ReactNode
  footerChildren?: ReactNode
  children?: ReactNode
}
export function SideBar({ children, footerChildren, headerChild, navigationChildren, iconButtons, ...props }: SideBarProps) {
  return (
    <aside
      {...props}
      className={cn("hidden w-[265px] p-1 flex-shrink-0 items-start rounded-xl bg-background-system-body-tertiary shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)] h-full lg:flex", props.className)}
    >
      <div className={cn("grid grid-rows-[56px_1fr] w-full rounded-lg border border-border-system-global-primary h-full gap-[1px]", {
        "flex": children
      })}>
        {children ? (
          children
        ) : (
          <>
            <div className="bg-background-system-body-base w-full h-full rounded-t-lg flex justify-center items-center">
              {headerChild}
            </div>

            <div className="grid grid-cols-[46px_1fr] gap-[1px] w-full h-full rounded-b-lg overflow-hidden">
              {/* Icon Buttons Section */}
              <div className="scrollbar-hide overflow-scroll flex flex-col justify-start items-center gap-[3px] w-[46px] h-full bg-background-system-body-base rounded-bl-lg rtl:rounded-br-lg rtl:rounded-bl-none">
                {iconButtons}
              </div>

              {/* Navigation Section */}
              <div className="scrollbar-hide h-full gap-[1px]  overflow-scroll grid grid-rows-[1fr_auto] grid-cols-1 rounded-br-lg rtl:rounded-bl-lg rtl:rounded-br-none">
                <div className="flex flex-col h-full  overflow-scroll scrollbar-hide"
                >
                  <div className="flex flex-col gap-[1px] overflow-scroll scrollbar-hide">
                    {Array.isArray(navigationChildren) ? (
                      navigationChildren.map((child, index) => (
                        <SideBarChildContainer key={index}>{child}</SideBarChildContainer>
                      ))
                    ) : (
                      navigationChildren
                    )}
                  </div>
                  <SideBarChildContainer className="flex-1" />
                </div>

                <SideBarChildContainer className="p-1 pt-[8px]">
                  {footerChildren}
                </SideBarChildContainer>
              </div>

            </div>
          </>
        )}
      </div>
    </aside>
  );
}



interface ChildProps
  extends HTMLAttributes<HTMLDivElement> {
  theme?: Themes
}

export const SideBarChildContainer = ({ theme, ...props }: ChildProps) => {
  return (
    <div {...props} data-theme={theme} className={cn("w-full py-2 bg-background-system-body-base pr-2", props.className)}>
      {props.children}
    </div>
  )
}



