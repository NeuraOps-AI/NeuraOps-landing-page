import LandingPage from "./landing-page";
import { logoForDate } from "./brand-schedule";

export const dynamic = "force-dynamic";
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://neuraops.in/#organization",
      name: "NeuraOps Technologies",
      alternateName: ["NeuraOps", "Neura Ops"],
      url: "https://neuraops.in/",
      logo: "https://neuraops.in/media/icon-512.png",
      email: "info@neuraops.in",
      description:
        "NeuraOps designs digital products, workflow automation, and AI systems for growing businesses.",
    },
    {
      "@type": "WebSite",
      "@id": "https://neuraops.in/#website",
      url: "https://neuraops.in/",
      name: "NeuraOps Technologies",
      alternateName: "NeuraOps",
      publisher: { "@id": "https://neuraops.in/#organization" },
      inLanguage: "en",
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://neuraops.in/#service",
      name: "NeuraOps Technologies",
      url: "https://neuraops.in/",
      email: "info@neuraops.in",
      serviceType: [
        "Digital product engineering",
        "Workflow automation",
        "AI systems",
        "Process optimization",
      ],
      areaServed: "Worldwide",
      parentOrganization: { "@id": "https://neuraops.in/#organization" },
    },
  ],
};

export default function Home() { return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><LandingPage initialLogo={logoForDate(new Date())} /></>; }
