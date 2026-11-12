import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SITE } from "@/lib/content";
import "./globals.css";

const siteUrl = "https://pear.no";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE.title,
    template: "%s — Pear",
  },
  description: SITE.description,
  applicationName: "Pear",
  authors: [{ name: "Pear AS", url: siteUrl }],
  creator: "Pear AS",
  publisher: "Pear AS",
  category: "business",
  keywords: [
    "Pear",
    "revenue share agency",
    "custom software",
    "SEO",
    "search engine optimization",
    "growth partner",
    "Oslo",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Pear",
    title: SITE.title,
    description: SITE.description,
    locale: "en_GB",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Pear — not an agency on the clock, a partner in the upside.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#0b0a09",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Pear",
  legalName: "Pear AS",
  url: siteUrl,
  email: SITE.email,
  description: SITE.description,
  logo: `${siteUrl}/apple-touch-icon.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Oslo",
    addressCountry: "NO",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: SITE.email,
    availableLanguage: ["English", "Norwegian"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
