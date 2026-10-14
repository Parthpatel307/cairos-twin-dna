import type {
  Metadata,
} from "next";

import "./globals.css";
import "./readability.css";
import "./premium.css";
import "./visual-hd.css";
import "./editorial-light.css";

import AppShell from "@/components/layout/AppShell";

import {
  ToastProvider,
} from "@/components/ui/ToastProvider";

export const metadata:
  Metadata = {
    title:
      "CAIROS Twin DNA",

    description:
      "Simulate autonomous agent actions before execution, govern risk with CAIROS, and explain failures with AgentDNA.",
  };

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AppShell>
            {children}
          </AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}