"use client";

import { useEffect, useState } from "react";
import {
  ToggleButton,
  ButtonGroup,
  ButtonGroupItem,
} from "@/components/ButtonGroup";
import { Button } from "@/components/Button";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIndicator,
  TimelineSeparator,
  TimelineContent,
  TimelineHeading,
  TimelineDescription,
} from "@/components/Timeline";
import {
  Stepper,
  Step,
  StepIndicator,
  StepConnector,
  StepLabel,
  StepDescription,
} from "@/components/Stepper";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/DropdownMenu";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuShortcut,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ContextMenu";
import { BadgeField } from "@/components/BadgeField";
import type { Tag } from "@/hooks/useTagSelection";
import {
  SearchableTable,
  type SearchableTableColumn,
} from "@/components/SearchableTable";
import {
  SearchableSelect,
  type SearchableSelectOption,
} from "@/components/SearchableSelect";

export default function Page() {
  const [singleValue, setSingleValue] = useState("option1");
  const [multipleValues, setMultipleValues] = useState<string[]>(["bold"]);
  const [isBoldOn, setIsBoldOn] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  return <div data-theme="default" className="p-8 space-y-12 bg-background-presentation-body-primary min-h-screen">

    <SearchableSelectDemo />
    <SearchableTableDemo />
    <BadgeFieldDemo />
    <BadgeFieldRtlDemo />
    <DropdownMenuDemo />
    <ContextMenuDemo />
    <RtlMenuDemo />
  </div>

  return (
    <div className="p-8 space-y-12 bg-background-presentation-body-primary ">
      <h1 className="typography-headers-medium-medium text-content-presentation-global-primary">
        ToggleButton & ButtonGroup Demo
      </h1>

      {/* ================================================================== */}
      {/* DROPDOWN MENU */}
      {/* ================================================================== */}

      <DropdownMenuDemo />

      {/* ================================================================== */}
      {/* TOGGLE BUTTON (Standalone) */}
      {/* ================================================================== */}

      <section className="space-y-6">
        <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
          ToggleButton (Standalone)
        </h2>

        {/* Basic Toggle */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Basic Toggle with Text
          </h3>
          <div className="flex items-center gap-4">
            <ToggleButton
              pressed={isBoldOn}
              onPressedChange={setIsBoldOn}
            >
              <i className="ri-bold mr-2" />
              Bold
            </ToggleButton>
            <span className="typography-body-small-medium text-content-presentation-global-secondary">
              {isBoldOn ? "ON" : "OFF"}
            </span>
          </div>
        </div>

        {/* Icon Only Toggle */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Icon Only Toggle
          </h3>
          <div className="flex items-center gap-4">
            <ToggleButton
              buttonType="icon"
              pressed={isBookmarked}
              onPressedChange={setIsBookmarked}
            >
              <i className={isBookmarked ? "ri-bookmark-fill" : "ri-bookmark-line"} />
            </ToggleButton>
            <span className="typography-body-small-medium text-content-presentation-global-secondary">
              {isBookmarked ? "Bookmarked" : "Not bookmarked"}
            </span>
          </div>
        </div>

        {/* Toggle Variants */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Variants
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <ToggleButton variant="PrimeStyle" defaultPressed>
              PrimeStyle
            </ToggleButton>
            <ToggleButton variant="BlueSecStyle" defaultPressed>
              BlueSecStyle
            </ToggleButton>
            <ToggleButton variant="BorderStyle" defaultPressed>
              BorderStyle
            </ToggleButton>
            <ToggleButton variant="PrimeContStyle" defaultPressed>
              PrimeContStyle
            </ToggleButton>
          </div>
        </div>

        {/* Toggle Sizes */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Sizes
          </h3>
          <div className="flex items-center gap-4">
            <ToggleButton size="S" defaultPressed>Size S</ToggleButton>
            <ToggleButton size="M" defaultPressed>Size M</ToggleButton>
            <ToggleButton size="L" defaultPressed>Size L</ToggleButton>
            <ToggleButton size="XL" defaultPressed>Size XL</ToggleButton>
          </div>
        </div>

        {/* Icon Only Sizes */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Icon Only Sizes
          </h3>
          <div className="flex items-center gap-4">
            <ToggleButton buttonType="icon" size="S" defaultPressed>
              <i className="ri-star-fill" />
            </ToggleButton>
            <ToggleButton buttonType="icon" size="M" defaultPressed>
              <i className="ri-star-fill" />
            </ToggleButton>
            <ToggleButton buttonType="icon" size="L" defaultPressed>
              <i className="ri-star-fill" />
            </ToggleButton>
            <ToggleButton buttonType="icon" size="XL" defaultPressed>
              <i className="ri-star-fill" />
            </ToggleButton>
          </div>
        </div>

        {/* Disabled Toggle */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Disabled
          </h3>
          <div className="flex items-center gap-4">
            <ToggleButton disabled>Disabled Off</ToggleButton>
            <ToggleButton disabled defaultPressed>Disabled On</ToggleButton>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* BUTTON GROUP */}
      {/* ================================================================== */}

      <section className="space-y-6">
        <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
          ButtonGroup
        </h2>

        {/* Single Selection */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Single Selection (Radio-like)
          </h3>
          <p className="typography-body-small-medium text-content-presentation-global-secondary">
            Selected: {singleValue}
          </p>
          <ButtonGroup
            type="single"
            value={singleValue}
            onValueChange={(value) => value && setSingleValue(value)}
          >
            <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
            <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
            <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
          </ButtonGroup>
        </div>

        {/* Multiple Selection */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Multiple Selection (Checkbox-like)
          </h3>
          <p className="typography-body-small-medium text-content-presentation-global-secondary">
            Selected: {multipleValues.join(", ") || "None"}
          </p>
          <ButtonGroup
            type="multiple"
            value={multipleValues}
            onValueChange={setMultipleValues}
          >
            <ButtonGroupItem value="bold">
              <i className="ri-bold" />
            </ButtonGroupItem>
            <ButtonGroupItem value="italic">
              <i className="ri-italic" />
            </ButtonGroupItem>
            <ButtonGroupItem value="underline">
              <i className="ri-underline" />
            </ButtonGroupItem>
            <ButtonGroupItem value="strikethrough">
              <i className="ri-strikethrough" />
            </ButtonGroupItem>
          </ButtonGroup>
        </div>

        {/* Size Comparison */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Size Comparison
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="typography-body-small-medium text-content-presentation-global-secondary w-20">
                Size S
              </span>
              <ButtonGroup type="single" defaultValue="day" size="S">
                <ButtonGroupItem value="day">Day</ButtonGroupItem>
                <ButtonGroupItem value="week">Week</ButtonGroupItem>
                <ButtonGroupItem value="month">Month</ButtonGroupItem>
              </ButtonGroup>
            </div>
            <div className="flex items-center gap-4">
              <span className="typography-body-small-medium text-content-presentation-global-secondary w-20">
                Size M
              </span>
              <ButtonGroup type="single" defaultValue="day" size="M">
                <ButtonGroupItem value="day">Day</ButtonGroupItem>
                <ButtonGroupItem value="week">Week</ButtonGroupItem>
                <ButtonGroupItem value="month">Month</ButtonGroupItem>
              </ButtonGroup>
            </div>
            <div className="flex items-center gap-4">
              <span className="typography-body-small-medium text-content-presentation-global-secondary w-20">
                Size L
              </span>
              <ButtonGroup type="single" defaultValue="day" size="L">
                <ButtonGroupItem value="day">Day</ButtonGroupItem>
                <ButtonGroupItem value="week">Week</ButtonGroupItem>
                <ButtonGroupItem value="month">Month</ButtonGroupItem>
              </ButtonGroup>
            </div>
            <div className="flex items-center gap-4">
              <span className="typography-body-small-medium text-content-presentation-global-secondary w-20">
                Size XL
              </span>
              <ButtonGroup type="single" defaultValue="day" size="XL">
                <ButtonGroupItem value="day">Day</ButtonGroupItem>
                <ButtonGroupItem value="week">Week</ButtonGroupItem>
                <ButtonGroupItem value="month">Month</ButtonGroupItem>
              </ButtonGroup>
            </div>
          </div>
        </div>

        {/* With Icons and Text */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            With Icons and Text
          </h3>
          <ButtonGroup type="single" defaultValue="list">
            <ButtonGroupItem value="grid">
              <i className="ri-grid-line mr-2" />
              Grid
            </ButtonGroupItem>
            <ButtonGroupItem value="list">
              <i className="ri-list-unordered mr-2" />
              List
            </ButtonGroupItem>
            <ButtonGroupItem value="kanban">
              <i className="ri-dashboard-line mr-2" />
              Kanban
            </ButtonGroupItem>
          </ButtonGroup>
        </div>

        {/* Icon Only */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Icon Only (Text Alignment)
          </h3>
          <ButtonGroup type="single" defaultValue="left">
            <ButtonGroupItem value="left">
              <i className="ri-align-left" />
            </ButtonGroupItem>
            <ButtonGroupItem value="center">
              <i className="ri-align-center" />
            </ButtonGroupItem>
            <ButtonGroupItem value="right">
              <i className="ri-align-right" />
            </ButtonGroupItem>
            <ButtonGroupItem value="justify">
              <i className="ri-align-justify" />
            </ButtonGroupItem>
          </ButtonGroup>
        </div>

        {/* Full Width */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Full Width
          </h3>
          <ButtonGroup type="single" defaultValue="all" fullWidth>
            <ButtonGroupItem value="all">All</ButtonGroupItem>
            <ButtonGroupItem value="active">Active</ButtonGroupItem>
            <ButtonGroupItem value="completed">Completed</ButtonGroupItem>
            <ButtonGroupItem value="archived">Archived</ButtonGroupItem>
          </ButtonGroup>
        </div>

        {/* With Disabled Items */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            With Disabled Items
          </h3>
          <ButtonGroup type="single" defaultValue="active">
            <ButtonGroupItem value="active">Active</ButtonGroupItem>
            <ButtonGroupItem value="pending">Pending</ButtonGroupItem>
            <ButtonGroupItem value="disabled" disabled>
              Disabled
            </ButtonGroupItem>
          </ButtonGroup>
        </div>

        {/* SystemStyle Variant */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            SystemStyle Variant
          </h3>
          <div className="p-4 rounded-md bg-background-system-body-secondary">
            <ButtonGroup type="single" defaultValue="overview" variant="SystemStyle">
              <ButtonGroupItem value="overview">Overview</ButtonGroupItem>
              <ButtonGroupItem value="analytics">Analytics</ButtonGroupItem>
              <ButtonGroupItem value="reports">Reports</ButtonGroupItem>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* REAL WORLD EXAMPLES */}
      {/* ================================================================== */}

      <section className="space-y-6">
        <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
          Real World Examples
        </h2>

        {/* View Switcher */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            View Switcher
          </h3>
          <div className="flex items-center gap-4">
            <span className="typography-body-small-medium text-content-presentation-global-secondary">
              View as:
            </span>
            <ButtonGroup type="single" defaultValue="table" size="S">
              <ButtonGroupItem value="table">
                <i className="ri-table-line mr-1" />
                Table
              </ButtonGroupItem>
              <ButtonGroupItem value="cards">
                <i className="ri-layout-grid-line mr-1" />
                Cards
              </ButtonGroupItem>
              <ButtonGroupItem value="timeline">
                <i className="ri-timeline-view mr-1" />
                Timeline
              </ButtonGroupItem>
            </ButtonGroup>
          </div>
        </div>

        {/* Text Editor Toolbar */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Text Editor Toolbar
          </h3>
          <div className="flex items-center gap-2">
            <ButtonGroup type="multiple" defaultValue={["bold"]} size="S">
              <ButtonGroupItem value="bold">
                <i className="ri-bold" />
              </ButtonGroupItem>
              <ButtonGroupItem value="italic">
                <i className="ri-italic" />
              </ButtonGroupItem>
              <ButtonGroupItem value="underline">
                <i className="ri-underline" />
              </ButtonGroupItem>
            </ButtonGroup>

            <div className="w-px h-5 bg-border-presentation-action-disabled" />

            <ButtonGroup type="single" defaultValue="left" size="S">
              <ButtonGroupItem value="left">
                <i className="ri-align-left" />
              </ButtonGroupItem>
              <ButtonGroupItem value="center">
                <i className="ri-align-center" />
              </ButtonGroupItem>
              <ButtonGroupItem value="right">
                <i className="ri-align-right" />
              </ButtonGroupItem>
            </ButtonGroup>

            <div className="w-px h-5 bg-border-presentation-action-disabled" />

            <ToggleButton buttonType="icon" size="S">
              <i className="ri-list-unordered" />
            </ToggleButton>
            <ToggleButton buttonType="icon" size="S">
              <i className="ri-list-ordered" />
            </ToggleButton>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* TIMELINE */}
      {/* ================================================================== */}

      <section className="space-y-6">
        <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
          Timeline
        </h2>

        {/* Vertical Timeline */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Vertical — Order Tracking
          </h3>
          <Timeline orientation="vertical">
            <TimelineItem>
              <TimelineConnector>
                <TimelineIndicator variant="completed" />
                <TimelineSeparator active />
              </TimelineConnector>
              <TimelineContent>
                <TimelineHeading>Order Placed</TimelineHeading>
                <TimelineDescription>Your order has been confirmed and is being processed.</TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineConnector>
                <TimelineIndicator variant="completed" />
                <TimelineSeparator active />
              </TimelineConnector>
              <TimelineContent>
                <TimelineHeading>Payment Verified</TimelineHeading>
                <TimelineDescription>Payment of $129.00 was successfully charged.</TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineConnector>
                <TimelineIndicator variant="active" />
                <TimelineSeparator />
              </TimelineConnector>
              <TimelineContent>
                <TimelineHeading>In Transit</TimelineHeading>
                <TimelineDescription>Package is on its way — expected delivery in 2 days.</TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineConnector>
                <TimelineIndicator variant="default" />
              </TimelineConnector>
              <TimelineContent>
                <TimelineHeading>Delivered</TimelineHeading>
                <TimelineDescription>Awaiting delivery to your address.</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>

        {/* Custom Icons */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Custom Icons — Git Activity
          </h3>
          <Timeline orientation="vertical">
            <TimelineItem>
              <TimelineConnector>
                <TimelineIndicator variant="completed" icon={<i className="ri-git-commit-line" />} />
                <TimelineSeparator active />
              </TimelineConnector>
              <TimelineContent>
                <TimelineHeading>Initial Commit</TimelineHeading>
                <TimelineDescription>feat: project scaffolding</TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineConnector>
                <TimelineIndicator variant="active" icon={<i className="ri-code-s-slash-line" />} />
                <TimelineSeparator />
              </TimelineConnector>
              <TimelineContent>
                <TimelineHeading>Code Review</TimelineHeading>
                <TimelineDescription>PR #42 — Add authentication</TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineConnector>
                <TimelineIndicator variant="error" icon={<i className="ri-bug-line" />} />
              </TimelineConnector>
              <TimelineContent>
                <TimelineHeading>Build Failed</TimelineHeading>
                <TimelineDescription>CI pipeline error on main branch</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>

        {/* Indicator Variants */}
        <div className="space-y-4">
          <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
            Indicator Variants & Sizes
          </h3>
          <div className="flex gap-8 items-center justify-center">
            {(["S", "M", "L"] as const).map((size) => (
              <div key={size} className="flex flex-col gap-3 items-center w-[40px]">
                <span className="typography-body-small-medium text-content-presentation-global-secondary">
                  {size}
                </span>
                <TimelineIndicator variant="default" size={size} />
                <TimelineIndicator variant="active" size={size} />
                <TimelineIndicator variant="completed" size={size} />
                <TimelineIndicator variant="error" size={size} />
                <TimelineIndicator variant="warning" size={size} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* STEPPER */}
      {/* ================================================================== */}

      <StepperDemo />
    </div>
  );
}
function DropdownMenuDemo() {
  const [showToolbar, setShowToolbar] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [panelPosition, setPanelPosition] = useState("bottom");

  return (
    <section className="space-y-6">
      <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
        DropdownMenu
      </h2>

      {/* Basic Menu */}
      <div className="space-y-4">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Basic Menu with Items
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="BorderStyle" size="M">
              <i className="ri-more-2-line" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <i className="ri-edit-line text-[16px]" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <i className="ri-file-copy-line text-[16px]" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <i className="ri-share-line text-[16px]" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem variant="Negative">
              <i className="ri-delete-bin-line text-[16px]" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Labels & Shortcuts */}
      <div className="space-y-4">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Labels & Shortcuts
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="BorderStyle" size="M">
              <i className="ri-clipboard-line" />
              Clipboard
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Editing</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <i className="ri-scissors-line text-[16px]" />
                Cut
                <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem variant={"Default"} disabled>
                <i className="ri-file-copy-line text-[16px]" />
                Copy
                <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem variant={"Negative"} >
                <i className="ri-clipboard-line text-[16px]" />
                Paste
                <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuLabel>History</DropdownMenuLabel>
            <DropdownMenuItem>
              <i className="ri-arrow-go-back-line text-[16px]" />
              Undo
              <DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <i className="ri-arrow-go-forward-line text-[16px]" />
              Redo
              <DropdownMenuShortcut>⇧⌘Z</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Checkbox Items */}
      <div className="space-y-4">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Checkbox Items
        </h3>
        <p className="typography-body-small-medium text-content-presentation-global-secondary">
          Visible:{" "}
          {[
            showToolbar && "Toolbar",
            showSidebar && "Sidebar",
            showStatusBar && "Status Bar",
          ]
            .filter(Boolean)
            .join(", ") || "None"}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="BorderStyle" size="M">
              <i className="ri-layout-line" />
              View Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Checkbox Items</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuCheckboxItem
                checked={showToolbar}
                onCheckedChange={setShowToolbar}
              >
                Toolbar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showSidebar}
                onCheckedChange={setShowSidebar}
                variant={"info"}
              >
                Sidebar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
                variant={"Negative"}
              >
                Status Bar
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Radio Group + Submenu */}
      <div className="space-y-4">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Radio Group & Submenu
        </h3>
        <p className="typography-body-small-medium text-content-presentation-global-secondary">
          Panel position: {panelPosition}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="BorderStyle" size="M">
              <i className="ri-settings-3-line" />
              Panel Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Position</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={panelPosition}
              onValueChange={setPanelPosition}
            >
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <i className="ri-more-line text-[16px]" />
                More Options
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <i className="ri-refresh-line text-[16px]" />
                  Reset Layout
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <i className="ri-fullscreen-line text-[16px]" />
                  Toggle Fullscreen
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
}

function ContextMenuDemo() {
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState("100");

  return (
    <section className="space-y-6">
      <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
        ContextMenu (Right-click)
      </h2>

      <div className="space-y-4">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Right-click the area below
        </h3>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-[160px] w-full items-center justify-center rounded-[10px] border border-dashed border-border-presentation-action-disabled text-content-presentation-global-secondary typography-body-medium-regular select-none">
            Right-click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Actions</ContextMenuLabel>
            <ContextMenuItem>
              <i className="ri-edit-line text-[16px]" />
              Edit
              <ContextMenuShortcut>⌘E</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <i className="ri-file-copy-line text-[16px]" />
              Duplicate
              <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <i className="ri-share-line text-[16px]" />
              Share
            </ContextMenuItem>

            <ContextMenuLabel>View</ContextMenuLabel>
            <ContextMenuCheckboxItem
              checked={showGrid}
              onCheckedChange={setShowGrid}
            >
              Show Grid
            </ContextMenuCheckboxItem>
            <ContextMenuRadioGroup value={zoom} onValueChange={setZoom}>
              <ContextMenuRadioItem value="50">Zoom 50%</ContextMenuRadioItem>
              <ContextMenuRadioItem value="100">Zoom 100%</ContextMenuRadioItem>
              <ContextMenuRadioItem value="200">Zoom 200%</ContextMenuRadioItem>
            </ContextMenuRadioGroup>

            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <i className="ri-more-line text-[16px]" />
                More Options
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>
                  <i className="ri-refresh-line text-[16px]" />
                  Reset
                </ContextMenuItem>
                <ContextMenuItem>
                  <i className="ri-fullscreen-line text-[16px]" />
                  Fullscreen
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuItem variant="Negative">
              <i className="ri-delete-bin-line text-[16px]" />
              Delete
              <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </section>
  );
}

function RtlMenuDemo() {
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState("100");

  return (
    <section dir="rtl" className="space-y-6">
      <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
        RTL / العربية
      </h2>

      {/* Dropdown — RTL */}
      <div className="space-y-4">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          القائمة المنسدلة
        </h3>
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="BorderStyle" size="M">
              <i className="ri-menu-line" />
              الإجراءات
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>تحرير</DropdownMenuLabel>
            <DropdownMenuItem>
              <i className="ri-edit-line text-[16px]" />
              تعديل
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <i className="ri-file-copy-line text-[16px]" />
              نسخ
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <i className="ri-share-line text-[16px]" />
              مشاركة
            </DropdownMenuItem>

            <DropdownMenuLabel>العرض</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showGrid}
              onCheckedChange={setShowGrid}
            >
              إظهار الشبكة
            </DropdownMenuCheckboxItem>
            <DropdownMenuRadioGroup value={zoom} onValueChange={setZoom}>
              <DropdownMenuRadioItem value="50">تكبير ٥٠٪</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="100">تكبير ١٠٠٪</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="200">تكبير ٢٠٠٪</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <i className="ri-more-line text-[16px]" />
                خيارات أخرى
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <i className="ri-refresh-line text-[16px]" />
                  إعادة تعيين
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <i className="ri-fullscreen-line text-[16px]" />
                  ملء الشاشة
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuItem variant="Negative">
              <i className="ri-delete-bin-line text-[16px]" />
              حذف
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Context menu — RTL */}
      <div className="space-y-4">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          قائمة النقر بالزر الأيمن
        </h3>
        <ContextMenu dir="rtl">
          <ContextMenuTrigger className="flex h-[160px] w-full items-center justify-center rounded-[10px] border border-dashed border-border-presentation-action-disabled text-content-presentation-global-secondary typography-body-medium-regular select-none">
            انقر بالزر الأيمن هنا
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>إجراءات</ContextMenuLabel>
            <ContextMenuItem>
              <i className="ri-edit-line text-[16px]" />
              تعديل
              <ContextMenuShortcut>⌘E</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <i className="ri-file-copy-line text-[16px]" />
              نسخ
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <i className="ri-more-line text-[16px]" />
                خيارات أخرى
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>
                  <i className="ri-refresh-line text-[16px]" />
                  إعادة تعيين
                </ContextMenuItem>
                <ContextMenuItem>
                  <i className="ri-fullscreen-line text-[16px]" />
                  ملء الشاشة
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuItem variant="Negative">
              <i className="ri-delete-bin-line text-[16px]" />
              حذف
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </section>
  );
}

const SELECT_OPTIONS: SearchableSelectOption[] = [
  { value: "design", label: "Design", icon: <i className="ri-palette-line text-[16px]" /> },
  { value: "frontend", label: "Frontend", icon: <i className="ri-code-s-slash-line text-[16px]" /> },
  { value: "backend", label: "Backend", icon: <i className="ri-server-line text-[16px]" /> },
  { value: "qa", label: "QA", icon: <i className="ri-bug-line text-[16px]" /> },
  { value: "devops", label: "DevOps", icon: <i className="ri-terminal-box-line text-[16px]" /> },
  { value: "research", label: "Research", icon: <i className="ri-flask-line text-[16px]" /> },
];

// Fake paginated + searchable "backend": 200 generated items, 20 per page,
// filtered by query, with a simulated network delay.
const ALL_REMOTE = Array.from({ length: 200 }, (_, i) => ({
  value: `user-${i + 1}`,
  label: `User ${String(i + 1).padStart(3, "0")}`,
}));
const PAGE_SIZE = 20;

function fakeFetch(query: string, page: number) {
  return new Promise<{ options: SearchableSelectOption[]; hasMore: boolean }>(
    (resolve) => {
      setTimeout(() => {
        const matched = ALL_REMOTE.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase())
        );
        const start = page * PAGE_SIZE;
        const slice = matched.slice(start, start + PAGE_SIZE);
        resolve({ options: slice, hasMore: start + PAGE_SIZE < matched.length });
      }, 600);
    }
  );
}

function SearchableSelectDemo() {
  const [value, setValue] = useState<string | null>(null);

  // Async-mode state (you'd normally use React Query / SWR here).
  const [asyncValue, setAsyncValue] = useState<string | null>(null);
  const [items, setItems] = useState<SearchableSelectOption[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Refetch page 0 whenever the (debounced) query changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fakeFetch(query, 0).then((res) => {
      if (cancelled) return;
      setItems(res.options);
      setHasMore(res.hasMore);
      setPage(0);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    const next = page + 1;
    setLoading(true);
    fakeFetch(query, next).then((res) => {
      setItems((prev) => [...prev, ...res.options]);
      setHasMore(res.hasMore);
      setPage(next);
      setLoading(false);
    });
  };

  return (
    <section className="space-y-6">
      <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
        SearchableSelect
      </h2>

      <div className="space-y-4 max-w-[420px]">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Static — search & pick one (menu-styled rows)
        </h3>
        <p className="typography-body-small-medium text-content-presentation-global-secondary">
          Selected: {value ?? "None"}
        </p>
        <SearchableSelect
          options={SELECT_OPTIONS}
          value={value}
          onValueChange={(v) => setValue(v)}
          icon={<i className="ri-search-line" />}
          placeholder="Search teams…"
        />
      </div>

      <div className="space-y-4 max-w-[420px]">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Async — server search + infinite scroll (200 items, 20/page)
        </h3>
        <p className="typography-body-small-medium text-content-presentation-global-secondary">
          Selected: {asyncValue ?? "None"} · Loaded: {items.length}
        </p>
        <SearchableSelect
          options={items}
          value={asyncValue}
          onValueChange={(v) => setAsyncValue(v)}
          filterClientSide={false}
          onSearchChange={setQuery}
          hasMore={hasMore}
          loading={loading}
          onLoadMore={loadMore}
          icon={<i className="ri-search-line" />}
          placeholder="Search users… (scroll to load more)"
        />
      </div>
    </section>
  );
}

type Person = { id: string; name: string; role: string; email: string };

const SEARCHABLE_TABLE_PEOPLE: Person[] = [
  { id: "1", name: "Ahmed Ali", role: "Designer", email: "ahmed@torch.com" },
  { id: "2", name: "Sara Ibrahim", role: "Frontend", email: "sara@torch.com" },
  { id: "3", name: "Mostafa Nabil", role: "Backend", email: "mostafa@torch.com" },
  { id: "4", name: "Lina Hassan", role: "QA", email: "lina@torch.com" },
  { id: "5", name: "Omar Khaled", role: "DevOps", email: "omar@torch.com" },
  { id: "6", name: "Nour Adel", role: "Research", email: "nour@torch.com" },
];

const PEOPLE_COLUMNS: SearchableTableColumn<Person>[] = [
  { key: "name", header: "Name" },
  { key: "role", header: "Role" },
  { key: "email", header: "Email" },
];

// Fake paginated + searchable "backend" of 200 people, 20 per page.
const ALL_REMOTE_PEOPLE: Person[] = Array.from({ length: 200 }, (_, i) => ({
  id: `p-${i + 1}`,
  name: `Person ${String(i + 1).padStart(3, "0")}`,
  role: ["Designer", "Frontend", "Backend", "QA", "DevOps"][i % 5],
  email: `person${i + 1}@torch.com`,
}));
const PEOPLE_PAGE_SIZE = 20;

function fetchPeople(query: string, page: number) {
  return new Promise<{ rows: Person[]; hasMore: boolean }>((resolve) => {
    setTimeout(() => {
      const matched = ALL_REMOTE_PEOPLE.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.role.toLowerCase().includes(query.toLowerCase())
      );
      const start = page * PEOPLE_PAGE_SIZE;
      const slice = matched.slice(start, start + PEOPLE_PAGE_SIZE);
      resolve({ rows: slice, hasMore: start + PEOPLE_PAGE_SIZE < matched.length });
    }, 600);
  });
}

function SearchableTableDemo() {
  const [selected, setSelected] = useState<Person | null>(null);

  // Async-mode state (you'd normally use React Query / SWR here).
  const [asyncSelected, setAsyncSelected] = useState<Person | null>(null);
  const [rows, setRows] = useState<Person[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPeople(query, 0).then((res) => {
      if (cancelled) return;
      setRows(res.rows);
      setHasMore(res.hasMore);
      setPage(0);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    const next = page + 1;
    setLoading(true);
    fetchPeople(query, next).then((res) => {
      setRows((prev) => [...prev, ...res.rows]);
      setHasMore(res.hasMore);
      setPage(next);
      setLoading(false);
    });
  };

  return (
    <section className="space-y-6">
      <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
        SearchableTable
      </h2>

      <div className="space-y-4 max-w-[520px]">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Static — search, click a row to select
        </h3>
        <p className="typography-body-small-medium text-content-presentation-global-secondary">
          Selected: {selected ? `${selected.name} (${selected.role})` : "None"}
        </p>
        <SearchableTable<Person>
          columns={PEOPLE_COLUMNS}
          rows={SEARCHABLE_TABLE_PEOPLE}
          value={selected}
          onSelect={setSelected}
          getLabel={(p) => `${p.name} — ${p.role}`}
          getRowId={(p) => p.id}
          icon={<i className="ri-search-line" />}
          placeholder="Search people…"
        />
      </div>

      <div className="space-y-4 max-w-[520px]">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Async — server search + infinite scroll (200 rows, 20/page)
        </h3>
        <p className="typography-body-small-medium text-content-presentation-global-secondary">
          Selected: {asyncSelected ? asyncSelected.name : "None"} · Loaded:{" "}
          {rows.length}
        </p>
        <SearchableTable<Person>
          columns={PEOPLE_COLUMNS}
          rows={rows}
          value={asyncSelected}
          onSelect={setAsyncSelected}
          getLabel={(p) => `${p.name} — ${p.role}`}
          getRowId={(p) => p.id}
          filterClientSide={false}
          onSearchChange={setQuery}
          hasMore={hasMore}
          loading={loading}
          onLoadMore={loadMore}
          icon={<i className="ri-search-line" />}
          placeholder="Search people… (scroll to load more)"
        />
      </div>
    </section>
  );
}

const BADGE_FIELD_TAGS: Tag[] = [
  { id: "1", name: "Electronics", isSelected: true, variant: "blue" },
  { id: "2", name: "Books", isSelected: false, variant: "green" },
  { id: "3", name: "Clothing", isSelected: false, variant: "purple" },
  { id: "4", name: "Home", isSelected: false, variant: "yellow" },
  { id: "5", name: "Sports", isSelected: false, variant: "ocean" },
  { id: "6", name: "Limited Edition", isSelected: false, variant: "rose" },
];

function BadgeFieldDemo() {
  const [selected, setSelected] = useState<Tag[]>([]);

  return (
    <section className="space-y-6" >
      <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
        BadgeField
      </h2>

      <div className="space-y-4 max-w-[420px]">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Search & select tags (menu-styled dropdown)
        </h3>
        <p className="typography-body-small-medium text-content-presentation-global-secondary">
          Selected: {selected.map((t) => t.name).join(", ") || "None"}
        </p>
        <BadgeField
          tags={BADGE_FIELD_TAGS}
          onValueChange={setSelected}
          icon={<i className="ri-price-tag-3-line" />}
          placeholder="Select a badge"
        />
      </div>
    </section>
  );
}

const BADGE_FIELD_TAGS_AR: Tag[] = [
  { id: "1", name: "إلكترونيات", isSelected: true, variant: "blue" },
  { id: "2", name: "كتب", isSelected: false, variant: "green" },
  { id: "3", name: "ملابس", isSelected: false, variant: "purple" },
  { id: "4", name: "المنزل", isSelected: false, variant: "yellow" },
  { id: "5", name: "رياضة", isSelected: false, variant: "ocean" },
  { id: "6", name: "إصدار محدود", isSelected: false, variant: "rose" },
];

function BadgeFieldRtlDemo() {
  const [selected, setSelected] = useState<Tag[]>([]);

  return (
    <section dir="rtl" className="space-y-6">
      <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
        BadgeField — العربية (RTL)
      </h2>

      <div className="space-y-4 max-w-[420px]">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          ابحث واختر الوسوم
        </h3>
        <p className="typography-body-small-medium text-content-presentation-global-secondary">
          المحدد: {selected.map((t) => t.name).join("، ") || "لا شيء"}
        </p>
        <BadgeField
          dir="rtl"
          tags={BADGE_FIELD_TAGS_AR}
          onValueChange={setSelected}
          icon={<i className="ri-price-tag-3-line" />}
          placeholder="اختر وسماً"
          addLabel="إضافة"
        />
      </div>
    </section>
  );
}

function StepperDemo() {
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = 4;

  return (
    <section className="space-y-6">
      <h2 className="typography-body-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
        Stepper
      </h2>

      {/* Interactive Horizontal */}
      <div className="space-y-4">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Horizontal — Interactive (Step {activeStep + 1} of {totalSteps})
        </h3>
        <Stepper activeStep={activeStep} orientation="horizontal" size="M">
          <Step index={0}>
            <StepIndicator />
            <StepLabel>Account</StepLabel>
          </Step>
          <StepConnector />
          <Step index={1}>
            <StepIndicator />
            <StepLabel>Profile</StepLabel>
          </Step>
          <StepConnector />
          <Step index={2}>
            <StepIndicator />
            <StepLabel>Settings</StepLabel>
          </Step>
          <StepConnector />
          <Step index={3}>
            <StepIndicator />
            <StepLabel>Confirm</StepLabel>
          </Step>
        </Stepper>

        <div className="flex gap-2">
          <Button
            size="S"
            variant="BorderStyle"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
          >
            <i className="ri-arrow-left-s-line" /> Back
          </Button>
          <Button
            size="S"
            variant="PrimeStyle"
            disabled={activeStep >= totalSteps}
            onClick={() => setActiveStep((s) => Math.min(totalSteps, s + 1))}
          >
            Next <i className="ri-arrow-right-s-line" />
          </Button>
          <Button
            size="S"
            variant="PrimeContStyle"
            onClick={() => setActiveStep(0)}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Sizes
        </h3>
        {(["S", "M", "L"] as const).map((size) => (
          <div key={size} className="space-y-2">
            <span className="typography-body-small-medium text-content-presentation-global-secondary">
              Size: {size}
            </span>
            <Stepper activeStep={2} orientation="horizontal" size={size}>
              <Step index={0}>
                <StepIndicator />
                <StepLabel>Step 1</StepLabel>
              </Step>
              <StepConnector />
              <Step index={1}>
                <StepIndicator />
                <StepLabel>Step 2</StepLabel>
              </Step>
              <StepConnector />
              <Step index={2}>
                <StepIndicator />
                <StepLabel>Step 3</StepLabel>
              </Step>
            </Stepper>
          </div>
        ))}
      </div>

      {/* With Descriptions */}
      <div className="space-y-4">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          With Descriptions
        </h3>
        <Stepper activeStep={1} orientation="horizontal" size="L">
          <Step index={0}>
            <StepIndicator />
            <StepLabel>Account</StepLabel>
            <StepDescription>Create your account</StepDescription>
          </Step>
          <StepConnector />
          <Step index={1}>
            <StepIndicator />
            <StepLabel>Profile</StepLabel>
            <StepDescription>Set up your profile</StepDescription>
          </Step>
          <StepConnector />
          <Step index={2}>
            <StepIndicator />
            <StepLabel>Complete</StepLabel>
            <StepDescription>Review and finish</StepDescription>
          </Step>
        </Stepper>
      </div>

      {/* Error State */}
      <div className="space-y-4">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Error State
        </h3>
        <Stepper activeStep={2} orientation="horizontal" size="M">
          <Step index={0}>
            <StepIndicator />
            <StepLabel>Upload</StepLabel>
          </Step>
          <StepConnector />
          <Step index={1}>
            <StepIndicator />
            <StepLabel>Validate</StepLabel>
          </Step>
          <StepConnector />
          <Step index={2} isError>
            <StepIndicator />
            <StepLabel>Process</StepLabel>
            <StepDescription>Validation failed</StepDescription>
          </Step>
          <StepConnector />
          <Step index={3}>
            <StepIndicator />
            <StepLabel>Done</StepLabel>
          </Step>
        </Stepper>
      </div>

      {/* Custom Icons */}
      <div className="space-y-4">
        <h3 className="typography-body-medium-medium text-content-presentation-global-secondary">
          Custom Icons — Checkout Flow
        </h3>
        <Stepper activeStep={1} orientation="horizontal" size="L">
          <Step index={0}>
            <StepIndicator
              icon={<i className="ri-shopping-cart-line" />}
              completedIcon={<i className="ri-shopping-cart-fill" />}
            />
            <StepLabel>Cart</StepLabel>
          </Step>
          <StepConnector />
          <Step index={1}>
            <StepIndicator
              icon={<i className="ri-map-pin-line" />}
              completedIcon={<i className="ri-map-pin-fill" />}
            />
            <StepLabel>Shipping</StepLabel>
          </Step>
          <StepConnector />
          <Step index={2}>
            <StepIndicator
              icon={<i className="ri-bank-card-line" />}
              completedIcon={<i className="ri-bank-card-fill" />}
            />
            <StepLabel>Payment</StepLabel>
          </Step>
          <StepConnector />
          <Step index={3}>
            <StepIndicator icon={<i className="ri-check-double-line" />} />
            <StepLabel>Confirm</StepLabel>
          </Step>
        </Stepper>
      </div>
    </section>
  );
}


