import { ArrowLeft, Bookmark, Code2, FileText, Globe, Heart, PlayCircle, Share2 } from "lucide-react";
import { fellowName, getCampus } from "../lib/data";
import { Avatar, Badge, GhostButton, PrimaryButton, StatusDot } from "../components/ui";
import { C } from "../lib/theme";

/* -------------------------------- project detail -------------------------------- */

export function ProjectDetailPage({ project, go, openFellow, liked, bookmarked, onLike, onBookmark }) {
  if (!project) return null;
  const campus = getCampus(project.campusId);
  const isLiked = liked.has(project.id);
  const isBookmarked = bookmarked.has(project.id);
  const fields = [
    ["Problem statement", project.problem],
    ["Proposed solution", project.solution],
    ["Objectives", project.objectives],
    ["Target audience", project.audience],
    ["Challenges", project.challenges],
    ["Results", project.results],
    ["Impact", project.impact],
    ["Future plans", project.future],
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 96px" }}>
      <GhostButton small onClick={() => go("explore")} style={{ marginBottom: 24 }}><ArrowLeft size={14} /> Back to projects</GhostButton>

      <div style={{
        borderRadius: 20,
        background: project.cover
          ? `linear-gradient(to top, rgba(27,16,146,0.9), rgba(27,16,146,0.55)), url(${project.cover}) center/cover`
          : `linear-gradient(135deg, ${C.ink}, ${C.inkSoft})`,
        padding: 40, marginBottom: 32,
      }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <Badge tone="gold">{project.category}</Badge>
          <Badge tone="ink" style={{ border: "1px solid rgba(255,255,255,0.25)" }}><StatusDot status={project.status} /> {project.status}</Badge>
          <Badge tone="ink" style={{ border: "1px solid rgba(255,255,255,0.25)" }}>{project.year}</Badge>
        </div>
        <h1 className="tn-display" style={{ color: C.white, fontSize: 34, fontWeight: 700, margin: "0 0 12px" }}>{project.title}</h1>
        <p className="tn-body" style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, maxWidth: 640, lineHeight: 1.6, margin: "0 0 24px" }}>{project.shortDesc}</p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          {project.fellowIds.map((fid) => (
            <button key={fid} onClick={() => openFellow(fid)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
              <Avatar name={fellowName(fid)} size={30} hue={C.gold} />
              <span className="tn-body" style={{ color: C.white, fontSize: 13.5, fontWeight: 600 }}>{fellowName(fid)}</span>
            </button>
          ))}
          <span className="tn-body" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>· {campus?.name}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        <div>
          <p className="tn-body" style={{ fontSize: 15, color: C.slate, lineHeight: 1.7, marginBottom: 32 }}>{project.solution} {project.problem}</p>
          {fields.map(([label, val]) => (
            <div key={label} style={{ marginBottom: 22 }}>
              <p className="tn-display" style={{ fontSize: 14.5, fontWeight: 700, color: C.ink, margin: "0 0 6px" }}>{label}</p>
              <p className="tn-body" style={{ fontSize: 14, color: C.slate, lineHeight: 1.65, margin: 0 }}>{val}</p>
            </div>
          ))}

          <div style={{ marginTop: 32, padding: 20, borderRadius: 14, background: C.paper, border: `1px solid ${C.line}` }}>
            <p className="tn-display" style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Media</p>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1, background: C.white, borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}` }}>
                <PlayCircle size={16} color={C.teal} /> <span className="tn-body" style={{ fontSize: 12.5, color: C.slate }}>Demo video</span>
              </div>
              <div style={{ flex: 1, background: C.white, borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}` }}>
                <FileText size={16} color={C.teal} /> <span className="tn-body" style={{ fontSize: 12.5, color: C.slate }}>Project deck</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <PrimaryButton small onClick={() => onLike(project.id)} style={{ flex: 1, justifyContent: "center", background: isLiked ? C.dangerPale : C.gold, color: isLiked ? C.danger : C.ink }}>
                <Heart size={14} fill={isLiked ? C.danger : "none"} /> {project.likes + (isLiked ? 1 : 0)}
              </PrimaryButton>
              <GhostButton small onClick={() => onBookmark(project.id)} style={{ borderColor: isBookmarked ? C.goldDeep : C.line }}>
                <Bookmark size={14} fill={isBookmarked ? C.goldDeep : "none"} color={isBookmarked ? C.goldDeep : C.ink} />
              </GhostButton>
              <GhostButton small><Share2 size={14} /></GhostButton>
            </div>
            <p className="tn-body" style={{ fontSize: 12, color: C.slateLight, textAlign: "center", margin: 0 }}>{project.views.toLocaleString()} views</p>
          </div>

          <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <p className="tn-display" style={{ fontSize: 13.5, fontWeight: 700, margin: "0 0 12px" }}>Links</p>
            {[["Github repository", Code2, project.github], ["Live demo", Globe, project.demo]]
              .filter(([, , url]) => url && url !== "#")
              .map(([label, Icon, url], i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="tn-body" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.teal, textDecoration: "none", padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.line}` : "none" }}>
                  <Icon size={14} /> {label}
                </a>
              ))}
            {(!project.github || project.github === "#") && (!project.demo || project.demo === "#") && (
              <p className="tn-body" style={{ fontSize: 13, color: C.slate, margin: 0 }}>No links added yet.</p>
            )}
          </div>

          <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 20 }}>
            <p className="tn-display" style={{ fontSize: 13.5, fontWeight: 700, margin: "0 0 12px" }}>Technologies</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {project.technologies.map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
