import { Building2, ChevronRight, FolderKanban, Sparkles, Users } from "lucide-react";
import { CAMPUSES, CATEGORIES } from "../lib/data";
import { C } from "../lib/theme";
import { Badge, GhostButton, PrimaryButton, SectionHeading } from "../components/ui";
import { ProjectCard } from "../components/ProjectCard";

/* ---------------------------------- home page --------------------------------- */

export function HomePage({ go, openProject, liked, bookmarked, onLike, onBookmark, recentProjects, campusStats }) {
  const totalFellows = campusStats.totalFellows;
  const totalProjects = campusStats.totalProjects;
  // Show real fellow-submitted projects (most recent first) once any exist;
  // fall back to the curated mock "featured" set until then.
  const featured = recentProjects || [];
  const stats = [
    { label: "Fellows", value: totalFellows.toLocaleString(), icon: Users },
    { label: "Projects", value: totalProjects.toLocaleString(), icon: FolderKanban },
    { label: "Campuses", value: CAMPUSES.length, icon: Building2 },
    { label: "Categories", value: CATEGORIES.length, icon: Sparkles },
  ];

  return (
    <>
      <div style={{ background: C.ink, position: "relative", overflow: "hidden", paddingBottom: 60 }}>
        <div style={{
          position: "absolute", top: -180, left: "50%", transform: "translateX(-50%)",
          width: 640, height: 640, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(38,41,183,0.55) 0%, transparent 70%)`,
        }} />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "96px 24px 40px", position: "relative", textAlign: "center" }}>
          <Badge tone="ink" style={{ border: "1px solid rgba(255,255,255,0.25)", marginBottom: 22 }}>
            <Sparkles size={12} /> {totalFellows.toLocaleString()} fellows across {CAMPUSES.length} campuses
          </Badge>
          <h1 className="tn-display" style={{ color: C.white, fontSize: 52, fontWeight: 700, lineHeight: 1.08, margin: "0 0 20px" }}>
            Discover ideas. Explore innovation.<br />Celebrate talent.
          </h1>
          <p className="tn-body" style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.6, maxWidth: 620, margin: "0 auto 32px" }}>
            Explore projects created by Talent Nation fellows across our campuses, and discover the people, ideas, and solutions shaping the future.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <PrimaryButton onClick={() => go("explore")}>Explore projects <ChevronRight size={16} /></PrimaryButton>
            <GhostButton dark onClick={() => go("fellows")}>Meet the fellows</GhostButton>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ background: C.white, borderRadius: 18, padding: "26px 20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", boxShadow: "0 24px 60px rgba(0,0,0,0.28)" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center", borderRight: s.label !== "Categories" ? `1px solid ${C.line}` : "none" }}>
                <s.icon size={18} color={C.teal} style={{ marginBottom: 6 }} />
                <p className="tn-display" style={{ fontSize: 26, fontWeight: 700, margin: "0 0 2px", color: C.ink }}>{s.value}</p>
                <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "72px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <SectionHeading
            eyebrow="Spotlight"
            title={recentProjects && recentProjects.length > 0 ? "Recently submitted projects" : "Featured projects"}
            sub={recentProjects && recentProjects.length > 0 ? "The latest projects submitted by Talent Nation fellows." : "A rotating selection of standout work, chosen by the Talent Nation team."}
          />
          <GhostButton small onClick={() => go("explore")}>View all projects <ChevronRight size={14} /></GhostButton>
        </div>
        {featured.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 20, gridTemplateRows: "auto auto" }}>
            <div style={{ gridRow: "span 2" }}>
              <ProjectCard project={featured[0]} onOpen={openProject} liked={liked.has(featured[0].id)} bookmarked={bookmarked.has(featured[0].id)} onLike={onLike} onBookmark={onBookmark} big />
            </div>
            {featured.slice(1, 5).map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={openProject} liked={liked.has(p.id)} bookmarked={bookmarked.has(p.id)} onLike={onLike} onBookmark={onBookmark} />
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 24px 0" }}>
        <SectionHeading eyebrow="Where fellows learn" title="Our campuses" sub="Eight campuses, each with its own strengths and specialties." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {CAMPUSES.map((c) => (
            <div key={c.id} onClick={() => go("campus", c.id)} style={{ cursor: "pointer", borderRadius: 14, border: `1px solid ${C.line}`, padding: 18, background: C.white }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: c.hue, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Building2 size={18} color={C.white} />
              </div>
              <p className="tn-display" style={{ fontWeight: 700, fontSize: 15, margin: "0 0 4px", color: C.ink }}>{c.name}</p>
              <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: "0 0 10px" }}>{c.city}, {c.country}</p>
              <p className="tn-body" style={{ fontSize: 12.5, color: C.slate, margin: 0 }}>{campusStats.fellows[c.id] || 0} fellows · {campusStats.projects[c.id] || 0} projects</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 24px 96px" }}>
        <div style={{ background: C.teal, borderRadius: 24, padding: "56px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div style={{ maxWidth: 460 }}>
            <h3 className="tn-display" style={{ color: C.white, fontSize: 26, fontWeight: 700, margin: "0 0 10px" }}>Meet the visionaries building the future of tech talent.</h3>
            <p className="tn-body" style={{ color: "rgba(255,255,255,0.8)", fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>
              Get to know the leaders who inspire, guide and open doors for every Talent Nation fellow.
            </p>
          </div>
          <PrimaryButton onClick={() => go("anchors")}>Meet the anchors <ChevronRight size={16} /></PrimaryButton>
        </div>
      </div>
    </>
  );
}
