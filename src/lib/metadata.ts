import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteMeta = {
  name: "Abdur Raheem",
  shortName: "Abdur",
  title: "Abdur Raheem — Full-Stack Engineer",
  description:
    "Full-stack engineer shipping AI-native products end-to-end — Next.js, TypeScript, PostgreSQL, RAG and real-time systems. Based in Chennai, open to remote.",
  email: "abdurraheem000nyx@gmail.com",
  location: "Chennai, India",
  github: "https://github.com/Nyx-abu",
  linkedin: "https://linkedin.com/in/abdur-raheem-k",
  ogImage: "/opengraph-image",
  twitter: "",
} as const;

type BuildMetaInput = {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  ogImage,
  noindex,
}: BuildMetaInput = {}): Metadata {
  const fullTitle = title ? `${title} — ${siteMeta.name}` : siteMeta.title;
  const desc = description ?? siteMeta.description;
  const url = new URL(path, siteUrl).toString();
  const image = ogImage ?? siteMeta.ogImage;

  return {
    metadataBase: new URL(siteUrl),
    title: fullTitle,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: siteMeta.name,
      images: [{ url: image, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [image],
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}
