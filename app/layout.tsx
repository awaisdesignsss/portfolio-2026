import type { Metadata } from "next";
import PointerFX from "@/components/pointer-fx";
import "./globals.css";
// Original portfolio stylesheet — reused verbatim so migrated pages keep
// their exact design. Imported after globals so it wins over Tailwind base.
import "@/styles.css";

export const metadata: Metadata = {
  title: "M. Awais — UX/UI & Product Designer",
  description: "Portfolio 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark js">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:wght@200;400;500;600;700&family=Kolker+Brush&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PointerFX />
        {children}
      </body>
    </html>
  );
}
