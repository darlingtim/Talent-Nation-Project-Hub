import { C } from "../lib/theme";
import { ANCHORS, isPhotoUrl } from "../lib/data";
import { Avatar, Badge, GhostButton } from "../components/ui";

/* ----------------------------------- anchors ----------------------------------- */

export function AnchorsPage({ go, openAnchor }) {
  return (
    <div>
      <div style={{ background: C.ink, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h1 className="tn-display" style={{ color: C.white, fontSize: 34, fontWeight: 700, margin: "0 0 12px" }}>Meet the anchors behind Talent Nation</h1>
          <p className="tn-body" style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.6 }}>
            Meet the visionary leaders whose passion, experience, and commitment continue to shape the Talent Nation community.
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 28, marginBottom: 64, alignItems: "flex-start" }}>
          {ANCHORS.map((a, i) => {
            const compact = i >= 2; // the first two are the large cards; any others are smaller
            return (
              <div key={a.id} style={{ border: `1px solid ${C.line}`, borderRadius: compact ? 14 : 20, padding: compact ? 20 : 36, textAlign: "center", width: compact ? 300 : 420, maxWidth: "100%", boxSizing: "border-box" }}>
                <div style={{ margin: compact ? "0 auto 10px" : "0 auto 16px", display: "flex", justifyContent: "center" }}>
                  <Avatar name={a.name} size={compact ? 84 : 132} hue={a.tag === "Founder" ? C.gold : C.teal} photo={isPhotoUrl(a.photo) ? a.photo : undefined} />
                </div>
                <Badge tone={a.tag === "Founder" ? "gold" : "teal"} style={{ marginBottom: compact ? 6 : 10 }}>{a.tag}</Badge>
                <p className="tn-display" style={{ fontWeight: 700, fontSize: compact ? 16 : 20, margin: "0 0 2px" }}>{a.name}</p>
                <p className="tn-body" style={{ fontSize: compact ? 12 : 12.5, color: C.slateLight, margin: compact ? "0 0 8px" : "0 0 14px" }}>{a.role}</p>
                <p className="tn-body" style={{ fontSize: compact ? 12.5 : 14, color: C.slate, lineHeight: 1.6, margin: compact ? "0 0 12px" : "0 0 18px" }}>{a.shortBio}</p>
                <GhostButton small onClick={() => openAnchor(a.id)}>Read more</GhostButton>
              </div>
            );
          })}
        </div>

        <div style={{ background: C.paper, borderRadius: 20, padding: 40 }}>
          <p className="tn-display" style={{ fontSize: 13, fontWeight: 700, color: C.teal, margin: "0 0 10px" }}>Our vision</p>
          <p className="tn-body" style={{ fontSize: 17, color: C.ink, lineHeight: 1.7, margin: 0 }}>
            "We believe talent is distributed evenly, but opportunity isn't. Talent Nation exists to close that gap — one campus, one fellow, and one shipped project at a time. The Project Hub is where that work becomes visible to the people who can open doors: employers, funders, and other fellows."
          </p>
        </div>
      </div>
    </div>
  );
}
