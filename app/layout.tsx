import type { Metadata, Viewport } from "next";
import PointerFX from "@/components/pointer-fx";
import NavPill from "@/components/nav-pill";
import SmoothScroll from "@/components/smooth-scroll";
import "./globals.css";
// Original portfolio stylesheet — reused verbatim so migrated pages keep
// their exact design. Imported after globals so it wins over Tailwind base.
import "@/styles.css";

export const metadata: Metadata = {
  title: "M. Awais · Senior Product Designer",
  description:
    "Senior Product Designer with six years turning complex products across fintech, healthcare, hospitality, and SaaS into experiences people understand on the first try.",
  applicationName: "M. Awais · Senior Product Designer",
  authors: [{ name: "awais" }],
  referrer: "origin-when-cross-origin",
  creator: "awais",
  publisher: "awaisdesigns",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://awaisdesigns.com/"),
  openGraph: {
    title: "M. Awais · Senior Product Designer",
    description:
      "Senior Product Designer with six years turning complex products across fintech, healthcare, hospitality, and SaaS into experiences people understand on the first try.",
    url: "https://awaisdesigns.com/",
    siteName: "M. Awais · Senior Product Designer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "M. Awais · Senior Product Designer",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "M. Awais · Senior Product Designer",
    description:
      "Senior Product Designer with six years turning complex products across fintech, healthcare, hospitality, and SaaS into experiences people understand on the first try.",
    creator: "awais",
    images: {
      url: "/og-image.png",
      alt: "M. Awais · Senior Product Designer",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "dark",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark js" suppressHydrationWarning>
      <head>
        {/* Flag the intro splash before first paint, home route only, so the
            hero never flashes and repeat/reduced-motion visits skip it. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(location.pathname==='/'&&!sessionStorage.getItem('awais-splash')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('splashing')}}catch(e){}",
          }}
        />
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
        <SmoothScroll />
        <PointerFX />
        <NavPill />
        {children}
      </body>
    </html>
  );
}
