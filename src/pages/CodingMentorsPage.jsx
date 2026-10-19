import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Search } from "lucide-react";
import { CAMPUSES, getCampus, getCampusByDbId } from "../lib/data";
import { MentorCard } from "../components/MentorCard";
import { SectionHeading } from "../components/ui";
import { C } from "../lib/theme";

export function CodingMentorsPage({ openFellow, allFellows }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campusFilter, setCampusFilter] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      const { data: cm, error } = await supabase.from("campus_mentors").select("user_id, campus_id, is_head");
      if (error) {
        console.error("Failed to load coding mentors:", error);
        setLoading(false);
        return;
      }
      const list = cm || [];
      const ids = Array.from(new Set(list.map((r) => r.user_id)));
      let profs = [];
      let portfolios = [];
      if (ids.length > 0) {
        const [{ data: p }, { data: pf }] = await Promise.all([
          supabase.from("profiles").select("*").in("id", ids),
          supabase
            .from("projects")
            .select("id, created_by, title, cover_image_url, demo_url, created_at")
            .eq("is_portfolio", true)
            .in("created_by", ids)
            .order("created_at", { ascending: false }),
        ]);
        profs = p || [];
        portfolios = pf || [];
      }
      const byId = {};
      profs.forEach((x) => { byId[x.id] = x; });
      const latestPortfolio = {};
      portfolios.forEach((x) => { if (!latestPortfolio[x.created_by]) latestPortfolio[x.created_by] = x; });
      setRows(
        list
          .map((r) => ({ ...r, profile: byId[r.user_id], portfolio: latestPortfolio[r.user_id] }))
          .filter((r) => r.profile)
          .sort((a, b) => (a.profile.full_name || "").localeCompare(b.profile.full_name || "")),
      );
      setLoading(false);
    })();
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) => {
    const campus = getCampusByDbId(r.campus_id);
    const matchCampus = campusFilter === "All" || campus?.id === campusFilter;
    const text = [r.profile.full_name, r.profile.user_name, ...(r.profile.skills || [])].join(" ").toLowerCase();
    return matchCampus && (!q || text.includes(q));
  });
  const heads = filtered.filter((r) => r.is_head);
  const mentors = filtered.filter((r) => !r.is_head);
  const selectedCampus = campusFilter === "All" ? null : getCampus(campusFilter);

  const grid = (list) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
      {list.map((m) => {
        const canOpen = allFellows.some((f) => f.id === m.user_id);
        return (
          <MentorCard
            key={`${m.campus_id}-${m.user_id}`}
            m={m}
            campus={getCampusByDbId(m.campus_id)}
            onOpen={canOpen ? () => openFellow(m.user_id) : null}
          />
        );
      })}
    </div>
  );

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "56px 24px 96px" }}>
      <SectionHeading
        eyebrow="Guides and builders"
        title="Coding Mentors"
        sub="Meet the Heads of Campus and Coding Mentors who guide Talent Nation fellows. Pick a campus to find a particular mentor."
      />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
        <select
          value={campusFilter}
          onChange={(e) => setCampusFilter(e.target.value)}
          className="tn-body"
          style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13.5, background: C.white, minWidth: 220 }}
        >
          <option value="All">All campuses</option>
          {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Search size={15} color={C.slateLight} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or skill"
            className="tn-body"
            style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13.5, boxSizing: "border-box" }}
          />
        </div>
      </div>

      {loading ? (
        <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight }}>Loading…</p>
      ) : (
        <>
          <p className="tn-display" style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>
            {selectedCampus ? `Head of ${selectedCampus.name}` : "Heads of Campus"}
          </p>
          {heads.length === 0 ? (
            <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight, margin: "0 0 40px" }}>
              {selectedCampus ? "This campus doesn't have a Head yet." : "No Heads of Campus match your search."}
            </p>
          ) : (
            <div style={{ marginBottom: 48 }}>{grid(heads)}</div>
          )}

          <p className="tn-display" style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>
            {selectedCampus ? `Coding Mentors at ${selectedCampus.name}` : "All Coding Mentors"}
          </p>
          {mentors.length === 0 ? (
            <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight, margin: 0 }}>
              {selectedCampus ? "No coding mentors have been added to this campus yet." : "No coding mentors match your search."}
            </p>
          ) : grid(mentors)}
        </>
      )}
    </div>
  );
}
