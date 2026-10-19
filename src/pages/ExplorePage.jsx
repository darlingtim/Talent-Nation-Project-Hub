import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CAMPUSES, CATEGORIES, STATUSES } from "../lib/data";
import { C } from "../lib/theme";
import { GhostButton, SectionHeading } from "../components/ui";
import { ProjectCard } from "../components/ProjectCard";

/* ------------------------------- explore projects ------------------------------ */

export function ExplorePage({ go, openProject, liked, bookmarked, onLike, onBookmark, projects, loading }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [campus, setCampus] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Most recent");
  const [visible, setVisible] = useState(9);

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      const matchQuery = query.trim() === "" || p.title.toLowerCase().includes(query.toLowerCase()) || p.shortDesc.toLowerCase().includes(query.toLowerCase());
      const matchCategory = category === "All" || p.category === category || (category === "Others" && !CATEGORIES.includes(p.category));
      const matchCampus = campus === "All" || p.campusId === campus;
      const matchStatus = status === "All" || p.status === status;
      return matchQuery && matchCategory && matchCampus && matchStatus;
    });
    if (sort === "Most recent") list = [...list].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    if (sort === "Most viewed") list = [...list].sort((a, b) => b.views - a.views);
    if (sort === "Most liked") list = [...list].sort((a, b) => b.likes - a.likes);
    if (sort === "Alphabetical") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [projects, query, category, campus, status, sort]);

  const selectStyle = {
    padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`,
    fontSize: 13, color: C.ink, background: C.white,
  };

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px 24px 96px" }}>
      <SectionHeading eyebrow="Discover" title="Explore projects" sub={`Browse ${projects.length} approved project${projects.length !== 1 ? "s" : ""} built by Talent Nation fellows. Filter by category, campus, and status.`} />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Search size={16} color={C.slateLight} style={{ position: "absolute", left: 12, top: 12 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by name or description"
            className="tn-body"
            style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13.5, boxSizing: "border-box" }}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="tn-body" style={selectStyle}>
          <option>All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          <option value="Others">Others</option>
        </select>
        <select value={campus} onChange={(e) => setCampus(e.target.value)} className="tn-body" style={selectStyle}>
          <option value="All">All campuses</option>
          {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="tn-body" style={selectStyle}>
          <option value="All">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="tn-body" style={selectStyle}>
          {["Most recent", "Most viewed", "Most liked", "Alphabetical"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <p className="tn-body" style={{ fontSize: 13, color: C.slateLight, margin: "0 0 20px" }}>{filtered.length} project{filtered.length !== 1 ? "s" : ""} found</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: C.slateLight }} className="tn-body">Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: C.slateLight }} className="tn-body">
          {projects.length === 0 ? "No approved projects yet. Check back soon." : "No projects match those filters. Try widening your search."}
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {filtered.slice(0, visible).map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={openProject} liked={liked.has(p.id)} bookmarked={bookmarked.has(p.id)} onLike={onLike} onBookmark={onBookmark} />
            ))}
          </div>
          {visible < filtered.length && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <GhostButton onClick={() => setVisible((v) => v + 9)}>Load more projects</GhostButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
