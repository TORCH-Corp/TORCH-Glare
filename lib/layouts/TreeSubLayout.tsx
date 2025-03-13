'use client';
import { usePathname } from "next/navigation";
import TabFormItem from "@/components/TabFormItem";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useActiveTreeItem } from "@/hooks/useActiveTreeItem";
import { motion } from "framer-motion";
import { ActionButton } from "@/components/ActionButton";
import { ReactNode, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

interface TreeItem {
  id: string;
  title: string;
  subTree?: TreeItem[];
}
export type PathConfig = {
  [key: string]: {
    pageHeader: string;
    subTitle?: string;
    TabsTree: TreeItem[];
  };
};

export default function TreeSubLayout({
  children,
  treeData,
  sideBarChildren,
  phoneNavigationChildren
}: {
  children: React.ReactNode;
  treeData: PathConfig;
  sideBarChildren?: ReactNode;
  phoneNavigationChildren?: ReactNode
}) {
  const pathname = usePathname();
  const allIds = treeData[pathname].TabsTree?.flatMap((item) => [
    item.id,
    ...(item.subTree?.map((sub) => sub.id) || []),
  ]);
  const { activeId } = useActiveTreeItem(allIds);
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  return (
    <div
      className={cn(
        "flex gap-[2px] h-full  bg-[linear-gradient(130deg,var(--blue-sparkle-600)_0px,rgba(44,45,46,1)_50%)] overflow-hidden transition-all ease-in-out delay-150 lg:bg-none lg:rounded-2",
        { "gap-0": !isOpen }
      )}
    >
      {/* Sidebar with Framer Motion Animation */}
      <motion.div
        ref={sidebarRef}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-full overflow-hidden bg-background-system-body-base lg:hidden"
      >
        <div className="flex flex-col h-full p-[10px]">
          {sideBarChildren}
        </div>
      </motion.div>

      <div className="grid grid-rows-[92px_1fr] h-full flex-1 gap-[2px] rounded-2 flex-shrink-0 min-w-[300px] lg:grid-rows-[64px_1fr]">
        <HeaderPage
          title={treeData[pathname]?.pageHeader}
          subTitle={treeData[pathname]?.subTitle}
          phoneChildren={
            <div className="w-full flex justify-between items-center">
              <ActionButton onClick={() => setIsOpen(!isOpen)} variant="PrimeContStyle" size={"M"}><i className="ri-menu-2-line text-[22px]"></i></ActionButton>
              {phoneNavigationChildren}
            </div>
          }
        />
        <div className="grid grid-cols-[1fr] overflow-hidden rounded-b-[6px] xl:grid-cols-[1fr_300px]">
          <div className="scrollbar-hide overflow-scroll scroll-smooth bg-background-system-body-base h-full">
            <div className="overflow-scroll scroll-smooth bg-[#B2D0FF0D] h-full w-full p-[12px]">
              {children}
            </div>
          </div>

          <div className="border-l border-border-presentation-global-primary bg-background-system-body-base scrollbar-hide hidden xl:block">
            <div className="flex flex-col items-start gap-3 h-full py-8 px-6 overflow-y-auto scrollbar-hide">
              {treeData[pathname].TabsTree.map((item) => (
                <TreeSection
                  key={item.id}
                  href={`${item.id}`}
                  isActive={
                    activeId === item.id ||
                    item.subTree?.some((sub) => sub.id === activeId)
                  }
                  title={item?.title}
                  subTitles={item?.subTree?.map((sub) => ({
                    ...sub,
                    isActive: activeId === sub.id,
                  }))}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function TreeSection({
  href,
  isActive,
  title,
  subTitles,
}: {
  href: string;
  isActive?: boolean;
  title: string;
  subTitles?: { id: string; title: string; isActive?: boolean }[];
}) {

  return (
    <div
      className={`flex flex-col items-start gap-[12px] w-full  transition-colors duration-200`}
    >
      <TabFormItem
        componentType="tree"
        active={isActive}
        className={`w-full`}
        asChild
      >
        <Link href={`#${href}`}>
          {title}
        </Link>
      </TabFormItem>
      {subTitles && <div
        className={`w-full h-[1px]
            bg-border-presentation-global-primary
        `}
      ></div>}
      {subTitles &&
        <div className="flex items-start flex-1 w-full pl-4">
          <div
            className={`w-[1px] h-full bg-border-presentation-global-primary`}
          />
          <div className="flex p-[4px_0px_4px_8px] flex-col items-start gap-1 w-full flex-1">
            {subTitles?.map((item) => (
              <TabFormItem
                componentType="tree"
                key={item.id}
                active={item.isActive}
                className="w-full"
                asChild
              >
                <Link href={`#${item.id}`}>
                  {item.title}
                </Link>
              </TabFormItem>
            ))}
          </div>
        </div>
      }
    </div>
  );
}


export function HeaderPage({
  title,
  subTitle,
  children,
  phoneChildren,
  type = "start",
  className,
}: {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
  type?: "space-between" | "start";
  className?: string;
  phoneChildren?: ReactNode
}) {
  return (
    <div
      className={cn("w-full h-full transition-all duration-300 ease-in-out lg:rounded-[8px_8px_0px_0px] bg-background-system-body-base", className)}
    >
      <div className="w-full h-full flex flex-col rounded-[6px_6px_0px_0px] transition-all duration-300 ease-in-out bg-gradient-to-b from-background-system-body-base to-background-system-body-secondary bg-opacity-82 lg:bg-none">
        <div className="lg:hidden px-[12px] my-[8px] flex justify-start items-center overflow-y-scroll">
          {phoneChildren}
        </div>
        <div
          className={cn(
            `flex h-fit rtl:pr-4 ltr:pl-4 relative gap-2 w-fit items-center lg:py-[16px]`,
            className
          )}
        >
          <div
            className="absolute top-0 w-[300px] rounded-t-[6px] z-10 lg:h-[60px] 
            ltr:left-0 ltr:lg:bg-[linear-gradient(148deg,#0D0F4E_0%,#000_48.68%)]
            rtl:right-0 rtl:lg:bg-[linear-gradient(-148deg,#0D0F4E_0%,#000_48.68%)]"
          ></div>
          <h1 className="text-content-system-global-primary whitespace-nowrap  typography-display-large-semibold z-20 text-left lg:typography-display-medium-regular lg:uppercase">
            {title}
          </h1>
          <p className="self-end hidden sm:block text-content-presentation-global-secondary typography-headers-medium-regular z-20 lg:uppercase">{subTitle}</p>
          <div className="h-[24px] hidden w-[1px] bg-border-presentation-global-primary z-20 lg:block"></div>
        </div>
        <div
          className={cn(
            "w-full flex rtl:pl-4 items-center ltr:pr-4",
            type === "space-between" && "justify-end"
          )}
        >
          {children}
        </div>
      </div>
      <div className="w-full h-0.5 "></div>
    </div>
  );
}
