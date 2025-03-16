import type { Metadata } from "next";
import "../globals.css";
import ProviderWrapper from "../exmples/ProviderWrapper";



export const metadata: Metadata = {
  title: "TORCH Glare",
  description: "Welcome to the TORCH Glare Components Library! This library provides a collection of reusable React components to help you build user interfaces efficiently. Additionally, a CLI tool (TorchCorp CLI) is available to streamline component management.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" data-theme="dark">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <link

          rel="stylesheet"
          href="https://cdn.statically.io/gh/TORCH-Corp/SF-PRO-FONT/main/font/fonts.css"
        />

        <link
          rel="preload"
          href="https://cdn.statically.io/gh/TORCH-Corp/SF-PRO-FONT/main/font/SF-Pro.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
      >
        <ProviderWrapper>
          {children}
        </ProviderWrapper>
      </body>
    </html>
  );
}




