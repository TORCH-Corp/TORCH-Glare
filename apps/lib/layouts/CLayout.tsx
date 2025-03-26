import React, { HTMLAttributes } from "react";
import { SideBar, SideBarFooterItem, SideBarItem, SideBarChildContainer, SideBarIconButton } from "./CSideBar";
import { Body } from "./CBody";

interface LayoutProps
  extends HTMLAttributes<HTMLDivElement> {
}
function Layout({ ...props }: LayoutProps) {
  return (
    <section {...props} className="flex h-screen gap-[10px] bg-background-system-body-base lg:p-[16px]">
      {props.children}
    </section>
  );
}

export {
  SideBar,
  SideBarFooterItem,
  SideBarItem,
  SideBarChildContainer,
  SideBarIconButton,
  Body,
  Layout
}
