import React from "react";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/Button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies default variant and size classes", () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole("button");
    // default size "M"
    expect(btn.className).toContain("h-[28px]");
    // default variant "PrimeStyle"
    expect(btn.className).toContain("bg-background-presentation-action-secondary");
  });

  it("applies the requested variant and size", () => {
    render(
      <Button variant="RedContStyle" size="XL">
        Danger
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("h-[40px]");
    expect(btn.className).toContain("hover:text-content-presentation-action-negative-hover");
  });

  it("merges a custom className last", () => {
    render(<Button className="custom-x">x</Button>);
    expect(screen.getByRole("button").className).toContain("custom-x");
  });

  it("marks itself busy, disabled, and shows a spinner while loading", () => {
    render(<Button is_loading>Save</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
    // The spinner is exposed as role="status" with an accessible name.
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  it("is not busy when not loading", () => {
    render(<Button>Idle</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("respects the disabled prop", () => {
    render(<Button disabled>Nope</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn.className).toContain("cursor-not-allowed");
  });

  it("defaults type to button", () => {
    render(<Button>x</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("renders as its child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/home");
    // The button styling is applied to the child element.
    expect(link.className).toContain("bg-background-presentation-action-secondary");
  });

  it("forwards its ref to the underlying button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>x</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("applies the data-theme attribute", () => {
    render(<Button theme="dark">x</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-theme", "dark");
  });
});
