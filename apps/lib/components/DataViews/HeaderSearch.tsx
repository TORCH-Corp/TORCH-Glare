"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../Button";

export type HeaderSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function HeaderSearch({
  value,
  onChange,
  placeholder = "Search...",
}: HeaderSearchProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Auto-collapse on outside click only when the input is empty — keeps the
  // expanded state if the user has typed a query but clicks away.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (wrapRef.current.contains(e.target as Node)) return;
      if (!value) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, value]);

  function clearAndCollapse() {
    onChange("");
    setOpen(false);
  }

  if (!open) {
    return (
      <Button
        variant="BluContStyle"
        size="M"
        buttonType="icon"
        aria-label="Open search"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-[6px] border border-border-presentation-global-primary"
      >
        <Search className="h-[18px] w-[18px]" />
      </Button>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative flex h-[28px] w-[260px] shrink-0 items-center justify-center rounded-[6px] border border-border-presentation-state-focus bg-background-presentation-form-field-primary px-1 shadow-[0_1px_6px_0_rgba(0,0,0,0.30)] transition-all duration-150 ease-in-out"
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") clearAndCollapse();
        }}
        className="flex-1 bg-transparent text-[14px] leading-none text-white caret-[#1E7AFE] placeholder:text-content-presentation-global-tertiary focus:outline-none"
      />
      <button
        type="button"
        aria-label="Clear search"
        onClick={clearAndCollapse}
        className="flex shrink-0 items-center justify-center self-stretch px-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M7.99992 14.6666C4.31802 14.6666 1.33325 11.6818 1.33325 7.99992C1.33325 4.31802 4.31802 1.33325 7.99992 1.33325C11.6818 1.33325 14.6666 4.31802 14.6666 7.99992C14.6666 11.6818 11.6818 14.6666 7.99992 14.6666ZM7.99992 7.05712L6.1143 5.17149L5.17149 6.1143L7.05712 7.99992L5.17149 9.88552L6.1143 10.8283L7.99992 8.94272L9.88552 10.8283L10.8283 9.88552L8.94272 7.99992L10.8283 6.1143L9.88552 5.17149L7.99992 7.05712Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
}
