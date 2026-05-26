import { Suspense } from "react";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { FadeIn } from "@/components/motion/FadeIn";
import { Footer } from "@/components/sections/Footer";
import { getSocialLinks } from "@/lib/data";
import { siteMeta, siteUrl } from "@/lib/metadata";

export const revalidate = 300;

export default async function HomePage() {
  const social = await getSocialLinks();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteMeta.name,
    url: siteUrl,
    sameAs: social.map((s) => s.url),
    jobTitle: "Full-Stack Engineer",
    email: siteMeta.email,
    address: { "@type": "PostalAddress", addressLocality: "Chennai", addressCountry: "IN" },
  };

  return (
    <SmoothScroll>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main id="main">
        <Hero />
        <FadeIn><div className="hairline max-w-7xl mx-auto" /></FadeIn>
        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>
        <FadeIn><div className="hairline max-w-7xl mx-auto" /></FadeIn>
        <Suspense fallback={<SectionSkeleton />}>
          <Projects />
        </Suspense>
        <FadeIn><div className="hairline max-w-7xl mx-auto" /></FadeIn>
        <Suspense fallback={<SectionSkeleton />}>
          <Experience />
        </Suspense>
        <FadeIn><div className="hairline max-w-7xl mx-auto" /></FadeIn>
        <Contact email={siteMeta.email} social={social} />
      </main>
      <Footer social={social} />
    </SmoothScroll>
  );
}

function SectionSkeleton() {
  return <div className="min-h-[60vh]" aria-hidden />;
}
