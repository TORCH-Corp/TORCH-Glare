import React from "react";
import { Toaster, toast } from "torch-glare";

// Pins the (normally fixed) toast container inside the card so the themed
// toasts are captured. Toasts are fired imperatively via toast(...).
const pinned: React.CSSProperties = {
  position: "relative",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

// Canonical: an informational toast (the default blank style).
export const Info = () => {
  React.useEffect(() => {
    const id = toast("New comment on “Q3 Launch Plan”", { duration: Infinity });
    return () => toast.dismiss(id);
  }, []);
  return (
    <div style={{ width: 320, minHeight: 80 }}>
      <Toaster position="top-center" containerStyle={pinned} />
    </div>
  );
};

// Success and error states share the card with status-tinted surfaces.
export const Statuses = () => {
  React.useEffect(() => {
    const a = toast.success("Changes saved successfully", { duration: Infinity });
    const b = toast.error("Failed to upload file. Try again.", {
      duration: Infinity,
    });
    return () => {
      toast.dismiss(a);
      toast.dismiss(b);
    };
  }, []);
  return (
    <div style={{ width: 320, minHeight: 140 }}>
      <Toaster position="top-center" containerStyle={pinned} gutter={10} />
    </div>
  );
};

// Loading toast — warning-tinted with a spinner.
export const Loading = () => {
  React.useEffect(() => {
    const id = toast.loading("Syncing your workspace…", { duration: Infinity });
    return () => toast.dismiss(id);
  }, []);
  return (
    <div style={{ width: 320, minHeight: 80 }}>
      <Toaster position="top-center" containerStyle={pinned} />
    </div>
  );
};
