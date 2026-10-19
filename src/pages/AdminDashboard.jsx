import { useState } from "react";
import { Building2, CheckCircle2, FolderKanban, LayoutDashboard, ShieldCheck, Users, XCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CAMPUSES, CATEGORIES, PROJECTS, fellowName, getCampus, projectsByCampus } from "../lib/data";
import { C } from "../lib/theme";
import { GhostButton } from "../components/ui";

/* --------------------------------- admin dashboard -------------------------------- */

export function AdminDashboard() {
  const [pending, setPending] = useState([PROJECTS[8], PROJECTS[12], PROJECTS[14]]);
  const totalFellows = CAMPUSES.reduce((s, c) => s + c.fellowCount, 0);

  const byCampus = CAMPUSES.map((c) => ({ name: c.city, projects: projectsByCampus(c.id).length }));
  const byCategory = CATEGORIES.slice(0, 8).map((cat) => ({ name: cat.length > 10 ? cat.slice(0, 10) + "…" : cat, count: PROJECTS.filter((p) => p.category === cat).length }));

  const stats = [
    ["Total fellows", totalFellows.toLocaleString(), Users],
    ["Total projects", PROJECTS.length, FolderKanban],
    ["Total campuses", CAMPUSES.length, Building2],
    ["Pending approvals", pending.length, ShieldCheck],
  ];

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "40px 24px 96px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <LayoutDashboard size={20} color={C.ink} />
        <p className="tn-display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Administrator dashboard</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {stats.map(([label, val, Icon]) => (
          <div key={label} style={{ border: `1px solid ${C.line}`, borderRadius: 14, padding: 18 }}>
            <Icon size={16} color={C.teal} style={{ marginBottom: 8 }} />
            <p className="tn-display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 2px" }}>{val}</p>
            <p className="tn-body" style={{ fontSize: 12, color: C.slateLight, margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 20 }}>
          <p className="tn-display" style={{ fontSize: 14, fontWeight: 700, margin: "0 0 16px" }}>Projects by campus</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byCampus}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.slateLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.slateLight }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.line}` }} />
              <Bar dataKey="projects" radius={[6, 6, 0, 0]}>
                {byCampus.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? C.gold : C.teal} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 20 }}>
          <p className="tn-display" style={{ fontSize: 14, fontWeight: 700, margin: "0 0 16px" }}>Projects by category</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byCategory} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C.slateLight }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: C.slateLight }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.line}` }} />
              <Bar dataKey="count" fill={C.teal} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="tn-display" style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Pending project approvals</p>
      {pending.length === 0 ? (
        <p className="tn-body" style={{ color: C.slateLight, fontSize: 13.5 }}>No pending approvals right now.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pending.map((p) => (
            <div key={p.id} style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p className="tn-display" style={{ fontWeight: 700, fontSize: 14.5, margin: "0 0 3px" }}>{p.title}</p>
                <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: 0 }}>
                  Submitted by {p.fellowIds.map(fellowName).join(", ")} · {getCampus(p.campusId)?.name || "Campus"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <GhostButton small style={{ color: C.teal, borderColor: C.tealPale }} onClick={() => setPending((cur) => cur.filter((x) => x.id !== p.id))}>
                  <CheckCircle2 size={13} /> Approve
                </GhostButton>
                <GhostButton small style={{ color: C.danger, borderColor: "#F0D3D3" }} onClick={() => setPending((cur) => cur.filter((x) => x.id !== p.id))}>
                  <XCircle size={13} /> Reject
                </GhostButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
