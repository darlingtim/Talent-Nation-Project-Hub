import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ArrowLeft } from "lucide-react";
import { CAMPUSES } from "../lib/data";
import { C } from "../lib/theme";
import { Badge, GhostButton, PrimaryButton, SectionHeading } from "../components/ui";

/* ---------------------------------- head requests ---------------------------------- */

export function HeadRequestsPage({ go, openFellow, onChanged }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    supabase.rpc("list_head_requests").then(({ data, error: rpcError }) => {
      setLoading(false);
      if (rpcError) {
        setError(rpcError.message);
        return;
      }
      setRows(data || []);
    });
  };
  useEffect(load, []);

  const decide = async (r, approve) => {
    if (approve && r.current_head) {
      const ok = window.confirm(`${r.current_head} is the current Head of this campus. Approving will move them to Coding Mentor. Continue?`);
      if (!ok) return;
    }
    setError("");
    setBusyId(r.id);
    const { error: rpcError } = await supabase.rpc(approve ? "approve_head_request" : "reject_head_request", { p_request: r.id });
    setBusyId(null);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    load();
    onChanged?.();
  };

  const pending = rows.filter((r) => r.status === "pending");
  const decided = rows.filter((r) => r.status !== "pending");

  const renderRow = (r) => {
    const campus = CAMPUSES.find((c) => c.dbId === r.campus_id);
    return (
      <div key={r.id} style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div style={{ flex: "1 1 300px" }}>
            <p className="tn-display" style={{ fontWeight: 700, fontSize: 15, margin: "0 0 3px" }}>{r.full_name || "New member"}</p>
            <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: "0 0 8px" }}>
              {r.email} · wants to lead <b>{campus?.name || "a campus"}</b> · {new Date(r.created_at).toLocaleDateString()}
            </p>
            {r.note && <p className="tn-body" style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.6, margin: "0 0 8px" }}>"{r.note}"</p>}
            {r.current_head && r.status === "pending" && (
              <p className="tn-body" style={{ fontSize: 12.5, color: C.goldDeep, margin: 0 }}>This campus already has a Head: {r.current_head}.</p>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <GhostButton small onClick={() => openFellow(r.user_id)}>View profile</GhostButton>
            {r.status === "pending" ? (
              <>
                <GhostButton small disabled={busyId === r.id} onClick={() => decide(r, false)}>Reject</GhostButton>
                <PrimaryButton small disabled={busyId === r.id} onClick={() => decide(r, true)}>{busyId === r.id ? "Working…" : "Approve"}</PrimaryButton>
              </>
            ) : (
              <Badge tone={r.status === "approved" ? "teal" : "gold"}>{r.status}</Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 96px" }}>
      <GhostButton small onClick={() => go("dashboard")} style={{ marginBottom: 24 }}><ArrowLeft size={14} /> Back to dashboard</GhostButton>
      <SectionHeading eyebrow="Owner tools" title="Head of Campus requests" sub="People who signed up as a Head of Campus. Approve the ones who are qualified." />
      {error && <p className="tn-body" style={{ fontSize: 13, color: C.danger }}>{error}</p>}
      {loading ? (
        <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight }}>Loading…</p>
      ) : (
        <>
          <p className="tn-display" style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Waiting for your decision ({pending.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
            {pending.length === 0 ? <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight }}>No pending requests.</p> : pending.map(renderRow)}
          </div>
          {decided.length > 0 && (
            <>
              <p className="tn-display" style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Decided</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{decided.map(renderRow)}</div>
            </>
          )}
        </>
      )}
    </div>
  );
}
