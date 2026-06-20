import React from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "torch-glare";

// Canonical 6-slot one-time-code input with a partial value entered.
export const SixDigit = () => (
  <InputOTP maxLength={6} value="248">
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
);

// Fully filled code.
export const Filled = () => (
  <InputOTP maxLength={6} value="901423">
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
);

// Grouped 3 + separator + 3 layout.
export const Grouped = () => (
  <InputOTP maxLength={6} value="3175">
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
);
