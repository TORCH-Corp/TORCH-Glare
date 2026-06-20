import React from "react";
import { PasswordLevel } from "torch-glare";

// Strength meter across the levels it computes from the password value:
// length >= 6, contains a symbol, contains an uppercase letter.
export const Levels = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 260 }}>
    {/* empty -> no bars filled */}
    <PasswordLevel value="" />
    {/* length only -> 1 bar (negative/red) */}
    <PasswordLevel value="summer" />
    {/* length + uppercase -> 2 bars (warning) */}
    <PasswordLevel value="Summer2026" />
    {/* length + symbol + uppercase -> 3 bars (success) */}
    <PasswordLevel value="Summer@2026!" />
  </div>
);

// Strong password reaches the full success state.
export const Strong = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 260 }}>
    <PasswordLevel value="Tr0ub4dour&3xpl0it" />
  </div>
);
