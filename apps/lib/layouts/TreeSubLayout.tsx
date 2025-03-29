'use client';
import { usePathname } from "next/navigation";
import TabFormItem from "@/components/TabFormItem";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useActiveTreeItem } from "@/hooks/useActiveTreeItem";

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
}: {
  children: React.ReactNode;
  treeData: PathConfig;
}) {
  const pathname = usePathname();
  const allIds = treeData[pathname].TabsTree?.flatMap((item) => [
    item.id,
    ...(item.subTree?.map((sub) => sub.id) || []),
  ]);
  const { activeId } = useActiveTreeItem(allIds);


  return (
    <div
      className={cn(
        "flex  h-full overflow-hidden transition-all ease-in-out delay-150 lg:bg-none lg:rounded-2 ",
      )}
    >
      <div className="grid grid-rows-[auto_1fr] h-full flex-1 lg:gap-[2px] rounded-2 flex-shrink-0 min-w-[300px]">
        <HeaderPage
          title={treeData[pathname]?.pageHeader}
          subTitle={treeData[pathname]?.subTitle}
        />
        <div className="grid grid-cols-[1fr] overflow-hidden lg:rounded-b-[6px] xl:grid-cols-[1fr_300px]">
          <div className="scrollbar-hide overflow-scroll scroll-smooth bg-background-system-body-base h-full">
            <div className="overflow-scroll scrollbar-hide scroll-smooth bg-[#B2D0FF0D] h-full w-full p-[12px]">
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
  type = "start",
  className,
}: {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
  type?: "space-between" | "start";
  className?: string;
}) {
  return (
    <div
      className={cn("w-full h-fit transition-all duration-300 ease-in-out  lg:rounded-[8px_8px_0px_0px] lg:z-auto",
        "bg-[linear-gradient(90deg,var(--blue-sparkle-600)_0px,rgba(44,45,46,1)_190px)] lg:bg-background-system-body-base",
        "pb-[2px] lg:pb-0",
        className)}
    >
      <div className="w-full h-full flex flex-col justify-center items-start rounded-[6px_6px_0px_0px] transition-all duration-300 ease-in-out lg:bg-none lg:bg-background-system-body-base   lg:h-fit">
        <div className="lg:hidden w-full bg-background-system-body-base px-[12px] h-[52px] flex justify-start items-center overflow-y-scroll border-b-[2px] border-[#2c2d2e]">
        </div>
        <div
          className={cn(
            `flex h-fit relative gap-2  items-center w-full lg:w-fit `,
            "bg-background-system-body-secondary lg:bg-transparent",
            "h-[52px] px-[16px]  lg:py-[16px] rtl:pr-4 ltr:pl-4 lg:h-[60px]",
            className
          )}
        >
          <h1 className="text-content-system-global-primary whitespace-nowrap leading-none typography-display-large-semibold z-20 text-left lg:typography-display-medium-regular lg:uppercase">
            {title}
          </h1>
          <p className="hidden mb-[-6px] sm:block text-content-presentation-global-secondary typography-headers-medium-regular z-20 lg:uppercase">{subTitle}</p>
          <div className="h-[24px] hidden w-[1px] bg-border-presentation-global-primary z-20 sm:block"></div>
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
    </div>
  );
}
