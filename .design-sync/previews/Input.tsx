import React from "react";
import { Group, Icon, Input, Trilling } from "torch-glare";

// Canonical field: a Group wrapper with a leading icon and the bare Input.
export const Basic = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
    <Group>
      <Icon>
        <i className="ri-user-3-line" />
      </Icon>
      <Input placeholder="Full name" />
    </Group>
    <Group>
      <Icon>
        <i className="ri-mail-line" />
      </Icon>
      <Input defaultValue="jane.cooper@torch.dev" />
    </Group>
  </div>
);

// Sizes: S (30px) and M (40px, default).
export const Sizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
    <Group size="S">
      <Icon>
        <i className="ri-search-line" />
      </Icon>
      <Input placeholder="Small field" />
    </Group>
    <Group size="M">
      <Icon>
        <i className="ri-search-line" />
      </Icon>
      <Input placeholder="Medium field" />
    </Group>
  </div>
);

// Trailing slot: icon + input + a trailing affordance.
export const WithTrailing = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
    <Group>
      <Icon>
        <i className="ri-money-dollar-circle-line" />
      </Icon>
      <Input defaultValue="1,250.00" />
      <Trilling>
        <span style={{ fontSize: 13, opacity: 0.7 }}>USD</span>
      </Trilling>
    </Group>
  </div>
);

// Error and disabled states.
export const States = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
    <Group error>
      <Icon>
        <i className="ri-lock-line" />
      </Icon>
      <Input defaultValue="weak" />
    </Group>
    <Group>
      <Icon>
        <i className="ri-user-3-line" />
      </Icon>
      <Input defaultValue="Read only" disabled />
    </Group>
  </div>
);
