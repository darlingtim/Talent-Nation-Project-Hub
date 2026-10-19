import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ArrowLeft, FolderKanban, MapPin, Sparkles, Trash2, Users } from "lucide-react";
import { C } from "../lib/theme";
import { Avatar, Badge, GhostButton, PrimaryButton, inputStyle } from "../components/ui";

export function CampusDetailPage({ campus, go, openFellow, openProject, allFellows, myMentorships, onMentorsChanged }) {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [mentors, setMentors] = useState([]);
  const [mentorEmail, setMentorEmail] = useState("");
  const [mentorError, setMentorError] = useState("");
  const [mentorBusy, setMentorBusy] = useState(false);

  const amHead = !!campus && myMentorships.some((m) => m.campus_id === campus.dbId && m.is_head);

  // Head of Campus + Coding Mentors for this campus (head listed first).
  const fetchMentors = () => {
    if (!campus?.dbId) return;
    supabase
      .from("campus_mentors")
      .select("user_id, is_head")
      .eq("campus_id", campus.dbId)
      .then(async ({ data, error }) => {
        if (error) {
          console.error("Failed to load mentors:", error);
          return;
        }
        const rows = data || [];
        if (rows.length === 0) {
          setMentors([]);
          return;
        }
        const { data: profs } = await supabase.from("profiles").select("*").in("id", rows.map((r) => r.user_id));
        const byId = {};
        (profs || []).forEach((p) => { byId[p.id] = p; });
        const merged = rows
          .map((r) => ({ ...r, profile: byId[r.user_id] }))
          .filter((r) => r.profile)
          .sort((a, b) => Number(b.is_head) - Number(a.is_head));
        setMentors(merged);
      });
  };
  useEffect(fetchMentors, [campus?.dbId]);

  const handleAddMentor = async (e) => {
    e.preventDefault();
    setMentorError("");
    if (!mentorEmail.trim()) return;
    setMentorBusy(true);
    const { error } = await supabase.rpc("add_campus_mentor", { p_campus: campus.dbId, p_email: mentorEmail.trim() });
    setMentorBusy(false);
    if (error) {
      setMentorError(error.message);
      return;
    }
    setMentorEmail("");
    fetchMentors();
    onMentorsChanged?.();
  };

  const handleRemoveMentor = async (m) => {
    if (!window.confirm(`Remove ${m.profile.full_name || "this mentor"} as a coding mentor?`)) return;
    const { error } = await supabase.rpc("remove_campus_mentor", { p_campus: campus.dbId, p_user: m.user_id });
    if (error) {
      window.alert(error.message);
      return;
    }
    fetchMentors();
  };

  // Real projects submitted under this campus.
  useEffect(() => {
    if (!campus?.dbId) return;
    setLoadingProjects(true);
    supabase
      .from("projects")
      .select("*")
      .eq("campus_id", campus.dbId)
      .eq("is_portfolio", false)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setLoadingProjects(false);
        if (error) {
          console.error("Failed to load campus projects:", error);
          return;
        }
        setProjects(data || []);
      });
  }, [campus?.dbId]);

  if (!campus) return null;
  const fellows = allFellows.filter((f) => f.campusId === campus.id && !f.isMentor);
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${campus.hue}, ${C.ink})`, padding: "56px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <GhostButton small dark onClick={() => go("campuses")} style={{ marginBottom: 20 }}><ArrowLeft size={14} /> All campuses</GhostButton>
          <h1 className="tn-display" style={{ color: C.white, fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>{campus.name}</h1>
          <p className="tn-body" style={{ color: "rgba(255,255,255,0.75)", fontSize: 14.5, display: "flex", alignItems: "center", gap: 6, margin: "0 0 16px" }}><MapPin size={14} /> {campus.city}, {campus.country}</p>
          <p className="tn-body" style={{ color: "rgba(255,255,255,0.85)", fontSize: 14.5, maxWidth: 560, lineHeight: 1.6 }}>{campus.desc}</p>
        </div>
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
          {[["Fellows", fellows.length, Users], ["Projects on hub", projects.length, FolderKanban], ["Completed", projects.filter((p) => p.status === "Completed").length, Sparkles]].map(([label, val, Icon]) => (
            <div key={label} style={{ border: `1px solid ${C.line}`, borderRadius: 14, padding: 18, textAlign: "center" }}>
              <Icon size={18} color={C.teal} style={{ marginBottom: 8 }} />
              <p className="tn-display" style={{ fontSize: 24, fontWeight: 700, margin: "0 0 2px" }}>{val}</p>
              <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        <p className="tn-display" style={{ fontSize: 17, fontWeight: 700, margin: "0 0 16px" }}>Campus leadership</p>
        {mentors.length === 0 ? (
          <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight, margin: "0 0 48px" }}>No Head of Campus has been assigned yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: amHead ? 16 : 48 }}>
            {mentors.map((m) => {
              const p = m.profile;
              const skills = p.skills || [];
              const canOpen = allFellows.some((f) => f.id === p.id);
              return (
                <div
                  key={m.user_id}
                  onClick={() => canOpen && openFellow(p.id)}
                  style={{ cursor: canOpen ? "pointer" : "default", border: `1px solid ${m.is_head ? C.gold : C.line}`, borderRadius: 16, padding: 18, background: C.white }}
                >
                  <Avatar name={p.full_name || "Mentor"} size={44} hue={campus.hue} photo={p.avatar_url} />
                  <p className="tn-display" style={{ fontWeight: 700, fontSize: 14.5, margin: "12px 0 2px" }}>{p.full_name || "Mentor"}</p>
                  <p className="tn-body" style={{ fontSize: 12.5, color: C.teal, fontWeight: 600, margin: "0 0 10px" }}>
                    {m.is_head ? "Head of Campus" : "Coding Mentor"}{p.user_name ? ` · @${p.user_name}` : ""}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                    {skills.slice(0, 2).map((s) => <Badge key={s}>{s}</Badge>)}
                  </div>
                  <p className="tn-body" style={{ fontSize: 12, color: C.slate, display: "flex", alignItems: "center", gap: 4, margin: 0 }}>
                    <MapPin size={11} /> {p.city || campus.city}
                  </p>
                  {amHead && !m.is_head && (
                    <div style={{ marginTop: 10 }} onClick={(e) => e.stopPropagation()}>
                      <GhostButton small style={{ color: C.danger, borderColor: "#F0D3D3" }} onClick={() => handleRemoveMentor(m)}>
                        <Trash2 size={12} /> Remove
                      </GhostButton>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {amHead && (
          <form onSubmit={handleAddMentor} style={{ border: `1px dashed ${C.line}`, borderRadius: 14, padding: 16, marginBottom: 48 }}>
            <p className="tn-body" style={{ fontSize: 13, fontWeight: 600, margin: "0 0 8px" }}>Add a coding mentor</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                value={mentorEmail}
                onChange={(e) => setMentorEmail(e.target.value)}
                placeholder="Email they signed up with"
                type="email"
                className="tn-body"
                style={{ ...inputStyle, flex: "1 1 240px", width: "auto" }}
              />
              <PrimaryButton small disabled={mentorBusy}>{mentorBusy ? "Adding…" : "Add mentor"}</PrimaryButton>
            </div>
            {mentorError && <p className="tn-body" style={{ fontSize: 13, color: C.danger, margin: "8px 0 0" }}>{mentorError}</p>}
          </form>
        )}

        <p className="tn-display" style={{ fontSize: 17, fontWeight: 700, margin: "0 0 16px" }}>Fellows from this campus</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 48 }}>
          {fellows.map((f) => (
            <div key={f.id} onClick={() => openFellow(f.id)} style={{ cursor: "pointer", border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, textAlign: "center" }}>
              <Avatar name={f.name} size={40} hue={campus.hue} photo={f.avatarUrl} />
              <p className="tn-body" style={{ fontSize: 12.5, fontWeight: 600, margin: "8px 0 0" }}>{f.name}</p>
            </div>
          ))}
        </div>
        {fellows.length === 0 && <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight, margin: "-32px 0 48px" }}>No fellows have joined this campus yet.</p>}

        <p className="tn-display" style={{ fontSize: 17, fontWeight: 700, margin: "0 0 16px" }}>Projects from this campus</p>
        {loadingProjects ? (
          <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight }}>Loading…</p>
        ) : projects.length === 0 ? (
          <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight }}>No projects from this campus yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {projects.map((p) => (
              <div key={p.id} onClick={() => openProject(p.id)} style={{ cursor: "pointer", border: `1px solid ${C.line}`, borderRadius: 14, padding: 16 }}>
                <p className="tn-display" style={{ fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>{p.title}</p>
                <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: 0 }}>{p.category} · {p.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
