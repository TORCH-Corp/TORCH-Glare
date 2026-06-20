import React from "react";
import { TreeDropDown } from "torch-glare";

// TreeDropDown is a system (dark) component: its labels use light system tokens,
// so it must sit on a dark system surface to be legible. Wrap each cell.
const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background-system-body-primary rounded-lg p-3">
    {children}
  </div>
);

const leaf =
  "flex items-center gap-2 px-2 h-9 rounded-[4px] text-content-system-global-primary typography-body-medium-regular hover:bg-white-alpha-075 cursor-pointer";

// Canonical: an open file-tree node with leaf children.
export const Default = () => (
  <Shell>
    <TreeDropDown treeLabel="Components" open>
      <div className={leaf}>
        <i className="ri-file-line" /> Button.tsx
      </div>
      <div className={leaf}>
        <i className="ri-file-line" /> Card.tsx
      </div>
      <div className={leaf}>
        <i className="ri-file-line" /> Table.tsx
      </div>
    </TreeDropDown>
  </Shell>
);

// Nested tree: a branch open inside a branch.
export const Nested = () => (
  <Shell>
    <TreeDropDown treeLabel="src" open>
      <TreeDropDown treeLabel="components" open>
        <div className={leaf}>
          <i className="ri-file-line" /> Avatar.tsx
        </div>
        <div className={leaf}>
          <i className="ri-file-line" /> Skeleton.tsx
        </div>
      </TreeDropDown>
      <TreeDropDown treeLabel="hooks">
        <div className={leaf}>
          <i className="ri-file-line" /> useResize.ts
        </div>
      </TreeDropDown>
    </TreeDropDown>
  </Shell>
);

// The secondary variant (navy active treatment).
export const Secondary = () => (
  <Shell>
    <TreeDropDown treeLabel="Settings" variant="secondary" open>
      <div className={leaf}>
        <i className="ri-user-line" /> Profile
      </div>
      <div className={leaf}>
        <i className="ri-lock-line" /> Security
      </div>
      <div className={leaf}>
        <i className="ri-notification-line" /> Notifications
      </div>
    </TreeDropDown>
  </Shell>
);
