import React from "react";
import { ProfileMenu, Popover, PopoverTrigger, PopoverContent, PopoverItem } from "torch-glare";

// Inline data-URI avatar (no network during capture).
const avatar =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><rect width='56' height='56' rx='28' fill='#9748FF'/><text x='28' y='37' font-family='Helvetica,Arial' font-size='24' fill='#fff' text-anchor='middle'>SJ</text></svg>`
  );

// ProfileMenu is a System (dark) control — render against a dark surface.
const Dark: React.FC<{ children?: React.ReactNode; h?: number; w?: number }> = ({ children, h = 0, w = 240 }) => (
  <div
    data-theme="dark"
    style={{ background: "var(--background-system-body-secondary, #1b1c1e)", padding: 20, borderRadius: 8, minHeight: h, width: w }}
  >
    {children}
  </div>
);

// The profile trigger button — resting and selected states.
export const Trigger = () => (
  <Dark w={260}>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <ProfileMenu theme="dark" label="Sarah Jensen" icon={avatar} popoverChildren={<span />} />
      <ProfileMenu theme="dark" label="Sarah Jensen" icon={avatar} selected popoverChildren={<span />} />
    </div>
  </Dark>
);

// The open menu — composed via Popover (trigger + content) so the panel
// renders statically anchored below a profile-style trigger button.
export const OpenMenu = () => (
  <Dark h={280} w={280}>
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-between w-[220px] p-[6px] rounded-[8px] bg-background-system-action-primary-selected outline-none"
        >
          <span className="flex items-center gap-2">
            <img src={avatar} width={28} height={28} style={{ borderRadius: "50%" }} alt="" />
            <span className="typography-body-medium-medium text-content-system-global-primary">Sarah Jensen</span>
          </span>
          <i className="ri-arrow-up-s-line text-[18px] text-content-system-global-primary" />
        </button>
      </PopoverTrigger>
      <PopoverContent variant="SystemStyle" theme="dark" align="start" sideOffset={4} style={{ width: 220 }}>
        <PopoverItem variant="SystemStyle"><i className="ri-user-line" />My profile</PopoverItem>
        <PopoverItem variant="SystemStyle"><i className="ri-settings-3-line" />Settings</PopoverItem>
        <PopoverItem variant="SystemStyle"><i className="ri-bank-card-line" />Billing</PopoverItem>
        <PopoverItem variant="Negative"><i className="ri-logout-box-line" />Sign out</PopoverItem>
      </PopoverContent>
    </Popover>
  </Dark>
);
