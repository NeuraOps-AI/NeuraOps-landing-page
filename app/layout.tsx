import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://neuraops.in"),
  title: {
    default: "NeuraOps | AI, Automation & Digital Product Engineering",
    template: "%s | NeuraOps Technologies",
  },
  description:
    "NeuraOps designs digital products, workflow automation, and AI systems that turn complex business operations into scalable growth.",
  keywords: [
    "AI automation company",
    "workflow automation",
    "digital product development",
    "AI systems",
    "business process optimization",
    "custom software development",
    "NeuraOps Technologies",
  ],
  authors: [{ name: "NeuraOps Technologies", url: "https://neuraops.in" }],
  creator: "NeuraOps Technologies",
  publisher: "NeuraOps Technologies",
  alternates: { canonical: "/" },
  category: "technology",
  applicationName: "NeuraOps Technologies",
  icons: {
    icon: [
      { url: "/media/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/media/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/media/icon-192.png", sizes: "192x192" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "NeuraOps Technologies",
    title: "Build systems that let your business think ahead.",
    description:
      "Digital products, intelligent automation, and AI systems designed around the way your business works.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "NeuraOps Technologies — intelligent digital operations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuraOps Technologies",
    description:
      "Digital products, intelligent automation, and AI systems designed around your operation.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020817",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
