import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  Button,
} from "torch-glare";

// Bottom drawer (vaul) opened, with a header, body and footer actions.
export const Open = () => (
  <Drawer defaultOpen shouldScaleBackground={false}>
    <DrawerContent data-theme="dark" className="text-content-system-global-primary">
      <DrawerHeader>
        <DrawerTitle className="text-content-system-global-primary">Filters</DrawerTitle>
        <DrawerDescription className="text-content-system-global-secondary">
          Narrow the results by status and owner.
        </DrawerDescription>
      </DrawerHeader>
      <div style={{ display: "flex", gap: 8, padding: "0 16px", flexWrap: "wrap" }}>
        <Button variant="BlueSecStyle" size="S">Active</Button>
        <Button variant="BorderStyle" size="S">Paused</Button>
        <Button variant="BorderStyle" size="S">Archived</Button>
      </div>
      <DrawerFooter>
        <Button variant="PrimeStyle">Apply filters</Button>
        <Button variant="BorderStyle">Reset</Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);

// Confirmation-style drawer with a short message.
export const Confirm = () => (
  <Drawer defaultOpen shouldScaleBackground={false}>
    <DrawerContent data-theme="dark" className="text-content-system-global-primary">
      <DrawerHeader>
        <DrawerTitle className="text-content-system-global-primary">Remove integration?</DrawerTitle>
        <DrawerDescription className="text-content-system-global-secondary">
          Disconnecting Slack stops all workspace notifications.
        </DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button variant="RedSecStyle">Disconnect</Button>
        <Button variant="BorderStyle">Cancel</Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);
