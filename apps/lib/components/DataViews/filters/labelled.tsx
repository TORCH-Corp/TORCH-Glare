"use client";

import React from "react";

/** A label above a bare control, since `FieldSection` is exactly what "bare" removes. */
export function Labelled({ label, children }: { label?: React.ReactNode; children: React.ReactNode }) {
  return (
    // `flex-1` is what makes a control fill the width it was given rather than sitting at its
    // minimum with dead space beside it — one per line in the 260px rail, sharing the line evenly
    // in anything wider. `min-w` stays as the floor that decides where the parent wraps.
    <div className="flex min-w-[180px] flex-1 flex-col gap-1">
      {label && (
        <span className="typography-body-small-regular text-content-presentation-global-secondary">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
