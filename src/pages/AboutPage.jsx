import { ChevronRight } from "lucide-react";
import { PrimaryButton, SectionHeading } from "../components/ui";
import { C } from "../lib/theme";

/* ------------------------------------ about ------------------------------------ */

export function AboutPage({ go }) {
  const sections = [
    ["Who we are", "Talent Nation is a fellowship community that trains, supports, and showcases early-career tech talent across our campuses."],
    ["Our story", "Talent Nation began in 2021 as a small study group and has grown into a multi-campus fellowship spanning two countries."],
    ["Mission", "To close the gap between talent and opportunity by giving fellows the skills, community, and visibility to build real careers."],
    ["Vision", "A future where a fellow's postcode has nothing to do with the ceiling on their career."],
    ["Core values", "Community over competition, evidence over credentials, and consistency over intensity."],
    ["What we do", "We run a project-based fellowship, connect fellows with employers, and maintain the Project Hub as a public record of what fellows build."],
    ["How the fellowship works", "Fellows join a campus, work through a project-based curriculum, and graduate with a portfolio of shipped work rather than just certificates."],
    ["Impact", "Fellows from Talent Nation campuses have gone on to roles at startups, agencies, and larger tech employers across the region."],
  ];
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 96px" }}>
      <SectionHeading eyebrow="About us" title="Talent Nation" sub="A community-first fellowship building the next generation of tech talent." />
      {sections.map(([title, body]) => (
        <div key={title} style={{ marginBottom: 28 }}>
          <p className="tn-display" style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>{title}</p>
          <p className="tn-body" style={{ fontSize: 14.5, color: C.slate, lineHeight: 1.7, margin: 0 }}>{body}</p>
        </div>
      ))}
      <div style={{ background: C.ink, borderRadius: 16, padding: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <p className="tn-body" style={{ color: C.white, fontSize: 14.5, margin: 0 }}>Curious who's behind it all?</p>
        <PrimaryButton onClick={() => go("anchors")}>Meet the anchors <ChevronRight size={16} /></PrimaryButton>
      </div>
    </div>
  );
}
