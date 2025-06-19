// app/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title: "PassPoint",
  description: "Get resume feedback before you apply.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
