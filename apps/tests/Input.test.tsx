import React from "react";
import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Group, Icon, Input } from "@/components/Input";

describe("Input", () => {
  it("renders an input and forwards its ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Email" />);
    const input = screen.getByPlaceholderText("Email");
    expect(input).toBeInTheDocument();
    expect(ref.current).toBe(input);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("merges a custom className", () => {
    render(<Input placeholder="p" className="custom-input" />);
    expect(screen.getByPlaceholderText("p").className).toContain("custom-input");
  });

  it("passes through native props such as disabled and value", () => {
    render(<Input placeholder="p" disabled readOnly value="hello" />);
    const input = screen.getByPlaceholderText("p") as HTMLInputElement;
    expect(input).toBeDisabled();
    expect(input.value).toBe("hello");
  });

  it("still calls a user-supplied onFocus handler", () => {
    const onFocus = vi.fn();
    render(<Input placeholder="p" onFocus={onFocus} />);
    fireEvent.focus(screen.getByPlaceholderText("p"));
    expect(onFocus).toHaveBeenCalledTimes(1);
  });
});

describe("Input.Group", () => {
  it("applies size and variant classes and forwards its ref", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Group ref={ref} size="S" variant="SystemStyle" data-testid="grp">
        <Input placeholder="p" />
      </Group>,
    );
    const grp = screen.getByTestId("grp");
    expect(ref.current).toBe(grp);
    expect(grp.className).toContain("h-[30px]");
    expect(grp.className).toContain("bg-black-alpha-20");
  });

  it("applies error styling when error is set", () => {
    render(
      <Group error data-testid="grp">
        <Input placeholder="p" />
      </Group>,
    );
    expect(screen.getByTestId("grp").className).toContain(
      "border-border-presentation-state-negative",
    );
  });
});

describe("Input.Icon", () => {
  it("renders its children within an icon slot", () => {
    render(<Icon>★</Icon>);
    const icon = screen.getByText("★");
    expect(icon).toHaveAttribute("data-role", "icon");
  });
});
