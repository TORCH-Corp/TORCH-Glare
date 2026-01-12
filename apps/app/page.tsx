"use client";

import { useState } from "react";
import {
  ToggleButton,
  ButtonGroup,
  ButtonGroupItem,
} from "@/components/ButtonGroup";

export default function Page() {
  const [singleValue, setSingleValue] = useState("option1");
  const [multipleValues, setMultipleValues] = useState<string[]>(["bold"]);
  const [isBoldOn, setIsBoldOn] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="p-8 space-y-12 bg-background-presentation-body-primary min-h-screen">
      <h1 className="typography-headers-medium-medium text-content-presentation-global-primary">
        ToggleButton & ButtonGroup Demo
      </h1>

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
    </div>
  );
}
