import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogLabel,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "torch-glare";

// Canonical destructive confirmation (error variant).
export const Confirm = () => (
  <AlertDialog defaultOpen>
    <AlertDialogContent variant="error">
      <AlertDialogHeader>
        <AlertDialogLabel title="Delete project" />
        <AlertDialogCancel><i className="ri-close-line" /></AlertDialogCancel>
      </AlertDialogHeader>
      <AlertDialogDescription>
        This permanently deletes <strong>Acme Marketing Site</strong> and all of its
        deployments. This action cannot be undone.
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogAction variant="BorderStyle">Cancel</AlertDialogAction>
        <AlertDialogAction variant="RedSecStyle">Delete project</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// Informational variant — colored heading + body.
export const Info = () => (
  <AlertDialog defaultOpen>
    <AlertDialogContent variant="info">
      <AlertDialogHeader>
        <AlertDialogLabel title="Update available" />
        <AlertDialogCancel><i className="ri-close-line" /></AlertDialogCancel>
      </AlertDialogHeader>
      <AlertDialogDescription>
        <strong>Version 1.3.0</strong> is ready to install. Your workspace will reload
        once the update completes.
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogAction variant="BorderStyle">Later</AlertDialogAction>
        <AlertDialogAction variant="BlueSecStyle">Install now</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// Success variant.
export const Success = () => (
  <AlertDialog defaultOpen>
    <AlertDialogContent variant="success">
      <AlertDialogHeader>
        <AlertDialogLabel title="Payment received" />
        <AlertDialogCancel><i className="ri-close-line" /></AlertDialogCancel>
      </AlertDialogHeader>
      <AlertDialogDescription>
        Your invoice <strong>#INV-2041</strong> has been paid. A receipt was emailed to
        billing@acme.com.
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogAction variant="PrimeStyle">Done</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
