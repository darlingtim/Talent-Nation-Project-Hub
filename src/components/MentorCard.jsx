import { ExternalLink, MapPin } from "lucide-react";
import { C } from "../lib/theme";
import { Avatar, Badge, PrimaryButton } from "./ui";

/* ---------------------------------- campuses ---------------------------------- */

/* --------------------------------- coding mentors --------------------------------- */

// One mentor / Head of Campus card, with their portfolio if they uploaded one.
export function MentorCard({ m, campus, onOpen }) {
  const p = m.profile;
  const skills = p.skills || [];
  const pf = m.portfolio;
  return (
    <div
      onClick={onOpen || undefined}
      style={{ cursor: onOpen ? "pointer" : "default", border: `1px solid ${m.is_head ? C.gold : C.line}`, borderRadius: 16, padding: 18, background: C.white, display: "flex", flexDirection: "column" }}
    >
      <Avatar name={p.full_name || "Mentor"} size={52} hue={campus?.hue || C.teal} photo={p.avatar_url} />
      <p className="tn-display" style={{ fontWeight: 700, fontSize: 15, margin: "12px 0 2px" }}>{p.full_name || "Mentor"}</p>
      <p className="tn-body" style={{ fontSize: 12.5, color: C.teal, fontWeight: 600, margin: "0 0 4px" }}>
        {m.is_head ? "Head of Campus" : "Coding Mentor"}{p.user_name ? ` · @${p.user_name}` : ""}
      </p>
      <p className="tn-body" style={{ fontSize: 12, color: C.slate, display: "flex", alignItems: "center", gap: 4, margin: "0 0 10px" }}>
        <MapPin size={11} /> {campus?.name || "Campus"}
      </p>
      {skills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
          {skills.slice(0, 3).map((s) => <Badge key={s}>{s}</Badge>)}
        </div>
      )}
      {pf && (
        <div style={{ marginTop: "auto" }} onClick={(e) => e.stopPropagation()}>
          {pf.cover_image_url && (
            <div style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.line}`, marginBottom: 10, background: C.paperDeep }}>
              <img src={pf.cover_image_url} alt={`${p.full_name || "Mentor"}'s portfolio`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          )}
          {pf.demo_url && (
            <PrimaryButton small onClick={() => window.open(pf.demo_url, "_blank", "noopener,noreferrer")} style={{ width: "100%", justifyContent: "center" }}>
              <ExternalLink size={13} /> View portfolio
            </PrimaryButton>
          )}
        </div>
      )}
    </div>
  );
}
