import React from "react";
import { LoginButton } from "torch-glare";

// The two variants — full-width auth buttons for sign-in forms.
export const Variants = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 340 }}>
    <LoginButton variant="default">Sign In with Email</LoginButton>
    <LoginButton variant="noBg">Sign In with Email</LoginButton>
  </div>
);

// Social / OAuth sign-in with leading provider icons.
export const SocialLogin = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 340 }}>
    <LoginButton variant="default"><i className="ri-google-fill" style={{ marginRight: 8 }} />Continue with Google</LoginButton>
    <LoginButton variant="noBg"><i className="ri-github-fill" style={{ marginRight: 8 }} />Continue with GitHub</LoginButton>
    <LoginButton variant="noBg"><i className="ri-microsoft-fill" style={{ marginRight: 8 }} />Continue with Microsoft</LoginButton>
  </div>
);

// Loading and disabled states.
export const States = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 340 }}>
    <LoginButton variant="default" isLoading>Signing in...</LoginButton>
    <LoginButton variant="default" disabled>Sign In</LoginButton>
  </div>
);
