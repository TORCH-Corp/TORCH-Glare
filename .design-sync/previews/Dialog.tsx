import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Button,
} from "torch-glare";

// DialogContent is an unstyled centering shell — the consumer supplies the
// panel. These compose a realistic system (dark) panel inside it.
const panel: React.CSSProperties = {
  width: 420,
  background: "var(--background-system-body-primary, #232427)",
  border: "1px solid var(--border-system-global-primary, #3a3b3e)",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0px 8px 32px rgba(0,0,0,0.45)",
};

// Canonical form dialog with title, body and footer actions.
export const Form = () => (
  <Dialog defaultOpen>
    <DialogContent data-theme="dark">
      <div style={panel}>
        <DialogHeader>
          <DialogTitle>Invite teammate</DialogTitle>
          <DialogDescription>Send an invitation to join the Acme workspace.</DialogDescription>
        </DialogHeader>
        <div style={{ margin: "16px 0" }}>
          <div className="text-content-system-global-primary typography-body-small-regular" style={{ marginBottom: 6 }}>Email address</div>
          <div
            className="typography-body-medium-regular"
            style={{ height: 32, display: "flex", alignItems: "center", padding: "0 10px", borderRadius: 6, background: "var(--background-system-body-secondary, #1b1c1e)", color: "var(--content-system-global-primary, #fff)", border: "1px solid #3a3b3e" }}
          >
            casey@acme.com
          </div>
        </div>
        <DialogFooter>
          <Button variant="BorderStyle">Cancel</Button>
          <Button variant="PrimeStyle">Send invite</Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
);

// Confirmation dialog — title, message, two actions.
export const Confirm = () => (
  <Dialog defaultOpen>
    <DialogContent data-theme="dark">
      <div style={{ ...panel, width: 380 }}>
        <DialogHeader>
          <DialogTitle>Discard changes?</DialogTitle>
          <DialogDescription>You have unsaved edits. Leaving now will discard them.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="BorderStyle">Keep editing</Button>
          <Button variant="RedSecStyle">Discard</Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
);
