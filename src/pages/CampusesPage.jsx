import { ChevronRight, MapPin } from "lucide-react";
import { GhostButton, SectionHeading } from "../components/ui";
import { CAMPUSES } from "../lib/data";
import { C } from "../lib/theme";

export function CampusesPage({ go, campusStats }) {
  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px 24px 96px" }}>
      <SectionHeading eyebrow="Where fellows learn" title="Campuses" sub="Every fellow belongs to a Talent Nation campus. Explore each one and the projects it has produced." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {CAMPUSES.map((c) => (
          <div key={c.id} style={{ border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", background: C.white }}>
            <div style={{ height: 100, background: `linear-gradient(135deg, ${c.hue}, ${C.ink})` }} />
            <div style={{ padding: 22 }}>
              <p className="tn-display" style={{ fontSize: 19, fontWeight: 700, margin: "0 0 4px" }}>{c.name}</p>
              <p className="tn-body" style={{ fontSize: 13, color: C.slateLight, display: "flex", alignItems: "center", gap: 5, margin: "0 0 12px" }}><MapPin size={12} /> {c.city}, {c.country}</p>
              <p className="tn-body" style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.6, margin: "0 0 16px" }}>{c.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p className="tn-body" style={{ fontSize: 12.5, color: C.slate, margin: 0 }}>{campusStats.fellows[c.id] || 0} fellows · {campusStats.projects[c.id] || 0} projects</p>
                <GhostButton small onClick={() => go("campus", c.id)}>View campus <ChevronRight size={13} /></GhostButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
