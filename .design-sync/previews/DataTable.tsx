import React from "react";
import { DataTable, Badge } from "torch-glare";

// Canonical: a sortable, selectable data table with realistic rows.
const userColumns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
];

const userData = [
  { id: "1", name: "Elena Petrova", email: "elena@torchcorp.com", role: "Admin" },
  { id: "2", name: "Marcus Reilly", email: "marcus@torchcorp.com", role: "Editor" },
  { id: "3", name: "Sofia Alvarez", email: "sofia@torchcorp.com", role: "Viewer" },
  { id: "4", name: "Hannah Lee", email: "hannah@torchcorp.com", role: "Editor" },
];

export const Default = () => <DataTable columns={userColumns} data={userData} />;

// Custom cell rendering: a status column backed by a Badge.
const statusVariant: Record<string, string> = {
  Completed: "green",
  "In Progress": "blue",
  Pending: "yellow",
};

const taskColumns = [
  { accessorKey: "title", header: "Task" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status") as string;
      return <Badge variant={statusVariant[status] as any} label={status} />;
    },
  },
  { accessorKey: "assignee", header: "Assignee" },
];

const taskData = [
  { id: "1", title: "Design dashboard", status: "In Progress", assignee: "Elena" },
  { id: "2", title: "Write API docs", status: "Pending", assignee: "Marcus" },
  { id: "3", title: "Ship release 4.5", status: "Completed", assignee: "Sofia" },
];

export const WithStatusCells = () => (
  <DataTable columns={taskColumns} data={taskData} />
);

// Empty state renders the built-in "No results." row.
export const Empty = () => <DataTable columns={userColumns} data={[]} />;
