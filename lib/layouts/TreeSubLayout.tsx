"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TabFormItem from "@/components/TabFormItem";
import { cn } from "@/utils/cn";
import Link from "next/link";

interface TreeItem {
  id: string;
  title: string;
  subTree?: TreeItem[];
}
export type PathConfig = {
  [key: string]: {
    pageHeader: string;
    TabsTree: TreeItem[];
  };
};

export default function TreeSubLayout({
  children,
  treeData,
}: {
  children: React.ReactNode;
  treeData: PathConfig
}) {
  const pathname = usePathname();
  const allIds = treeData[pathname].TabsTree?.flatMap((item) => [
    item.id,
    ...(item.subTree?.map((sub) => sub.id) || []),
  ]);
  const { activeId } = useActiveTreeItem(allIds);


  return (
    <div className="grid grid-rows-[64px_1fr] h-full gap-[2px]">
      <HeaderPage title={treeData[pathname]?.pageHeader} />
      <div className="grid grid-cols-[1fr] overflow-hidden rounded-b-[6px] bg-background-presentation-form-base xl:grid-cols-[1fr_300px] ">
        {/* Children Container (Scrollable) */}
        <div className=" scrollbar-hide overflow-scroll scroll-smooth px-[20px] bg-background-system-body-base relative after:absolute after:bg-[#b2d0ff07] after:inset-0">
          {children}
        </div>

        {/* Sidebar (Fixed) */}
        <div className={cn("border-l border-border-presentation-global-primary bg-background-system-body-base  scrollbar-hide hidden xl:block")}>
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
  );
}

function useActiveTreeItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!itemIds || itemIds.length === 0) {
      console.warn("No itemIds provided to useActiveTreeItem.");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisibleEntry: any = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Track the most visible entry (highest intersection ratio)
            if (
              !mostVisibleEntry ||
              entry.intersectionRatio > mostVisibleEntry.intersectionRatio
            ) {
              mostVisibleEntry = entry;
            }
          }
        });

        if (mostVisibleEntry) {
          setActiveId(mostVisibleEntry.target.id);
        }
      },
      {
        rootMargin: '-10% 0% -5% 0%', // Adjust based on your layout
        threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for better accuracy
      }
    );

    // Observe all elements
    itemIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      } else {
        console.warn(`Element with id "${id}" not found.`);
      }
    });

    // Cleanup observer
    return () => {
      itemIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return { activeId };
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
  children,
  type = "start",
  className,
}: {
  title: string;
  children?: React.ReactNode;
  type?: "space-between" | "start";
  className?: string;
}) {
  return (
    <div
      className={cn("w-full h-16 transition-all duration-300 ease-in-out rounded-[8px_8px_0px_0px] bg-background-system-body-base", className)}
    >
      <div className="w-full h-full flex gap-2 rounded-[6px_6px_0px_0px] transition-all duration-300 ease-in-out">
        <div
          className={cn(
            `flex h-full py-[16px] rtl:pr-4 ltr:pl-4 relative gap-2 w-fit items-center `,
            className
          )}
        >
          <div
            className="absolute top-0 h-[60px] w-[124px] rounded-t-[6px] z-10
            ltr:left-0 ltr:bg-[linear-gradient(148deg,#0D0F4E_0%,#000_48.68%)]
            rtl:right-0 rtl:bg-[linear-gradient(-148deg,#0D0F4E_0%,#000_48.68%)]"
          ></div>
          <h1 className="text-content-system-global-primary whitespace-nowrap uppercase text-uppercase text-[28px] z-20 text-left">
            {title}
          </h1>
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
