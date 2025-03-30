import React, { HTMLAttributes, ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import Counter from "../components/CountBadge";
import { Tooltip } from "../components/Tooltip";

interface LayoutProps
  extends HTMLAttributes<HTMLDivElement> {
}
function Layout({ ...props }: LayoutProps) {
  return (
    <div {...props} className="flex h-[100dvh] flex-1 lg:gap-[10px] bg-background-system-body-base lg:p-[16px]">
      {props.children}
    </div>
  );
}

interface ContentProps
  extends HTMLAttributes<HTMLDivElement> {
}
function Body({ ...props }: ContentProps) {
  return (
    <main {...props} className={cn("flex flex-grow flex-1 overflow-y-auto", props.className)}>
      <div className="flex lg:rounded-[12px] bg-background-system-body-tertiary shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)] flex-1 flex-grow lg:p-1">
        <div
          className="relative lg:rounded-lg flex-1 flex-grow overflow-scroll  scrollbar-hide lg:p-[2px] lg:bg-[linear-gradient(143deg,var(--blue-sparkle-600)_0px,rgba(44,45,46,1)_55px)]"
        >
          <div
            className="absolute top-[2px] w-[170px] rounded-t-[6px] z-10 lg:h-[60px] 
            left-[2px] ltr:lg:bg-[linear-gradient(132deg,#0D0F4E_0%,#000_50%)]
            rtl:right-[2px] rtl:left-[unset] rtl:lg:bg-[linear-gradient(-132deg,#0D0F4E_0%,#000_50%)]"
          ></div>
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
function SideBar({ children, footerChildren, headerChild, navigationChildren, iconButtons, ...props }: SideBarProps) {
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

const SideBarChildContainer = ({ theme, ...props }: ChildProps) => {
  return (
    <div {...props} data-theme={theme} className={cn("w-full py-2 bg-background-system-body-base pr-2", props.className)}>
      {props.children}
    </div>
  )
}



const SideBarItemStyles = cva([
  "h-[40px] w-full px-[8px] flex gap-[6px] typography-body-small-medium justify-start items-center",
  "text-content-system-global-primary border-l-[2px] rtl:border-r-[2px] border-transparent outline-none",
  "hover:bg-white-alpha-075 hover:border-black-300 hover:text-content-system-action-primary-hover hover:px-[14px]",
  "rounded-r-[4px] text-start whitespace-nowrap transition-all duration-150 ease-in-out",

],
  {
    variants: {
      disabled: {
        true: "text-content-system-global-disabled bg-transparent hover:bg-transparent fucus:bg-transparent active:bg-transparent"
      },
      active: {
        true: "hover:px-[8px] !px-[8px]"
      },
      iconOnly: {
        true: "w-[40px] justify-center overflow-hidden"
      },
      variant: {
        default: [
          "fucus:bg-background-system-action-primary-hover fucus:border-border-system-action-primary-hover"],
        secondary: [
          "focus:bg-wavy-navy-1000 focus:border-border-system-action-field-hover-selected",
        ],

      }
    },
    compoundVariants: [
      {
        active: true,
        variant: "default",
        className: [
          "bg-background-system-action-primary-hover border-border-system-action-primary-hover !px-[8px] hover:px-[8px]",
        ]
      },
      {
        active: true,
        variant: "secondary",
        className: [
          "bg-wavy-navy-1000 border-border-system-action-field-hover-selected !px-[8px] hover:px-[8px]",
        ]
      },
      {
        disabled: true,
        variant: "secondary",
        className: [
          "bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent hover:p-[8px] hover:text-content-system-global-disabled",
        ]
      },
      {
        disabled: true,
        variant: "default",
        className: [
          "bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent hover:p-[8px] hover:text-content-system-global-disabled",
        ]
      }
    ],
    defaultVariants: {
      variant: "default",
    },
  });



interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof SideBarItemStyles> {
  asChild?: boolean;
  as?: React.ElementType;
  theme?: Themes
  variant?: "default" | "secondary"
  iconOnly?: boolean
  active?: boolean
  disabled?: boolean
}
const SideBarItem = ({ active, disabled, iconOnly, asChild, as: Tag = "span", theme, className, variant, ...props }: Props) => {
  const Component = asChild ? Slot : Tag;

  return (
    <Component  {...props} data-theme={theme} disabled={disabled} className={cn(SideBarItemStyles({ variant, iconOnly, active, disabled }), className)}>

    </Component>
  )
}


const SideBarIconButtonStyles = cva([
  "h-[36px] w-[36px] flex  text-content-system-global-primary text-[20px] justify-center items-center rounded-[8px] border border-transparent outline-none",
  "fucus:bg-border-system-action-primary-Hover active:bg-border-system-action-primary-Hover",
  "transition-all duration-200 ease-in-out flex-shrink-0 m-[5px] relative",
],
  {
    variants: {
      active: {
        true: ""
      },
      variant: {
        default: ["hover:bg-background-system-action-secondary-hover hover:border-border-system-action-primary-hover"],
        secondary: ["hover:bg-wavy-navy-1000 hover:border-border-system-action-field-hover-selected"],

      }
    },
    compoundVariants: [
      {
        active: true,
        variant: "default",
        className: [
          "bg-background-system-action-secondary-hover border-border-system-action-primary-hover"]
      },
      {
        active: true,
        variant: "secondary",
        className: [
          "bg-background-system-action-secondary-hover border-border-system-action-primary-hover"
        ]
      }
    ],
    defaultVariants: {
      variant: "default",
    },
  });


interface SideBarIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof SideBarItemStyles> {
  asChild?: boolean;
  as?: React.ElementType;
  theme?: Themes
  variant?: "default" | "secondary"
  active?: boolean
  count?: number
  message?: ReactNode
  disabled?: boolean
}

const SideBarIconButton = ({ count, active, asChild, message, as: Tag = "button", theme, variant, className, ...props }: SideBarIconButtonProps) => {
  const Component = asChild ? Slot : Tag;

  return (
    message ?
      <Tooltip variant={"highlight"} text={message} toolTipSide='left' className='z-[1000]'>
        <Component {...props} data-theme={theme} className={cn(SideBarIconButtonStyles({ variant, active }), className)}>
          {props.children}
          {count && <Counter className=' absolute top-[2px] right-[2px]' label={count} />}
        </Component>
      </Tooltip>
      :
      <Component {...props} data-theme={theme} className={cn(SideBarIconButtonStyles({ variant, active }))}>
        {props.children}
        {count && <Counter className=' absolute top-[2px] right-[2px]' label={count} />}
      </Component>
  )
}


interface SideBarFooterItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: Themes
  as?: React.ElementType;
  asChild?: boolean;
  variant?: "primary" | "secondary"
}

const glareFeedbackItemStyle = cva(
  [
    "h-[40px] w-full flex justify-center items-center rounded-[4px] px-2",
    "text-content-system-global-primary typography-body-small-medium",
    "border border-transparent outline-none bg-background-system-body-base",
    "focus:bg-background-system-action-primary-selected",
    "transition-all duration-200 ease-in-out",
  ], {
  variants: {
    variant: {
      primary:
        [
          "hover:bg-background-system-action-primary-hover hover:border-border-system-action-primary-hover",
          "active:bg-background-system-action-primary-hover active:border-border-system-action-primary-hover "],
      secondary: [
        "hover:bg-wavy-navy-1000  hover:border-border-system-action-field-hover-selected",
        "active:bg-wavy-navy-1000 active:border-border-system-action-field-hover-selected"],
    }
  },
  defaultVariants: {
    variant: "primary"
  }
}
);


const SideBarFooterItem: React.FC<SideBarFooterItemProps> = ({ asChild,
  as: Tag = "button", theme, variant, className, ...props }) => {
  const Component = asChild ? Slot : Tag;

  return (
    <Component
      data-theme={theme}
      {...props}
      className={cn(glareFeedbackItemStyle({ variant }), className)}
    >
    </Component>
  );
};


export {
  SideBar,
  SideBarFooterItem,
  SideBarItem,
  SideBarChildContainer,
  SideBarIconButton,
  Body,
  Layout
}