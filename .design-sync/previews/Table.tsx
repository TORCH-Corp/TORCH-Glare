import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "torch-glare";

// Canonical: a small invoice table with a header and a few rows.
export const Default = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>INV-1042</TableCell>
        <TableCell>Northwind Traders</TableCell>
        <TableCell>Paid</TableCell>
        <TableCell>$2,400.00</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>INV-1043</TableCell>
        <TableCell>Contoso Ltd</TableCell>
        <TableCell>Pending</TableCell>
        <TableCell>$1,150.00</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>INV-1044</TableCell>
        <TableCell>Fabrikam Inc</TableCell>
        <TableCell>Overdue</TableCell>
        <TableCell>$3,890.00</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

// Row state styling: add (green), update (navy), delete (red), selected.
export const RowStates = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Task</TableHead>
        <TableHead>Owner</TableHead>
        <TableHead>State</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow state="add">
        <TableCell>Onboard new vendor</TableCell>
        <TableCell>Elena Petrova</TableCell>
        <TableCell>Added</TableCell>
      </TableRow>
      <TableRow state="update">
        <TableCell>Update tax profile</TableCell>
        <TableCell>Marcus Reilly</TableCell>
        <TableCell>Modified</TableCell>
      </TableRow>
      <TableRow state="delete">
        <TableCell>Remove duplicate</TableCell>
        <TableCell>Sofia Alvarez</TableCell>
        <TableCell>Deleted</TableCell>
      </TableRow>
      <TableRow state="selected">
        <TableCell>Review Q2 budget</TableCell>
        <TableCell>Hannah Lee</TableCell>
        <TableCell>Selected</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
