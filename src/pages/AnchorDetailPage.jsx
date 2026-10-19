import { useState } from "react";
import { ArrowLeft, Link2, Quote } from "lucide-react";
import { isPhotoUrl } from "../lib/data";
import { Avatar, Badge, GhostButton, PhotoLightbox } from "../components/ui";
import { C } from "../lib/theme";

export function AnchorDetailPage({ anchor, go }) {
  const [openPhoto, setOpenPhoto] = useState(null);
  if (!anchor) return null;
  const gallery = (anchor.gallery || []).filter(isPhotoUrl);
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 96px" }}>
      <GhostButton small onClick={() => go("anchors")} style={{ marginBottom: 24 }}><ArrowLeft size={14} /> All anchors</GhostButton>
      <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 32 }}>
        <Avatar name={anchor.name} size={120} hue={anchor.tag === "Founder" ? C.gold : C.teal} photo={isPhotoUrl(anchor.photo) ? anchor.photo : undefined} />
        <div>
          <Badge tone={anchor.tag === "Founder" ? "gold" : "teal"} style={{ marginBottom: 8 }}>{anchor.tag}</Badge>
          <h1 className="tn-display" style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px" }}>{anchor.name}</h1>
          <p className="tn-body" style={{ fontSize: 14, color: C.slateLight, margin: 0 }}>{anchor.role}</p>
        </div>
      </div>
      {[["Background", anchor.background], ["Contribution to Talent Nation", anchor.contribution]].filter(([, val]) => val).map(([label, val]) => (
        <div key={label} style={{ marginBottom: 24 }}>
          <p className="tn-display" style={{ fontSize: 14.5, fontWeight: 700, margin: "0 0 6px" }}>{label}</p>
          <p className="tn-body" style={{ fontSize: 14, color: C.slate, lineHeight: 1.65, margin: 0 }}>{val}</p>
        </div>
      ))}
      <div style={{ marginBottom: 24 }}>
        <p className="tn-display" style={{ fontSize: 14.5, fontWeight: 700, margin: "0 0 8px" }}>Areas of expertise</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {anchor.expertise.map((e) => <Badge key={e} tone="teal">{e}</Badge>)}
        </div>
      </div>
      {anchor.vision && <div style={{ background: C.paper, borderRadius: 16, padding: 24, display: "flex", gap: 12 }}>
        <Quote size={18} color={C.teal} style={{ flexShrink: 0, marginTop: 2 }} />
        <p className="tn-body" style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>{anchor.vision}</p>
      </div>}

      <div style={{ marginTop: 36 }}>
        <p className="tn-display" style={{ fontSize: 14.5, fontWeight: 700, margin: "0 0 12px" }}>Gallery</p>
        {gallery.length === 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[0, 1, 2].map((n) => (
              <div key={n} className="tn-body" style={{ aspectRatio: "4 / 3", border: `1.5px dashed ${C.line}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, color: C.slateLight }}>
                Photos coming soon
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {gallery.map((src, n) => (
              <div
                key={n}
                onClick={() => setOpenPhoto(src)}
                title="Click to view full picture"
                style={{ aspectRatio: "4 / 3", borderRadius: 12, background: `url(${src}) center/cover`, cursor: "zoom-in", border: `1px solid ${C.line}` }}
              />
            ))}
          </div>
        )}
      </div>
      {openPhoto && <PhotoLightbox src={openPhoto} onClose={() => setOpenPhoto(null)} />}

      <div style={{ marginTop: 28 }}>
        <GhostButton small onClick={() => anchor.linkedin && window.open(anchor.linkedin, "_blank")}><Link2 size={14} /> LinkedIn</GhostButton>
      </div>
    </div>
  );
}
